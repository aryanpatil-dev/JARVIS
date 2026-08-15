import os from 'os';
import { exec } from 'child_process';
import { DetailedSystemStats, ProcessInfo } from '../../shared/ipc-channels';

export class TelemetryService {
  private prevCpuTimes: { idle: number; total: number }[] = [];

  constructor() {
    this.sampleCpuTimes();
  }

  private sampleCpuTimes() {
    const cpus = os.cpus();
    this.prevCpuTimes = cpus.map((cpu) => {
      const total = Object.values(cpu.times).reduce((acc, tv) => acc + tv, 0);
      return { idle: cpu.times.idle, total };
    });
  }

  public getDetailedStats(): DetailedSystemStats {
    const currentCpus = os.cpus();
    const coreUsages: number[] = [];
    let totalUsageSum = 0;

    for (let i = 0; i < currentCpus.length; i++) {
      const cpu = currentCpus[i];
      const currentTotal = Object.values(cpu.times).reduce((acc, tv) => acc + tv, 0);
      const currentIdle = cpu.times.idle;

      const prev = this.prevCpuTimes[i] || { idle: currentIdle, total: currentTotal };
      const totalDiff = currentTotal - prev.total;
      const idleDiff = currentIdle - prev.idle;

      const usage = totalDiff > 0 ? Math.max(0, Math.min(100, Math.round(((totalDiff - idleDiff) / totalDiff) * 100))) : 0;
      coreUsages.push(usage);
      totalUsageSum += usage;
    }

    this.sampleCpuTimes();
    const overallCpu = currentCpus.length > 0 ? Math.round(totalUsageSum / currentCpus.length) : 0;

    const totalMem = os.totalmem();
    const freeMem = os.freemem();
    const usedMem = totalMem - freeMem;
    const uptimeSec = os.uptime();

    const hours = Math.floor(uptimeSec / 3600);
    const minutes = Math.floor((uptimeSec % 3600) / 60);

    return {
      cpuUsage: overallCpu,
      cpuCoresUsage: coreUsages,
      cpuModel: currentCpus[0]?.model || 'Generic Host CPU',
      totalMemoryGB: (totalMem / (1024 ** 3)).toFixed(1),
      usedMemoryGB: (usedMem / (1024 ** 3)).toFixed(1),
      freeMemoryGB: (freeMem / (1024 ** 3)).toFixed(1),
      memoryUsagePercent: Math.round((usedMem / totalMem) * 100),
      activeProcessesCount: 0,
      uptimeFormatted: `${hours}h ${minutes}m`,
      platform: process.platform === 'win32' ? 'Windows x64' : process.platform,
    };
  }

  public async getProcesses(): Promise<ProcessInfo[]> {
    return new Promise((resolve) => {
      if (process.platform === 'win32') {
        // Use tasklist for fast lightweight windows process metrics
        exec('tasklist /FO CSV /NH', { maxBuffer: 1024 * 1024 }, (err, stdout) => {
          if (err || !stdout) {
            return resolve([]);
          }

          const lines = stdout.trim().split('\r\n');
          const processes: ProcessInfo[] = [];

          for (const line of lines) {
            const parts = line.split('","').map((p) => p.replace(/"/g, ''));
            if (parts.length >= 5) {
              const name = parts[0];
              const pid = parseInt(parts[1], 10);
              const memStr = parts[4].replace(/[^0-9]/g, '');
              const memoryMB = Math.round((parseInt(memStr, 10) || 0) / 1024);

              if (pid && name) {
                processes.push({
                  pid,
                  name,
                  cpu: 0,
                  memory: memoryMB,
                  status: 'RUNNING',
                });
              }
            }
          }

          // Sort by highest memory consumption and take top 25
          const sorted = processes.sort((a, b) => b.memory - a.memory).slice(0, 25);
          resolve(sorted);
        });
      } else {
        exec('ps -eo pid,pcpu,pmem,comm --sort=-pmem | head -n 25', (err, stdout) => {
          if (err || !stdout) return resolve([]);
          const lines = stdout.trim().split('\n').slice(1);
          const list: ProcessInfo[] = lines.map((l) => {
            const tokens = l.trim().split(/\s+/);
            return {
              pid: parseInt(tokens[0], 10) || 0,
              cpu: parseFloat(tokens[1]) || 0,
              memory: Math.round((parseFloat(tokens[2]) || 0) * 100) / 10,
              name: tokens[3] || 'process',
            };
          });
          resolve(list);
        });
      }
    });
  }

  public killProcess(pid: number): Promise<boolean> {
    return new Promise((resolve) => {
      try {
        if (process.platform === 'win32') {
          exec(`taskkill /F /PID ${pid}`, (err) => {
            resolve(!err);
          });
        } else {
          process.kill(pid, 'SIGKILL');
          resolve(true);
        }
      } catch {
        resolve(false);
      }
    });
  }
}
