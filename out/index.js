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
/* ----- IMPORTS ----- */
// tsc src/index.ts --outDir out --watch --target ES2017 --module nodenext --moduleResolution nodenext
const electron_1 = require("electron");
const path = __importStar(require("path"));
const fs = __importStar(require("fs"));
/* ----- BROWSER BACKEND ----- */
class Browser {
    constructor() {
        /* ----- TABS ----- */
        /** Deals with tab changes */
        this.tab_handle = {
            set(target, prop, val) {
                if (prop == 'url')
                    mainwin === null || mainwin === void 0 ? void 0 : mainwin.webContents.executeJavaScript(`events.delta_url(${target.id},"${val}")`);
                else if (prop == 'title')
                    mainwin === null || mainwin === void 0 ? void 0 : mainwin.webContents.executeJavaScript(`events.delta_title(${target.id},"${val}")`);
                else if (prop == 'favicon')
                    mainwin === null || mainwin === void 0 ? void 0 : mainwin.webContents.executeJavaScript(`events.delta_favicon(${target.id},${JSON.stringify(val)})`);
                else if (prop == 'error' && val != 200)
                    mainwin === null || mainwin === void 0 ? void 0 : mainwin.webContents.executeJavaScript(`events.on_error(${val})`);
                target[prop] = val;
                return true;
            }
        };
        /** Where tab information is stored */
        this.tabs = {};
        /* ----- WINDOWS ----- */
        /** Deals with window changes */
        this.win_handle = {
            set(target, prop, val) {
                target[prop] = val;
                if (prop == 'size' && target.focus != -1) {
                    let tab = this.browser.tabs[target.focus];
                    tab.view.setBounds({
                        x: val[0],
                        y: val[1],
                        width: val[2],
                        height: val[3]
                    });
                }
                else if (prop == 'show' && target.focus != -1) {
                    let tabs = this.browser.tabs;
                    if (val == true) {
                        mainwin === null || mainwin === void 0 ? void 0 : mainwin.contentView.addChildView(tabs[target.focus].view);
                        tabs[target.focus].view.setBounds({
                            x: target.size[0],
                            y: target.size[1],
                            width: target.size[2],
                            height: target.size[3]
                        });
                    }
                    else
                        mainwin === null || mainwin === void 0 ? void 0 : mainwin.contentView.removeChildView(tabs[target.focus].view);
                }
                else if (prop == 'focus') {
                    mainwin === null || mainwin === void 0 ? void 0 : mainwin.webContents.executeJavaScript(`events.delta_focus(${val},${target.id})`);
                }
                return true;
            },
            browser: this,
        };
        /** Where window information is stored */
        this.wins = {};
        this._last_window = null;
        this.default_url = 'https://www.google.com';
    }
    /** Tab - Available ID */
    tab_a_id() {
        let id = 0;
        while (this.tabs[id] != undefined)
            id++;
        return id;
    }
    /** Window - Available ID */
    win_a_id() {
        let id = 0;
        while (this.wins[id] != undefined)
            id++;
        return id;
    }
    /** Creates a new window */
    new_win(size) {
        let id = this.win_a_id();
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
     *
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
                error: 200,
            }, this.tab_handle);
        }
        // Create/Select window if null
        if (win == null) {
            let matches = Object.keys(this.wins).filter(n => this.wins[n].focus == tab);
            win = matches.length ? Number(matches[0]) : this._last_window;
            if (win == null)
                win = this.new_win([0, 0, 0, 0]);
        }
        // Setup
        this.tabs[tab].view.setBounds({
            x: this.wins[win].size[0],
            y: this.wins[win].size[1],
            width: this.wins[win].size[2],
            height: this.wins[win].size[3]
        });
        let tabn = tab;
        const web = this.tabs[tab].view.webContents;
        if (this.wins[win].focus != -1)
            mainwin === null || mainwin === void 0 ? void 0 : mainwin.contentView.removeChildView(this.tabs[this.wins[win].focus].view);
        if (this.wins[win].show)
            mainwin === null || mainwin === void 0 ? void 0 : mainwin.contentView.addChildView(this.tabs[tab].view);
        this.wins[win].focus = tab;
        if (url != null)
            web.loadURL(url);
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
        web.on('page-favicon-updated', (event, url) => {
            if (this.tabs[tabn] == undefined)
                return;
            this.tabs[tabn].favicon = url;
        });
        web.on('did-fail-load', (event, error_code, error_description, validated_url) => {
            this.tabs[tabn].error = error_code;
        });
        web.on('did-finish-load', () => {
            this.tabs[tabn].error = 200;
        });
        return tab;
    }
    go(tab, step = 0) {
        let t = this.tabs[tab];
        if (t == undefined)
            return;
        t.view.webContents.navigationHistory.goToOffset(step);
    }
    close(tab, auto_focus = true) {
        let at = -1;
        for (const win in this.wins)
            if (this.wins[win].focus == tab) {
                at = Number(win);
                this.wins[win].focus = -1;
                break;
            }
        mainwin === null || mainwin === void 0 ? void 0 : mainwin.contentView.removeChildView(this.tabs[tab].view);
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
}
/* ----- VARIABLES ----- */
/**
 * Main browser window, contains `index.html`
 */
