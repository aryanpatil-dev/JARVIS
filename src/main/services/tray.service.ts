import { Tray, Menu, nativeImage, BrowserWindow, app, Notification } from 'electron';
import path from 'path';

export class TrayService {
  private tray: Tray | null = null;
  private mainWindow: BrowserWindow | null = null;

  public init(window: BrowserWindow) {
    this.mainWindow = window;

    // Create a 16x16 / 32x32 tactical icon
    const icon = this.createTrayIcon();
    this.tray = new Tray(icon);
    this.tray.setToolTip('JARVIS // AI Desktop Environment');

    this.updateMenu('SAFE');

    this.tray.on('double-click', () => {
      this.toggleWindow();
    });
  }

  public updateMenu(securityMode: string) {
    if (!this.tray) return;

    const contextMenu = Menu.buildFromTemplate([
      {
        label: 'JARVIS // Core Online',
        enabled: false,
      },
      { type: 'separator' },
      {
        label: 'Show / Focus JARVIS (Ctrl+Shift+J)',
        click: () => this.toggleWindow(),
      },
      {
        label: `Security Tier: ${securityMode}`,
        enabled: false,
      },
      { type: 'separator' },
      {
        label: 'Restart JARVIS',
        click: () => {
          app.relaunch();
          app.exit();
        },
      },
      {
        label: 'Exit Environment',
        click: () => {
          app.quit();
        },
      },
    ]);

    this.tray.setContextMenu(contextMenu);
  }

  public toggleWindow() {
    if (!this.mainWindow) return;
    if (this.mainWindow.isVisible()) {
      if (this.mainWindow.isMinimized()) {
        this.mainWindow.restore();
        this.mainWindow.focus();
      } else if (this.mainWindow.isFocused()) {
        this.mainWindow.minimize();
      } else {
        this.mainWindow.focus();
      }
    } else {
      this.mainWindow.show();
      this.mainWindow.focus();
    }
  }

  public showNotification(title: string, body: string) {
    if (Notification.isSupported()) {
      const notif = new Notification({
        title: `JARVIS // ${title}`,
        body,
        silent: false,
      });
      notif.show();
      notif.on('click', () => {
        this.toggleWindow();
      });
    }
  }

  private createTrayIcon(): Electron.NativeImage {
    // Generate a tactical blue-cyan 16x16 data URL icon programmatically
    const svgIcon = `
      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16">
        <circle cx="8" cy="8" r="7" fill="#08090b" stroke="#38bdf8" stroke-width="2"/>
        <circle cx="8" cy="8" r="3" fill="#38bdf8"/>
      </svg>
    `;
    const base64 = Buffer.from(svgIcon).toString('base64');
    return nativeImage.createFromDataURL(`data:image/svg+xml;base64,${base64}`);
  }
}
