/* ----- IMPORTS ----- */
import { app, BrowserWindow, WebContentsView, ipcMain, IpcMainEvent, IpcMain } from 'electron';
import * as path from 'path';

/* ----- VARIABLES ----- */
/**
 * Main browser window, contains `index.html`
 */
var window:BrowserWindow|null = null;
var tabs:WebContentsView[] = [];
var tabon:number = -1;
var size:number[] = [800, 800];
var view_size:number[] = [0, 0, size[0], size[1]];

/* ----- SERVICES ------ */
/**
 * Loads main browser window (`window`)
 */
function load_window() {
    window = new BrowserWindow({
        width: size[0],
        height: size[1],
        webPreferences: {
            preload: path.join(__dirname, 'preload.js'),
            contextIsolation: true,
        },
    });
    window.loadFile('out/index.html');
}
/**
 * Loads web tab
 * @param url {string} Url of page
 */
function load_tab(url:string):void {
    if (window == null) return console.log('Window is not initialized');
    if (tabon != -1) window.contentView.removeChildView(tabs[tabon]);
    const view = new WebContentsView({
        webPreferences: {
            transparent: true,
            nodeIntegration: true,
        },
    });
    window.contentView.addChildView(view);
    view.setBounds({x: view_size[0], y: view_size[1], width: view_size[2], height: view_size[3]});
    view.webContents.loadURL(url);
    view.webContents.on('did-navigate', (event, url) => {
        console.log('BrowserView URL changed to:', url);
        console.log(view.webContents.navigationHistory.canGoBack(), view.webContents.navigationHistory.canGoForward());
        window?.webContents.send('url-changed', url);
        window?.webContents.send('browser-options', view.webContents.navigationHistory.canGoBack(), view.webContents.navigationHistory.canGoForward());
    });
    view.webContents.on('page-title-updated', (event, title) => {
        window?.webContents.send('title-changed', title);
    });
    view.webContents.on('page-favicon-updated', (event, favicons) => {
        window?.webContents.send('favicon-changed', favicons);
    });
    tabon = tabs.length;
    tabs.push(view);
}

/* ----- CONNECTIONS ----- */
ipcMain.on('tab-new', (event:IpcMainEvent, n:string) => {
    load_tab(n);
});
ipcMain.on('tab-resize', (event:IpcMainEvent, x:number, y:number, w:number, h:number) => {
    view_size = [x, y, w, h];
    if (tabon == -1) return;
    tabs[tabon].setBounds({x: x, y: y, width: w, height: h});
});
ipcMain.on('tab-open', (event:IpcMainEvent, n:number) => {
    if (n < 0 || tabon == n || n >= tabs.length) return;
    if (tabon != -1) window?.contentView.removeChildView(tabs[tabon]);
    window?.contentView.addChildView(tabs[n]);
    tabs[n].setBounds({x: view_size[0], y: view_size[1], width: view_size[2], height: view_size[3]});
    tabon = n;
    window?.webContents.send('browser-options', false, false);
});
ipcMain.on('tab-url', (event:IpcMainEvent, u:string) => {
    if (tabon == -1) return;
    tabs[tabon].webContents.loadURL(u);
});
ipcMain.on('tab-back', (event:IpcMainEvent) => {
    if (tabon == -1) return;
    tabs[tabon].webContents.navigationHistory.goBack();
    window?.webContents.send('browser-options', tabs[tabon].webContents.navigationHistory.canGoBack(), true);
});
ipcMain.on('tab-next', (event:IpcMainEvent) => {
    if (tabon == -1) return;
    tabs[tabon].webContents.navigationHistory.goForward();
    window?.webContents.send('browser-options', true, tabs[tabon].webContents.navigationHistory.canGoForward());
});
ipcMain.on('tab-reload', (event:IpcMainEvent) => {
    if (tabon == -1) return;
    tabs[tabon].webContents.reload();
});
ipcMain.on('tab-close', (event:IpcMainEvent) => {
    if (tabon == -1) return;
    window?.contentView.removeChildView(tabs[tabon]);
    tabs.splice(tabon, 1);
    tabon--;
    if (tabon == -1 && tabs.length) tabon = 0;
    if (tabon != -1) {
        window?.contentView.addChildView(tabs[tabon]);
        window?.webContents.send('browser-options', tabs[tabon].webContents.navigationHistory.canGoBack(), tabs[tabon].webContents.navigationHistory.canGoForward());
    } else window?.webContents.send('browser-options', false, false);
});

/* ----- BINDING ----- */
app.whenReady().then(load_window);
app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') app.quit()
});
app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) load_window()
});