var mainwin = null;
var size = [800, 800];
var browser = new Browser;
/* ----- CLIENT ----- */
var env = {
    browser: browser,
    main_win: browser.new_win([0, 0, 0, 0]),
    scrape_win: browser.new_win([0, -size[1], size[0] * 2, size[1]]),
    act: (x) => { },
};
var events = {
    delta_url: () => { },
    delta_title: () => { },
    delta_favicon: () => { },
    delta_focus: () => { },
    on_error: () => { },
};
async function client() {
    var _a, _b;
    // Variables
    var id = await env.main_win;
    var s_id = await env.scrape_win;
    var def_url = await (await env.browser).default_url;
    var scraps = {};
    // Shortcuts
    var q = (x, dom = document) => dom.querySelector(x);
    var Qf = (x, dom = document) => ((f) => dom.querySelectorAll(x).forEach(f));
    var Q = (x, dom = document) => Array.from(dom.querySelectorAll(x));
    var wQ = (s, w = 100) => `new Promise((res,rej)=>{
        const start = Date.now();
        const check = () => {
            const ele = document.querySelector('${s}');
            if (ele) res(ele);
            else setTimeout(check, ${w});
        };
        check();
    });`;
    var wC = (code, w = 100) => `new Promise((res,rej)=>{
        const start = Date.now();
        const func = () => {
            ${code}
        };
        const check = () => {
            let out = func();
            if (out != undefined) res(out);
            else setTimeout(check, ${w});
        };
        check();
    });`;
    // Functions
    async function update_browser_window() {
        var _a;
        let r = (_a = q('#browser')) === null || _a === void 0 ? void 0 : _a.getBoundingClientRect();
        if (r == undefined)
            return;
        (await (await (await env.browser).wins)[await env.main_win]).size = [
            r.left + 2,
            r.top + 2,
            r.width - 4,
            r.height - 4,
        ];
    }
    async function update_browser_option(target_id = null) {
        let focus_id = await (await (await (await env.browser).wins)[id]).focus;
        if (target_id != null && target_id != focus_id)
            return;
        Qf('.side.browser>div.options>button')(async (d, n) => {
            if (focus_id == -1) {
                if (n != 0)
                    d.setAttribute('disabled', '');
                else
                    d.removeAttribute('disabled');
                return;
            }
            let his_len = await (await (await (await (await env.browser).tabs)[focus_id]).history).length;
            let his_pos = await (await (await (await env.browser).tabs)[focus_id]).history_pos;
            console.log(`his_pos(${his_pos})/his_len(${his_len})`);
            if (n == 1 && his_pos == 0 || n == 3 && his_len == his_pos + 1)
                d.setAttribute('disabled', '');
            else
                d.removeAttribute('disabled');
        });
    }
    // Binding
    (_a = q('#nav')) === null || _a === void 0 ? void 0 : _a.addEventListener('click', function (e) {
        if (!(e instanceof MouseEvent))
            return;
        let w = document.createElement('div');
        let r = this.getBoundingClientRect();
        let p = q('#nav .ripples');
        w.classList.add('ripple');
        w.style.left = `${e.clientX - r.left}px`;
        w.style.top = `${e.clientY - r.top}px`;
        p === null || p === void 0 ? void 0 : p.appendChild(w);
        setTimeout(() => p === null || p === void 0 ? void 0 : p.removeChild(w), 500);
    });
    Qf('#nav>button')(d => d.addEventListener('click', async function () {
        let t = Q('text:last-child', this);
        if (t.length == 0)
            return;
        let n = t[0].innerText.toLowerCase();
        document.body.setAttribute('class', n);
        (await (await (await env.browser).wins)[id]).show = n == 'browser';
        (await (await (await env.browser).wins)[s_id]).show = n == 'chats';
        if (n == 'browser')
            update_browser_window();
        else if (n == 'chats') {
            if (scraps.fb == undefined) {
                Qf('.side.chat>div:not(.options)')(d => { var _a; return (_a = d.parentElement) === null || _a === void 0 ? void 0 : _a.removeChild(d); });
                scraps.fb = {
                    id: await (await (await env.browser).open)(null, s_id, 'https://www.facebook.com/messages'),
                    exec: null,
                };
                scraps.fb.exec = (await (await (await (await (await (await env.browser).tabs)[scraps.fb.id]).view).webContents).executeJavaScript);
                let q_main_chats = '[aria-label="Chats"] [data-virtualized="false"] [role="link"]';
                scraps.fb.exec(wQ(q_main_chats)).then(() => scraps.fb.exec(wC(`
                        let array = Array.from(document.querySelectorAll('${q_main_chats}'));
                        let out = [];
                        for (let d of array) {
                            let prof = d.querySelector('img[referrerpolicy="origin-when-cross-origin"]');
                            let name = d.querySelector(':scope>div:first-child>div:first-child>div:nth-child(2)>div>div>div>span>span');
                            let prev = d.querySelector(':scope>div:first-child>div:first-child>div:nth-child(2)>div>div>div>div:last-child>span:first-child');
                            let last = d.querySelector(':scope>div:first-child>div:first-child>div:nth-child(2)>div>div>div>div:last-child>span:last-child');
                            if (prof == null || name == null || prev == null || last == null) return undefined;
                            out.push({
                                link: d.getAttribute('href'),
                                prof: prof.src,
                                name: name.innerText,
                                prev: prev.innerText.replace(/\\s+/g,' '),
                                last: last.innerText.split('\\n')[0],
                            });
                        }
                        return out;
                    `)).then((data) => {
                    var _a;
                    for (const d of data) {
                        let dom = document.createElement('div');
                        dom.innerHTML = `
                                <img class="loaded" src="${d.prof}"></img>
                                <text>${d.name}</text>
                                <span>${d.prev} ${d.last}</span>
                            `;
                        (_a = q('.side.chat')) === null || _a === void 0 ? void 0 : _a.appendChild(dom);
                    }
                    scraps.fb.exec(wC(`
                            var data = Array.from(document.querySelectorAll('[role=main]>div>div>div>div>div>div+div>div>div>div>div>div>div>div>div>div>div>div>div [role=row]:last-child>div:first-child>div')).reverse();
                            var img = null;
                            var out = [];
                            data.forEach(d => {
                                let main = d.querySelector(':scope>div[class]:not([role=presentation])')
                                let img_tmp = main?.querySelector(':scope>div:first-child img[style="border-radius: 50%;"]');
                                if (img_tmp) img = img_tmp;
                                let got = {
                                    name: img == null ? 'Unknown' : img.getAttribute('alt'),
                                    prof: img == null ? '' : img.src,
                                    text: main?.querySelector(':scope>div:nth-child(2)>div:first-child>div:first-child').innerText,
                                };
                                if (got.text != undefined) out.push(got);
                            });
                            out = out.reverse();
                            return out;
                        `)).then((data) => {
                        let out = '';
                        for (const d of data) {
                            out += `<div>
                                    <img src="${d.prof}"></img>
                                    <text>${d.name}</text>
                                    <div>
                                        ${d.text}
                                    </div>
                                </div>`;
                        }
                        let body = q('#chat .body');
                        if (body)
                            body.innerHTML = out;
                    });
                }));
            }
        }
    }));
    // Browser
    Qf('.side.browser>div.options>button')(async (d, n) => {
        if (n == 0)
            d.addEventListener('click', async () => {
                var _a, _b, _c;
                (_a = q('#browser')) === null || _a === void 0 ? void 0 : _a.setAttribute('class', 'loading');
                let i = await (await (await env.browser).open)(null, id, def_url);
                let d = document.createElement('div');
                d.setAttribute('data-id', String(i));
                d.innerHTML = '<img onload="this.classList.add(\'loaded\')"></img><text></text><input placeholder="Page URL:" value="' + (await (await env.browser).default_url) + '"></input>';
                (_b = q('input', d)) === null || _b === void 0 ? void 0 : _b.addEventListener('change', async () => {
                    var _a;
                    let url = (_a = q('input', d)) === null || _a === void 0 ? void 0 : _a.value;
                    if (!url.startsWith('http://') && !url.startsWith('https://'))
                        url = `https://www.google.com/search?q=${encodeURIComponent(url)}`;
                    (await (await env.browser).open)(i, id, url !== null && url !== void 0 ? url : null);
                });
                d.addEventListener('click', async () => {
                    (await (await env.browser).open)(i, id);
                });
                (_c = q('.side.browser')) === null || _c === void 0 ? void 0 : _c.appendChild(d);
                events.delta_focus(i, id);
            });
        else if (n < 4)
            d.addEventListener('click', async () => {
                let focus = await (await (await (await env.browser).wins)[id]).focus;
                console.log(focus);
                if (focus == -1)
                    return;
                (await (await env.browser).go)(focus, n - 2);
            });
        else if (n == 4)
            d.addEventListener('click', async () => {
                let focus = await (await (await (await env.browser).wins)[id]).focus;
                if (focus == -1)
                    return;
                (await (await env.browser).close)(focus);
                Qf(`.side.browser>div:not(.options)[data-id="${focus}"]`)(d => {
                    var _a;
                    (_a = d.parentElement) === null || _a === void 0 ? void 0 : _a.removeChild(d);
                });
            });
    });
    (_b = q('#browser')) === null || _b === void 0 ? void 0 : _b.addEventListener('click', function () {
        var _a;
        let type = this.hasAttribute('class') ? this.getAttribute('class') : '';
        if (type == '')
            (_a = q('.side.browser>div.options>button:first-child')) === null || _a === void 0 ? void 0 : _a.click();
    });
    events.delta_url = async (id, url) => {
        Qf(`.side.browser>div:not(.options)[data-id="${id}"]`)(d => {
            let dom = q('input', d);
            if (dom)
                dom.value = url;
        });
        update_browser_option(id);
    };
    events.delta_title = (id, title) => {
        Qf(`.side.browser>div:not(.options)[data-id="${id}"]`)(d => {
            let dom = q('text', d);
            if (dom)
                dom.innerText = title;
        });
    };
    events.delta_favicon = (id, icons) => {
        Qf(`.side.browser>div:not(.options)[data-id="${id}"]`)(d => {
            let dom = q('img', d);
            if (dom) {
                dom.classList.remove('loaded');
                if (icons.length)
                    dom.src = icons[0];
            }
        });
    };
    events.delta_focus = async (tab, win) => {
        var _a, _b;
        console.log('FOCUSED', tab, win);
        if (win != id)
            return;
        if (tab == -1)
            (_a = q('#browser')) === null || _a === void 0 ? void 0 : _a.setAttribute('class', '');
        Qf(`.side.browser>div:not(.options)`)(d => {
            console.log(d.getAttribute('data-id'), tab, d);
            d.setAttribute('class', d.getAttribute('data-id') == String(tab) ? 'on' : '');
        });
        update_browser_option();
        let err = await (await (await (await env.browser).tabs)[tab]).error;
        console.log('error code', err);
        if (err != 200)
            (_b = q('#browser')) === null || _b === void 0 ? void 0 : _b.setAttribute('class', 'error');
    };
    events.on_error = (code) => {
        var _a;
        (_a = q('#browser')) === null || _a === void 0 ? void 0 : _a.setAttribute('class', 'error');
    };
    window.addEventListener('resize', update_browser_window);
}
var html = `
    <!DOCTYPE><html><head>
        <title>LinguaChat</title>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <link rel="stylesheet" href="style.css">
    </head><body class="chats">
        ${ /* BROWSER COMPONENTS */''}
        <div class="side browser">
            <div class="options">
                ${['f08e:New Tab',
    'f060:Back',
    'f021:Refresh',
    'f061:Next',
    'f00d:Close'
].map(x => x.split(':'))
    .map((x, n) => `<button${n ? ' disabled' : ''}><text>&#x${x[0]};</text><text>${x[1]}</text></button>`).join('')}
            </div>
        </div>
        <div id="browser">
            <text class="icon"></text>
            <text class="text"></text>
        </div>
        ${ /* CHAT COMPONENTS */''}
        <div class="side chat">
            <div class="options text">
                <button><text>&#xf09a;</text><text>Facebook</text></button>
                <input placeholder="Search:"></input>
                <button><text>&#xf002;</text><text>Search</text></button>
            </div>
            <div class="on">
                <img class="loaded" src="https://scontent.fceb2-1.fna.fbcdn.net/v/t1.15752-9/454892547_816538394027707_498233134312495632_n.jpg?stp=dst-jpg_s100x100_tt6&_nc_cat=106&ccb=1-7&_nc_sid=b70caf&_nc_eui2=AeHpTvTtv8ax3aTPDX__GfTgAhb2OurKVicCFvY66spWJ7GaUQamz-E4H11S2BvOvTqae5IGQZE9m_6_8ey2LqZG&_nc_ohc=F0dEX2eGH3QQ7kNvgHWhrSr&_nc_zt=23&_nc_ht=scontent.fceb2-1.fna&oh=03_Q7cD1QFDHorcJ6hEgSDWaw145lfw4y_kqqWAJIHJzCXaZnkwkA&oe=67609FDB"></img>
                <text>Homo Genius Superior & The Peaceful League Of Racists, Fallen Survivors, Yakuza Dawgs, & Fussy Catz</text>
            </div>
            <div>
                <img class="loaded" src="https://scontent.fceb2-1.fna.fbcdn.net/v/t39.30808-1/407378661_2174543962886331_2086404682384341131_n.jpg?stp=c3.10.941.940a_dst-jpg_s100x100&_nc_cat=108&ccb=1-7&_nc_sid=0ecb9b&_nc_eui2=AeEjKfUMMIk_Zh2mWHHkXnR9fXMi4rAeR8N9cyLisB5Hw1YtRmDdMtupnMpe8yoYPkPm9riij83_yjCWduqL8lYx&_nc_ohc=eW1bkwxT4oAQ7kNvgGAfYMo&_nc_ad=z-m&_nc_cid=0&_nc_zt=24&_nc_ht=scontent.fceb2-1.fna&_nc_gid=AQpnyo4lMwOZEjzzppSftfZ&oh=00_AYBHmTub4cgavuH8JfAoeTgkfhYbYvjJhuJwdE4hGFPwnA&oe=673EEDEE"></img>
                <text>Jolex Salmo</text>
            </div>
        </div>
        <div id="chat">
            <div class="body">
                <div>
                    <img src="https://scontent.fmnl13-3.fna.fbcdn.net/v/t39.30808-1/409185686_2239831092888478_7614923379883250579_n.jpg?stp=dst-jpg_s100x100&_nc_cat=105&ccb=1-7&_nc_sid=0ecb9b&_nc_eui2=AeGdegm0PrnBNRXplKMiKwzM14mB99I6lg_XiYH30jqWD4urKrpgA3PEG8PE3QCa_FGvL-CvVfwuVi0zVHpCPzt3&_nc_ohc=0SWzcc56-RcQ7kNvgH-ifp1&_nc_ad=z-m&_nc_cid=0&_nc_zt=24&_nc_ht=scontent.fmnl13-3.fna&_nc_gid=ASlz81YPqa-OBMiPnUNYNzc&oh=00_AYAxmGieYbzimJbHSxTmS9E-V3wK3JdDEsj0fJXywNKzGA&oe=673F36BB"></img>
                    <text>Noli-von</text>
                    <div>
                        <text>gin
                            <div>
                                <h1>gin <i>(already)</i></h1>
                                <h2>Particle - Filipino (Illongo)</h2>
                                <p>Indicates past or completed action</p>
                            </div>
                        </text>
                        <text>ss
                            <div>
                                <h1>ss <i>(screenshot)</i></h1>
                                <h2>Abbreviation</h2>
                                <p>An abbreviation for 'screenshot'.</p>
                            </div>
                        </text>
                        <text>ya
                            <div>
                                <h1>ya <i>(it)</i></h1>
                                <h2>Pronoun - Filipino (Ilonggo)</h2>
                                <p>Refers to a subject or object.</p>
                            </div>
                        </text>
                        <text>na
                            <div>
                                <h1>na <i>(now)</i></h1>
                                <h2>Particle - Filipino (Ilonggo)</h2>
                                <p>Indicates immediacy or completion.</p>
                            </div>
                        </text>
                        <text>nga
                            <div>
                                <h1>nga <i>(that)</i></h1>
                                <h2>Particle - Filipino (Ilonggo)</h2>
                                <p>Used to emphasize or point to something specific.</p>
                            </div>
                        </text>
                        <text>way
                            <div>
                                <h1>way <i>(none)</i></h1>
                                <h2>Noun - Filipino (Ilonggo)</h2>
                                <p>Indicates absence or lack of something.</p>
                            </div>
                        </text>
                        <text>ko
                            <div>
                                <h1>ko <i>(me)</i></h1>
                                <h2>Pronoun - Filipino (Ilonggo)</h2>
                                <p>First person singular possessive pronoun.</p>
                            </div>
                        </text>
                        <div class="translated">
                            He already screenshot without me
                        </div>
                    </div>
                </div>
            </div>
            <div class="foot"></div>
        </div>
        ${ /* MAIN COMPONENTS */''}
        <div id="nav">
            <button>
                <img src="logo_gray.png"></img>
            </button>
            ${['e60e:Browser',
    'e1de:Chats',
    'e0c0:Dictionary',
    'f0c0:Accounts',
    'f085:Settings'
].map(x => x.split(':'))
    .map((x, n) => `<button><text>&#x${x[0]};</text><text>${x[1]}</text></button>`).join('')}
            <div class="ripples"></div>
        </div>
        <script>
            var env_origin = {${Object.keys(env).map(x => `${x}:0`).join(',')}};
            var handle = {
                async get(target, prop, rec) {
                    //var p = performance.now();
                    if (target != env_origin && target.electron_type == 'object' && prop == 'then') return target;
                    let res = await electron.get(target == env_origin ? null : target, prop);
                    //console.log('GET', arguments);
                    //console.log(p,'RES', res);
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
                    return typeof res == 'object' ? undefined : res;
                },
                set(target, prop, val) {
                    //console.log('SET', arguments);
                    return electron.set(target == env_origin ? null : target, prop, val);
                },
                apply(target, thisArg, args) {
                    //console.log('APPLY', arguments, target.data);
                    return electron.run(target.data, args);
                },
            };
            var env = new Proxy(env_origin, handle);
            var events = {${Object.keys(events).map(x => `"${x}":()=>{}`).join(',')}};
            (async () => {
                ${client.toString().slice(25, -1)}
            })();
        </script>
    </body></html>
