"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.client_script = exports.toJSCode = exports.Browser = exports.events = void 0;
const electron_1 = require("electron");
const path = __importStar(require("path"));
const fs = __importStar(require("fs"));
exports.events = {
    delta_url: () => { },
    delta_title: () => { },
    delta_favicon: () => { },
    delta_status: () => { },
    delta_focus: () => { },
};
/* ----- CLASS ----- */
/**
 * Browser Library for Electron JS
 * - `tabs` - All browser tabs
 * - `wins` - All browser windows
 * - `new_win(size)` - Creates new browser window
 * - `default_url` - Default url to newly created tabs
 * - `open(tab,win,url)` - Opens tab to focus
 * - `go(tab,step)` - Goes to a relative tab history
 * - `close(tab,auto_focus)` - Closes a tab
 * - `tab_len` - Length of tabs
 * - `win_len` - Length of windows
 */
class Browser {
    /* ----- SHORTCUTS ----- */
    /** Returns Available Tab ID */
    tab_a_id() {
        let id = 0;
        while (this.tabs[id] != undefined)
            id++;
        return id;
    }
    /** Returns Available Tab ID */
    win_a_id() {
        let id = 0;
        while (this.wins[id] != undefined)
            id++;
        return id;
    }
    /* ----- GETS ----- */
    get tab_len() {
        return Object.keys(this.tabs).length;
    }
    get win_len() {
        return Object.keys(this.wins).length;
    }
    /* ----- Functions ----- */
    /**
     * Creates a new window
     * @param size - Dimension side of the window
     */
    new_win(size = null) {
        let id = this.win_a_id();
        if (size == null)
            size = [0, 0, this.size[0], this.size[1]];
        this.wins[id] = new Proxy({
            focus: -1,
            size: size,
            id: id,
            show: false,
        }, this.win_handle);
        this._last_window = id;
        return id;
    }
    /**
     * Opens tab to focus
     * @param tab - Tab Index, if null creates new tab index and returns it
     * @param win - Window Index, if null selects most recent tab if exists else creates new one
     * @param url - URL of tab, if null then selects default url
     */
    open(tab = null, win = null, url = null) {
        // Create new tab if tab is null
        if (tab == null) {
            tab = this.tab_a_id();
            this.tabs[tab] = new Proxy({
                view: new electron_1.WebContentsView({
                    webPreferences: {
                        transparent: true,
                        nodeIntegration: true,
                    },
                }),
                url: url !== null && url !== void 0 ? url : this.default_url,
                title: '',
                favicon: [],
                id: tab,
                history: [],
                history_pos: -1,
                status: 200,
            }, this.tab_handle);
            if (url == null)
                this.tabs[tab].view.webContents.loadURL(this.default_url);
        }
        // Create/Select window if null
        if (win == null) {
            let matches = Object.keys(this.wins).filter(n => this.wins[n].focus == tab);
            win = matches.length ? Number(matches[0]) : this._last_window;
            if (win == null)
                win = this.new_win();
        }
        // Displays tab
        let tabn = tab, web = this.tabs[tab].view.webContents;
        if (this.wins[win].show) {
            if (this.wins[win].focus != -1)
                this.window.contentView.removeChildView(this.tabs[this.wins[win].focus].view);
            this.tabs[tab].view.setBounds({
                x: this.wins[win].size[0],
                y: this.wins[win].size[1],
                width: this.wins[win].size[2],
                height: this.wins[win].size[3]
            });
            this.window.contentView.addChildView(this.tabs[tab].view);
        }
        this.wins[win].focus = tab;
        if (url != null)
            web.loadURL(url);
        // Add event listeners
        web.on('did-navigate', (event, url) => {
            if (this.tabs[tabn] == undefined)
                return;
            this.tabs[tabn].url = url;
            this.tabs[tabn].history = web.navigationHistory.getAllEntries();
            this.tabs[tabn].history_pos = web.navigationHistory.getActiveIndex();
        });
        web.on('page-title-updated', (event, title) => {
            if (this.tabs[tabn] == undefined)
                return;
            this.tabs[tabn].title = title;
        });
        web.on('page-favicon-updated', (event, urls) => {
            if (this.tabs[tabn] == undefined)
                return;
            this.tabs[tabn].favicon = urls;
        });
        web.on('did-fail-load', (event, error_code, error_description, validated_url) => {
            this.tabs[tabn].status = error_code;
        });
        web.on('did-finish-load', () => {
            this.tabs[tabn].status = 200;
        });
        return tab;
    }
    /**
     * Goes to a relative tab history
     * @param tab - Tab index/id
     * @param step - Relative step size (-1 is back, 0 is refresh, and 1 is forward)
     */
    go(tab, step = 0) {
        let t = this.tabs[tab];
        if (t != undefined)
            t.view.webContents.navigationHistory.goToOffset(step);
    }
    /**
     * Closes a tab
     * @param tab - Tab index/id
     * @param auto_focus - Automatically go to the nearest previous tabs or succeeding tabs
     */
    close(tab, auto_focus = true) {
        let at = -1;
        for (const win in this.wins)
            if (this.wins[win].focus == tab) {
                at = Number(win);
                this.wins[win].focus = -1;
                break;
            }
        this.window.contentView.removeChildView(this.tabs[tab].view);
        delete this.tabs[tab];
        if (auto_focus && at != -1) {
            let f = -1;
            for (let i = tab - 1; i >= 0; i--)
                if (this.tabs[i] != undefined) {
                    f = i;
                    break;
                }
            if (f == -1) {
                let max = Math.max(...Object.keys(this.tabs).map(x => Number(x)));
                for (let i = tab + 1; i <= max; i++)
                    if (this.tabs[i] != undefined) {
                        f = i;
                        break;
                    }
            }
            if (f != -1)
                this.open(f, at);
            else
                this.wins[at].focus = -1;
        }
    }
    /* ----- AUTOMATION ----- */
    async wait(tab, query, func) {
        let wait = 100;
        if (this.tabs[tab] == undefined)
            return func([], true);
        let out = await this.tabs[tab].view.webContents.executeJavaScript(/*js*/ `
            new Promise((res,rej)=>{
                let func = (
                    ${func.toString()}
                );
                const start = Date.now();
                const check = () => {
                    const ele = document.querySelectorAll('${query}');
                    if (ele.length != 0) {
                        let out = func(Array.from(ele), false);
                        if (out !== undefined) res(out);
                    } else setTimeout(check, ${wait});
                };
                check();
            });
        `);
        console.log('OUT', out);
        return out;
    }
    /* ----- CONSTRUCTOR ----- */
    constructor(data = null) {
        /** All browser tabs */
        this.tabs = {};
        /** All browser windows */
        this.wins = {};
        /** Last window on focused */
        this._last_window = null;
        /** Default url to newly created tabs */
        this.default_url = 'https://www.google.com';
        /** Main browser size */
        this.size = [800, 800];
        /* ----- HANDLER ----- */
        /** Deals with tab changes */
        this.tab_handle = {
            browser: this,
            set(target, prop, val) {
                target[prop] = val;
                if ('url,title,favicon,status'.split(',').includes(prop))
                    this.browser.window.webContents.executeJavaScript(`events.delta_${prop}(${target.id},${JSON.stringify(val)})`);
                return true;
            }
        };
        /** Deals with window changes */
        this.win_handle = {
            browser: this,
            set(target, prop, val) {
                target[prop] = val;
                let browser = this.browser;
                if (prop == 'size' && target.focus != -1) {
                    let tab = browser.tabs[target.focus];
                    tab.view.setBounds({
                        x: val[0],
                        y: val[1],
                        width: val[2],
                        height: val[3]
                    });
                }
                else if (prop == 'show' && target.focus != -1) {
                    let tabs = browser.tabs;
                    if (val == true) {
                        browser.window.contentView.addChildView(tabs[target.focus].view);
                        tabs[target.focus].view.setBounds({
                            x: target.size[0],
                            y: target.size[1],
                            width: target.size[2],
                            height: target.size[3]
                        });
                    }
                    else
                        browser.window.contentView.removeChildView(tabs[target.focus].view);
                }
                else if (prop == 'focus') {
                    browser.window.webContents.executeJavaScript(`events.delta_focus(${val},${target.id})`);
                }
                return true;
            },
        };
        let size = data != null && !(data instanceof electron_1.BrowserWindow) && data.size != undefined ? data.size : [800, 800];
        this.size = size;
        if (data instanceof electron_1.BrowserWindow)
            this.window = data;
        else {
            // Setup window when it can
            const setup = () => {
                this.window = new electron_1.BrowserWindow({
                    width: size[0],
                    height: size[1],
                    webPreferences: {
                        preload: path.join(__dirname, 'preload.js'),
                        contextIsolation: true,
                    },
                });
                fs.writeFileSync('out/index.html', data != null && data.html != undefined ? data.html : '<p>Provide html code to Browser parameterr</p>', 'utf-8');
                this.window.loadFile('out/index.html');
            };
            // Setup APP
            electron_1.app.whenReady().then(() => {
                setup();
                if (data === null || data === void 0 ? void 0 : data.ready)
                    data.ready(this);
            });
            electron_1.app.on('window-all-closed', () => {
                if (process.platform !== 'darwin')
                    electron_1.app.quit();
            });
            electron_1.app.on('activate', () => {
                if (electron_1.BrowserWindow.getAllWindows().length === 0)
                    setup();
            });
            // Setup connection between host and client
            electron_1.ipcMain.handle('get', (_, from, prop) => {
                var _a, _b;
                let e = this;
                if (from != null)
                    for (const name of from.electron_path)
                        e = e[name];
                if (typeof e[prop] == 'function')
                    return { electron_type: 'function', electron_path: from != null ? (_a = from.electron_path) !== null && _a !== void 0 ? _a : [] : [] };
                if (typeof e[prop] == 'object')
                    return { electron_type: 'object', electron_path: from != null ? (_b = from.electron_path) !== null && _b !== void 0 ? _b : [] : [] };
                return e[prop];
            });
            electron_1.ipcMain.handle('set', (_, from, prop, val) => {
                let e = this;
                if (from != null)
                    for (const name of from.electron_path)
                        e = e[name];
                e[prop] = val;
                return e[prop];
            });
            electron_1.ipcMain.handle('run', (_, from, args) => {
                let e = this;
                let t = this;
                if (from != null)
                    for (const name of from.electron_path) {
                        t = e;
                        e = e[name];
                    }
                if (typeof e == 'function')
                    return e.apply(t, eval(args));
            });
        }
    }
}
exports.Browser = Browser;
/* ----- FUNCTIONS ----- */
function toJSCode(value) {
    if (Array.isArray(value))
        return '[' + value.map(toJSCode).join(',') + ']';
    else if (typeof value === 'object' && value !== null)
        return '{' + Object.entries(value).map(([key, val]) => '"' + key + '":' + toJSCode(val)).join(',') + '}';
    else if (typeof value === 'function')
        return value.toString();
    return JSON.stringify(value);
}
exports.toJSCode = toJSCode;
function client_script(action) {
    return /*js*/ `
        let events = {
            delta_url:()=>{},
            delta_title:()=>{},
            delta_favicon:()=>{},
            delta_status:()=>{},
            delta_focus:()=>{},
        };
        (() => {
            let env_origin = {
                tabs: 0,
                wins: 0,
                new_win: 0,
                default_url: 0,
                open: 0,
                go: 0,
                close: 0,
                tab_len: 0,
                win_len: 0,
            };
            let handle = {
                async get(target, prop, rec) {
                    if (target != env_origin && target.electron_type == 'object' && prop == 'then') return target;
                    let res = await electron.get(target == env_origin ? null : target, prop);
                    if (typeof res == 'object') {
                        if (res.electron_type == 'function') {
                            let o = ()=>{};
                            o.data = {
                                electron_type: 'function',
                                electron_path: [...(res.electron_path??[]), prop],
                            };
                            return new Proxy(o, handle);
                        } else if (res.electron_type == 'object') {
                            let o = {
                                electron_type: 'object',
                                electron_path: [...(res.electron_path??[]), prop],
                            };
                            return new Proxy(o, handle);
                        } else {
                            throw new Error('Unknown object type of '+String(res.electron_type));
                            return undefined;
                        }
                    }
                    return typeof res == 'object' || typeof res == 'function' ? undefined : res;
                },
                set(target, prop, val) {
                    return electron.set(target == env_origin ? null : target, prop, val);
                },
                apply(target, thisArg, args) {
                    ${toJSCode.toString()}
                    return electron.run(target.data, toJSCode(args));
                },
            };
            let env = new Proxy(env_origin, handle);
            (async () => {
                ${(() => {
        let s = action.toString();
        let vm = s.slice(0, s.indexOf('{')).match(/(?<=\(\s*)[^\(\),\s]+(?=.*\=>)|[^\s\(\)]+(?=\s*\=>)/g);
        if (vm == null)
            throw Error("Couldnt find client script parameter name");
        let v = vm[0];
        s = s.slice(s.indexOf('{') + 1, s.lastIndexOf('}'));
        let r;
        s = s.replace(r = new RegExp(`\\b${v}(\\.\\w+|\\[[^\\]]+\\])*`, 'gm'), function (match, _, p, code) {
            var _a;
            let m = Array.from((_a = match.match(/(?<=\.|^)\w+|\[[^\]]+\]/g)) !== null && _a !== void 0 ? _a : []);
            let e = code.slice(p + match.length).trim();
            if (m.length == 0)
                return '';
            m[0] = 'env';
            if (e[0] == '=')
                return m.reduce((p, c, n) => `${n != m.length - 1 ? '(await ' : ''}${p}${c[0] == '[' ? '' : '.'}${c}${n != m.length - 1 ? ')' : ''}`);
            return 'await ' + m.reduce((p, c) => `(await ${p}${c[0] == '[' ? '' : '.'}${c})`);
        });
        return s;
    })()}
            })();
        })();
    `;
}
exports.client_script = client_script;
