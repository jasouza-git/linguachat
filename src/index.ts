/* ----- IMPORTS ----- */
import { app, BrowserWindow, WebContentsView, ipcMain, IpcMainEvent, IpcMain } from 'electron';
import * as path from 'path';

/* ----- VARIABLES ----- */
/**
 * Main browser window, contains `index.html`
 */
var window:BrowserWindow|null = null;
var tabs:{[id:number]:{view:WebContentsView}} = {};
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
function open_tab(id:number, url:string|null):void {
    if (window == null) return console.log('Window is not initialized');
    if (tabs[id] == undefined) {
        const view = new WebContentsView({
            webPreferences: {
                transparent: true,
                nodeIntegration: true,
            },
        });
        window.contentView.addChildView(view);
        view.setBounds({x: view_size[0], y: view_size[1], width: view_size[2], height: view_size[3]});
        view.webContents.loadURL(url ?? 'https://www.google.com');
        view.webContents.on('did-navigate', (event, url) => {
            //console.log('BrowserView URL changed to:', url);
            //console.log(view.webContents.navigationHistory.canGoBack(), view.webContents.navigationHistory.canGoForward());
            window?.webContents.send('url-changed', id, url);
            //window?.webContents.send('browser-options', view.webContents.navigationHistory.canGoBack(), view.webContents.navigationHistory.canGoForward());
        });
        view.webContents.on('page-title-updated', (event, title) => {
            window?.webContents.send('title-changed', id, title);
        });
        view.webContents.on('page-favicon-updated', (event, url) => {
            window?.webContents.send('favicon-changed', id, url);
        });
        tabs[id] = {view:view};
    } else {
        if (tabon != -1) window.contentView.removeChildView(tabs[tabon].view);
        if (url != null) tabs[id].view.webContents.loadURL(url);
        window.contentView.addChildView(tabs[id].view);
        window.webContents.send('tab-focus')
    }
    tabon = id;
    tabs[id].view.setBounds({x: view_size[0], y: view_size[1], width: view_size[2], height: view_size[3]});
}

/* ----- CONNECTIONS ----- */
ipcMain.on('tab-open', (event:IpcMainEvent, id:number, url:string|null) => {
    open_tab(id, url);
});
ipcMain.on('tab-resize', (event:IpcMainEvent, x:number, y:number, w:number, h:number) => {
    view_size = [x, y, w, h];
    if (tabon == -1) return;
    tabs[tabon].view.setBounds({x: x, y: y, width: w, height: h});
});
ipcMain.on('tab-go', (event:IpcMainEvent, id:number, step:number) => {
    if (step < 0) {
        for (let n = 0; n < -step; n++) tabs[id].view.webContents.navigationHistory.goBack();
    } else if (step > 0) {
        for (let n = 0; n < step; n++) tabs[id].view.webContents.navigationHistory.goForward();
    } else tabs[id].view.webContents.reload();
});
ipcMain.on('tab-close', (event:IpcMainEvent, id:number) => {
    window?.contentView.removeChildView(tabs[id].view);
    delete tabs[id];
    
    /*if (tabon == -1 && tabs.length) tabon = 0;
    if (tabon != -1) {
        window?.contentView.addChildView(tabs[tabon]);
        window?.webContents.send('browser-options', tabs[tabon].webContents.navigationHistory.canGoBack(), tabs[tabon].webContents.navigationHistory.canGoForward());
    } else window?.webContents.send('browser-options', false, false);*/
});

/* ----- BINDING ----- */
app.whenReady().then(load_window);
app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') app.quit()
});
app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) load_window()
});