`;
electron_1.ipcMain.handle('get', (_, from, prop) => {
    var _a, _b;
    let e = env;
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
    let e = env;
    if (from != null)
        for (const name of from.electron_path)
            e = e[name];
    e[prop] = val;
    return e[prop];
});
electron_1.ipcMain.handle('run', (_, from, args) => {
    let e = env;
    let t = env;
    if (from != null)
        for (const name of from.electron_path) {
            t = e;
            e = e[name];
        }
    if (typeof e == 'function')
        return e.apply(t, args);
});
/* ----- SERVICES ------ */
/**
 * Loads main browser window (`window`)
 */
function load_window() {
    mainwin = new electron_1.BrowserWindow({
        width: size[0],
        height: size[1],
        webPreferences: {
            preload: path.join(__dirname, 'preload.js'),
            contextIsolation: true,
        },
    });
    fs.writeFileSync('out/index.html', html, 'utf-8');
    mainwin.loadFile('out/index.html');
}
/* ----- BINDING ----- */
electron_1.app.whenReady().then(load_window);
electron_1.app.on('window-all-closed', () => {
    if (process.platform !== 'darwin')
        electron_1.app.quit();
});
electron_1.app.on('activate', () => {
    if (electron_1.BrowserWindow.getAllWindows().length === 0)
        load_window();
});
