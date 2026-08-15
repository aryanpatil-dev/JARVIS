import fs from 'fs';
import path from 'path';
import os from 'os';
import { FileItem } from '../../shared/ipc-channels';

export class FilesystemService {
  public getRoots(): { name: string; path: string }[] {
    const roots: { name: string; path: string }[] = [];
    const home = os.homedir();

    roots.push({ name: 'Home', path: home });
    roots.push({ name: 'Desktop', path: path.join(home, 'Desktop') });
    roots.push({ name: 'Documents', path: path.join(home, 'Documents') });
    roots.push({ name: 'Downloads', path: path.join(home, 'Downloads') });

    if (process.platform === 'win32') {
      // Check available drives
      const driveLetters = ['C:', 'D:', 'E:', 'F:'];
      for (const drive of driveLetters) {
        try {
          if (fs.existsSync(drive + '\\')) {
            roots.push({ name: `Local Disk (${drive})`, path: drive + '\\' });
          }
        } catch {
          // Ignore inaccessible drives
        }
      }
    } else {
      roots.push({ name: 'Root', path: '/' });
    }

    return roots;
  }

  public readDirectory(dirPath: string): FileItem[] {
    try {
      const entries = fs.readdirSync(dirPath, { withFileTypes: true });
      const items: FileItem[] = [];

      for (const entry of entries) {
        // Skip hidden/system files if error occurs
        try {
          const fullPath = path.join(dirPath, entry.name);
          const isDir = entry.isDirectory();
          let size = 0;
          let modified = 0;

          if (!isDir) {
            try {
              const stat = fs.statSync(fullPath);
              size = stat.size;
              modified = stat.mtimeMs;
            } catch {
              // Ignore unreadable stat
            }
          }

          items.push({
            name: entry.name,
            path: fullPath,
            isDir,
            size,
            modified,
            extension: isDir ? undefined : path.extname(entry.name).toLowerCase(),
          });
        } catch {
          // Skip inaccessible entries
        }
      }

      // Sort: Directories first, then alphabetical
      return items.sort((a, b) => {
        if (a.isDir && !b.isDir) return -1;
        if (!a.isDir && b.isDir) return 1;
        return a.name.localeCompare(b.name, undefined, { sensitivity: 'base' });
      });
    } catch (err) {
      console.error(`Error reading directory ${dirPath}:`, err);
      return [];
    }
  }

  public readFileContent(filePath: string, maxBytes: number = 500000): { content: string; truncated: boolean } {
    try {
      const stat = fs.statSync(filePath);
      const isTruncated = stat.size > maxBytes;
      const buffer = Buffer.alloc(Math.min(stat.size, maxBytes));
      const fd = fs.openSync(filePath, 'r');
      fs.readSync(fd, buffer, 0, buffer.length, 0);
      fs.closeSync(fd);

      return {
        content: buffer.toString('utf-8'),
        truncated: isTruncated,
      };
    } catch (err) {
      throw new Error(`Failed to read file: ${(err as Error).message}`);
    }
  }

  public writeFileContent(filePath: string, content: string): boolean {
    try {
      const dir = path.dirname(filePath);
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
      }
      fs.writeFileSync(filePath, content, 'utf-8');
      return true;
    } catch (err) {
      console.error(`Failed to write file ${filePath}:`, err);
      return false;
    }
  }

  public createDirectory(dirPath: string): boolean {
    try {
      if (!fs.existsSync(dirPath)) {
        fs.mkdirSync(dirPath, { recursive: true });
      }
      return true;
    } catch (err) {
      console.error(`Failed to create directory ${dirPath}:`, err);
      return false;
    }
  }

  public deleteItem(targetPath: string): boolean {
    try {
      const stat = fs.statSync(targetPath);
      if (stat.isDirectory()) {
        fs.rmSync(targetPath, { recursive: true, force: true });
      } else {
        fs.unlinkSync(targetPath);
      }
      return true;
    } catch (err) {
      console.error(`Failed to delete item ${targetPath}:`, err);
      return false;
    }
  }
}
