"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/* ----- IMPORTS ----- */
var electron_1 = require("electron");
var path = require("path");
/* ----- VARIABLES ----- */
/**
 * Main browser window, contains `index.html`
 */
var window = null;
var tabs = [];
var tabon = -1;
var size = [800, 800];
var view_size = [0, 0, size[0], size[1]];
/* ----- SERVICES ------ */
/**
 * Loads main browser window (`window`)
 */
function load_window() {
    window = new electron_1.BrowserWindow({
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
function load_tab(url) {
    if (window == null)
        return console.log('Window is not initialized');
    if (tabon != -1)
        window.contentView.removeChildView(tabs[tabon]);
    var view = new electron_1.WebContentsView({
        webPreferences: {
            transparent: true,
            nodeIntegration: true,
        },
    });
    window.contentView.addChildView(view);
    view.setBounds({ x: view_size[0], y: view_size[1], width: view_size[2], height: view_size[3] });
    view.webContents.loadURL(url);
    view.webContents.on('did-navigate', function (event, url) {
        console.log('BrowserView URL changed to:', url);
        console.log(view.webContents.navigationHistory.canGoBack(), view.webContents.navigationHistory.canGoForward());
        window === null || window === void 0 ? void 0 : window.webContents.send('url-changed', url);
        window === null || window === void 0 ? void 0 : window.webContents.send('browser-options', view.webContents.navigationHistory.canGoBack(), view.webContents.navigationHistory.canGoForward());
    });
    view.webContents.on('page-title-updated', function (event, title) {
        window === null || window === void 0 ? void 0 : window.webContents.send('title-changed', title);
    });
    view.webContents.on('page-favicon-updated', function (event, favicons) {
        window === null || window === void 0 ? void 0 : window.webContents.send('favicon-changed', favicons);
    });
    tabon = tabs.length;
    tabs.push(view);
}
/* ----- CONNECTIONS ----- */
electron_1.ipcMain.on('tab-new', function (event, n) {
    load_tab(n);
});
electron_1.ipcMain.on('tab-resize', function (event, x, y, w, h) {
    view_size = [x, y, w, h];
    if (tabon == -1)
        return;
    tabs[tabon].setBounds({ x: x, y: y, width: w, height: h });
});
electron_1.ipcMain.on('tab-open', function (event, n) {
    if (n < 0 || tabon == n || n >= tabs.length)
        return;
    if (tabon != -1)
        window === null || window === void 0 ? void 0 : window.contentView.removeChildView(tabs[tabon]);
    window === null || window === void 0 ? void 0 : window.contentView.addChildView(tabs[n]);
    tabs[n].setBounds({ x: view_size[0], y: view_size[1], width: view_size[2], height: view_size[3] });
    tabon = n;
    window === null || window === void 0 ? void 0 : window.webContents.send('browser-options', false, false);
});
electron_1.ipcMain.on('tab-url', function (event, u) {
    if (tabon == -1)
        return;
    tabs[tabon].webContents.loadURL(u);
});
electron_1.ipcMain.on('tab-back', function (event) {
    if (tabon == -1)
        return;
    tabs[tabon].webContents.navigationHistory.goBack();
    window === null || window === void 0 ? void 0 : window.webContents.send('browser-options', tabs[tabon].webContents.navigationHistory.canGoBack(), true);
});
electron_1.ipcMain.on('tab-next', function (event) {
    if (tabon == -1)
        return;
    tabs[tabon].webContents.navigationHistory.goForward();
    window === null || window === void 0 ? void 0 : window.webContents.send('browser-options', true, tabs[tabon].webContents.navigationHistory.canGoForward());
});
electron_1.ipcMain.on('tab-reload', function (event) {
    if (tabon == -1)
        return;
    tabs[tabon].webContents.reload();
});
electron_1.ipcMain.on('tab-close', function (event) {
    if (tabon == -1)
        return;
    window === null || window === void 0 ? void 0 : window.contentView.removeChildView(tabs[tabon]);
    tabs.splice(tabon, 1);
    tabon--;
    if (tabon == -1 && tabs.length)
        tabon = 0;
    if (tabon != -1) {
        window === null || window === void 0 ? void 0 : window.contentView.addChildView(tabs[tabon]);
        window === null || window === void 0 ? void 0 : window.webContents.send('browser-options', tabs[tabon].webContents.navigationHistory.canGoBack(), tabs[tabon].webContents.navigationHistory.canGoForward());
    }
    else
        window === null || window === void 0 ? void 0 : window.webContents.send('browser-options', false, false);
});
/* ----- BINDING ----- */
electron_1.app.whenReady().then(load_window);
electron_1.app.on('window-all-closed', function () {
    if (process.platform !== 'darwin')
        electron_1.app.quit();
});
electron_1.app.on('activate', function () {
    if (electron_1.BrowserWindow.getAllWindows().length === 0)
        load_window();
});
