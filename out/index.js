"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const browser_1 = require("./browser");
let client_code = async (async_browser, events) => {
    var _a, _b;
    // Variables
    let main_id = async_browser.new_win();
    let scrp_id = async_browser.new_win([0, -async_browser.size[1], async_browser.size[0] * 2, async_browser.size[1]]); //([async_browser.size[0],0,async_browser.size[0]*2,async_browser.size[1]]);
    let def_url = async_browser.default_url;
    var scraps = {};
    // Shortcuts
    var q = (x, dom = document) => dom.querySelector(x);
    var Qf = (x, dom = document) => ((f) => dom.querySelectorAll(x).forEach(f));
    var Q = (x, dom = document) => Array.from(dom.querySelectorAll(x));
    // Functions
    async function update_browser_window() {
        var _a;
        let r = (_a = q('#browser')) === null || _a === void 0 ? void 0 : _a.getBoundingClientRect();
        if (r == undefined)
            return;
        async_browser.wins[main_id].size = [
            r.left + 2,
            r.top + 2,
            r.width - 4,
            r.height - 4,
        ];
    }
    async function update_browser_option(target_id = null) {
        let focus_id = async_browser.wins[main_id].focus;
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
            let his_len = async_browser.tabs[focus_id].history.length;
            let his_pos = async_browser.tabs[focus_id].history_pos;
            if (n == 1 && his_pos == 0 || n == 3 && his_len == his_pos + 1)
                d.setAttribute('disabled', '');
            else
                d.removeAttribute('disabled');
        });
    }
    async function update_chat_facebook() {
        var _a, _b;
        // Setup scrapper
        Qf('.side.chat>.body')(d => d.innerHTML = '');
        (_a = q('.side.chat')) === null || _a === void 0 ? void 0 : _a.classList.add('loading');
        scraps.fb = async_browser.open(null, scrp_id, 'https://www.facebook.com/messages');
        // Collect group chats
        let data = await async_browser.wait(scraps.fb, '[aria-label="Chats"] [data-virtualized="false"] [role="link"]', doms => {
            var _a;
            /*let head = document.querySelector('[aria-label="Facebook"][role="navigation"]') as HTMLElement;
            if (head) head.style.backgroundColor = 'red';*/
            let out = [];
            for (let d of doms) {
                let prof = d.querySelector('img[referrerpolicy="origin-when-cross-origin"]');
                let name = d.querySelector(':scope>div:first-child>div:first-child>div:nth-child(2)>div>div>div>span>span');
                let prev = d.querySelector(':scope>div:first-child>div:first-child>div:nth-child(2)>div>div>div>div:last-child>span:first-child');
                let last = d.querySelector(':scope>div:first-child>div:first-child>div:nth-child(2)>div>div>div>div:last-child>span:last-child');
                if (prof == null || name == null || prev == null || last == null)
                    continue;
                out.push({
                    link: (_a = d.getAttribute('href')) !== null && _a !== void 0 ? _a : '',
                    prof: prof.src,
                    name: name.innerText,
                    prev: prev.innerText.replace(/\s+/g, ' '),
                    last: last.innerText.split('\n')[0],
                    on: d.getAttribute('aria-current') == 'page',
                });
            }
            return out;
        });
        for (const d of data) {
            let dom = document.createElement('div');
            if (d.on)
                dom.classList.add('on');
            dom.innerHTML = /*html*/ `
                <img class="loaded" src="${d.prof}"></img>
                <text>${d.name}</text>
                <span>${d.prev} ${d.last}</span>
            `;
            (_b = document.querySelector('.side.chat>.body')) === null || _b === void 0 ? void 0 : _b.appendChild(dom);
        }
        setTimeout(() => { var _a; return (_a = document.querySelector('.side.chat')) === null || _a === void 0 ? void 0 : _a.classList.remove('loading'); }, 1);
        // Collect chats
        let chats = await async_browser.wait(scraps.fb, '[role=main]>div>div>div>div>div>div+div>div>div>div>div>div>div>div>div>div>div>div>div [role=row]:last-child>div:first-child>div', doms => {
            var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l;
            let out = [];
            doms = doms.slice(1).reverse();
            var img = null;
            for (const d of doms) {
                let main = d.querySelector(':scope>div[class]:not([role=presentation])');
                if (main == null) {
                    out.push({
                        type: 'status',
                        user: null,
                        data: (_b = (_a = d.querySelector(':scope>div[class][role=presentation]>div:first-child>div:first-child')) === null || _a === void 0 ? void 0 : _a.innerText) !== null && _b !== void 0 ? _b : '',
                    });
                    continue;
                }
                let q = (q, cont = false) => cont ? Array.from(main.querySelectorAll(`:scope>div:nth-child(2)>div:first-child${q}`)) :
                    main.querySelector(`:scope${q}`);
                //let ct = (q='')=>mq(`:scope>div:nth-child(2)>div:first-child${q}`);
                //let cts = (q='')=>main.querySelectorAll(`:scope>div:nth-child(2)>div:first-child${q}`);
                img = (_c = q('>div:first-child img[style="border-radius: 50%;"]')) !== null && _c !== void 0 ? _c : img;
                let attach = q(' [aria-label^="Open Attachment, "]');
                let type = q('>span:first-child') ? 'unsent' :
                    q(' [aria-label="Group audio call"]') ? 'audio call' :
                        q(' [aria-label="Group video call"]') ? 'video call' :
                            q(' [aria-label="Live Location"]') ? 'location' :
                                q(' [aria-label="Audio scrubber"]') ? 'audio' :
                                    '';
                let to_html = (dom) => {
                    var _a, _b, _c;
                    let out = '';
                    if (dom != null)
                        for (const child of dom.childNodes)
                            out += !('tagName' in child) ? ((_a = child.textContent) !== null && _a !== void 0 ? _a : '').replace(/\n/g, '<br>') :
                                child instanceof HTMLSpanElement && child.getAttribute('role') == 'gridcell' ? `<a data-link="${(_b = child.querySelector('a')) === null || _b === void 0 ? void 0 : _b.getAttribute('href')}">${to_html(child.querySelector('a'))}</a>` :
                                    child instanceof HTMLSpanElement && child.querySelector('img') != null ? `<img src="${(_c = child.querySelector('img')) === null || _c === void 0 ? void 0 : _c.src}"></img>` :
                                        '';
                    return out;
                };
                let chat = {
                    type: type,
                    user: ((_e = (_d = q('>div:first-child')) === null || _d === void 0 ? void 0 : _d.getAttribute('style')) === null || _e === void 0 ? void 0 : _e.includes('--paddingEnd')) && img != null ? {
                        name: (_f = img.getAttribute('alt')) !== null && _f !== void 0 ? _f : 'Unknown',
                        prof: (_g = img.getAttribute('src')) !== null && _g !== void 0 ? _g : '',
                        nick: (main === null || main === void 0 ? void 0 : main.previousSibling) instanceof HTMLElement ? main.previousSibling.innerText : '',
                    } : null,
                    data: attach != null ? `<a href="${attach.getAttribute('href')}">${(_h = attach.getAttribute('aria-label')) === null || _h === void 0 ? void 0 : _h.slice(17)}</a>` :
                        q(' span>[dir="auto"]', true).length ? to_html(q(' span>[dir="auto"]', true)[0]) :
                            Array.from(q(' img', true)).map(i => `<img src="${i.src}"></img>`).join(''),
                };
                console.log(chat, (_j = q('>div:first-child')) === null || _j === void 0 ? void 0 : _j.getAttribute('style'));
                if (out.length && ((_k = out[out.length - 1].user) === null || _k === void 0 ? void 0 : _k.name) == ((_l = chat.user) === null || _l === void 0 ? void 0 : _l.name) && !out[out.length - 1].type.length) {
                    out[out.length - 1].data = chat.data + '<br>' + out[out.length - 1].data;
                }
                else
                    out.push(chat);
            }
            out.reverse();
            return out;
            /*
            
            doms => {
            let out:{
                name:string,
                prof:string,
                text:string,
                sent:boolean,
            }[] = [];
            var img:HTMLImageElement|null = null;
            doms.reverse();
            for (const d of doms) {
                let main = d.querySelector(':scope>div[class]:not([role=presentation])')
                let img_tmp = main?.querySelector(':scope>div:first-child img[style="border-radius: 50%;"]') as HTMLImageElement;
                if (img_tmp) img = img_tmp;
                let text = main?.querySelector(':scope>div:nth-child(2)>div:first-child>div:first-child') as HTMLDivElement;
                out.push({
                    name: img == null ? 'Unknown' : img.getAttribute('alt')??'Unknown',
                    prof: img == null ? '' : img.src,
                    text: text == null ? 'Not LOADED!' : text.innerText,
                    sent: main?.querySelector(':scope>div:nth-child(2)>div:first-child>span:first-child') == null,
                });
            }
            out.reverse();
            return out;*/
        });
        let out = '';
        for (const d of chats) {
            out += /*html*/ `
                <div ${d.user == null ? 'class="self"' : ''}>
                    ${d.user != null ? /*html*/ `
                        <img src="${d.user.prof}"></img>
                        <text>${d.user.name}</text>
                    ` : ''}
                    <div>
                        ${d.data}
                    </div>
                    <div class="translated loading">
                    </div>
                </div>
            `;
        }
        //console.log(chats);
        let body = q('#chat .body');
        if (body)
            body.innerHTML = out;
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
        async_browser.wins[main_id].show = n == 'browser';
        async_browser.wins[scrp_id].show = n == 'chats';
        if (n == 'browser')
            update_browser_window();
        else if (n == 'chats') {
            if (scraps.fb == undefined)
                update_chat_facebook();
        }
        /*
        (await (await (await env.browser).wins)[id]).show = n == 'browser';
        (await (await (await env.browser).wins)[s_id]).show = n == 'chats';
        if (n == 'browser') update_browser_window();
        else if (n == 'chats') {
            if (scraps.fb == undefined) {
                Qf('.side.chat>.body>div')(d => d.parentElement?.removeChild(d));
                scraps.fb = {
                    id: await (await (await env.browser).open)(null, s_id, 'https://www.facebook.com/messages'),
                    exec: null,
                };
                scraps.fb.exec = (await (await (await (await (await (await env.browser).tabs)[scraps.fb.id]).view).webContents).executeJavaScript);
                let q_main_chats = '[aria-label="Chats"] [data-virtualized="false"] [role="link"]';
                scraps.fb.exec(wQ(q_main_chats)).then(() =>
                    scraps.fb.exec(wC(`
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
                    `)).then((data:{link:string,prof:string,name:string,prev:string,last:string}[]) => {
                        for (const d of data) {
                            let dom = document.createElement('div');
                            dom.innerHTML = `
                                <img class="loaded" src="${d.prof}"></img>
                                <text>${d.name}</text>
                                <span>${d.prev} ${d.last}</span>
                            `;
                            q('.side.chat')?.appendChild(dom);
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
                        `)).then((data:{name:string,prof:string,text:string}[]) => {
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
                            if (body) body.innerHTML = out;
                        });
                    })
                );
            }
        }*/
    }));
    // Browser
    Qf('.side.browser>.head>button')(async (d, n) => {
        if (n == 0)
            d.addEventListener('click', async () => {
                var _a, _b, _c;
                (_a = q('#browser')) === null || _a === void 0 ? void 0 : _a.setAttribute('class', 'loading');
                let tab_id = async_browser.open(null, main_id, def_url);
                let d = document.createElement('div');
                d.setAttribute('data-id', String(tab_id));
                d.innerHTML = '<input placeholder="Page URL:" value="' + def_url + '"></input><img onload="this.classList.add(\'loaded\')"></img><text></text>';
                (_b = q('input', d)) === null || _b === void 0 ? void 0 : _b.addEventListener('change', async () => {
                    var _a;
                    let url = (_a = q('input', d)) === null || _a === void 0 ? void 0 : _a.value;
                    if (!url.startsWith('http://') && !url.startsWith('https://'))
                        url = `https://www.google.com/search?q=${encodeURIComponent(url)}`;
                    async_browser.open(tab_id, main_id, url !== null && url !== void 0 ? url : null);
                });
                d.addEventListener('click', async () => {
                    async_browser.open(tab_id, main_id);
                });
                (_c = q('.side.browser>.body')) === null || _c === void 0 ? void 0 : _c.appendChild(d);
                events.delta_focus(tab_id, main_id);
            });
        else if (n < 4)
            d.addEventListener('click', async () => {
                let focus = async_browser.wins[main_id].focus;
                if (focus == -1)
                    return;
                async_browser.go(focus, n - 2);
            });
        else if (n == 4)
            d.addEventListener('click', async () => {
                let focus = async_browser.wins[main_id].focus;
                if (focus == -1)
                    return;
                async_browser.close(focus);
                Qf(`.side.browser>.body>div[data-id="${focus}"]`)(d => {
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
    // Events
    events.delta_url = async (id, url) => {
        Qf(`.side.browser>.body>div[data-id="${id}"]`)(d => {
            let dom = q('input', d);
            if (dom)
                dom.value = url;
        });
        update_browser_option(id);
    };
    events.delta_title = (id, title) => {
        Qf(`.side.browser>.body>div[data-id="${id}"]`)(d => {
            let dom = q('text', d);
            if (dom)
                dom.innerText = title;
        });
    };
    events.delta_favicon = (id, icons) => {
        Qf(`.side.browser>.body>div[data-id="${id}"]`)(d => {
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
        if (win == main_id) {
            if (tab == -1)
                (_a = q('#browser')) === null || _a === void 0 ? void 0 : _a.setAttribute('class', '');
            Qf(`.side.browser>.body>div`)(d => {
                console.log(d.getAttribute('data-id'), tab, d);
                d.setAttribute('class', d.getAttribute('data-id') == String(tab) ? 'on' : '');
            });
            update_browser_option();
            let status = async_browser.tabs[tab].status;
            if (status != 200)
                (_b = q('#browser')) === null || _b === void 0 ? void 0 : _b.setAttribute('class', 'error');
        }
    };
    window.addEventListener('resize', update_browser_window);
};
let browser = new browser_1.Browser({
    size: [800, 800],
    html: /*html*/ `<html>
        <head>
            <title>LinguaChat</title>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <link rel="stylesheet" href="style.css">
        </head>
        <body class="chats">
            <!-- BROWSER -->
            <div class="side browser">
                <div class="head">
                    ${['f08e:New Tab',
        'f060:Back',
        'f021:Refresh',
        'f061:Next',
        'f00d:Close'
    ].map(x => x.split(':'))
        .map((x, n) => /*html*/ `
                        <button ${n ? 'disabled' : ''}>
                            <text>&#x${x[0]};</text>
                            <text>${x[1]}</text>
                        </button>
                    `).join('')}
                </div>
                <div class="body"></div>
            </div>
            <div id="browser">
                <text class="icon"></text>
                <text class="text"></text>
            </div>
            <!-- CHAT -->
            <div class="side chat">
                <div class="head text">
                    <button><text>&#xf09a;</text><text>Facebook</text></button>
                    <input placeholder="Search:"></input>
                    <button><text>&#xf002;</text><text>Search</text></button>
                </div>
                <div class="body">
                    <div class="on">
                        <img class="loaded" src="https://scontent.fceb2-1.fna.fbcdn.net/v/t1.15752-9/454892547_816538394027707_498233134312495632_n.jpg?stp=dst-jpg_s100x100_tt6&_nc_cat=106&ccb=1-7&_nc_sid=b70caf&_nc_eui2=AeHpTvTtv8ax3aTPDX__GfTgAhb2OurKVicCFvY66spWJ7GaUQamz-E4H11S2BvOvTqae5IGQZE9m_6_8ey2LqZG&_nc_ohc=F0dEX2eGH3QQ7kNvgHWhrSr&_nc_zt=23&_nc_ht=scontent.fceb2-1.fna&oh=03_Q7cD1QFDHorcJ6hEgSDWaw145lfw4y_kqqWAJIHJzCXaZnkwkA&oe=67609FDB"></img>
                        <text>Homo Genius Superior & The Peaceful League Of Racists, Fallen Survivors, Yakuza Dawgs, & Fussy Catz</text>
                    </div>
                    <div>
                        <img class="loaded" src="https://scontent.fceb2-1.fna.fbcdn.net/v/t39.30808-1/407378661_2174543962886331_2086404682384341131_n.jpg?stp=c3.10.941.940a_dst-jpg_s100x100&_nc_cat=108&ccb=1-7&_nc_sid=0ecb9b&_nc_eui2=AeEjKfUMMIk_Zh2mWHHkXnR9fXMi4rAeR8N9cyLisB5Hw1YtRmDdMtupnMpe8yoYPkPm9riij83_yjCWduqL8lYx&_nc_ohc=eW1bkwxT4oAQ7kNvgGAfYMo&_nc_ad=z-m&_nc_cid=0&_nc_zt=24&_nc_ht=scontent.fceb2-1.fna&_nc_gid=AQpnyo4lMwOZEjzzppSftfZ&oh=00_AYBHmTub4cgavuH8JfAoeTgkfhYbYvjJhuJwdE4hGFPwnA&oe=673EEDEE"></img>
                        <text>Jolex Salmo</text>
                    </div>
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
                        </div>
                        <div class="translated loading">
                            <!--He already screenshot without me-->
                        </div>
                    </div>
                </div>
                <div class="foot"></div>
            </div>
            <!-- MAIN -->
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
        .map((x, n) => /*html*/ `
                    <button>
                        <text>&#x${x[0]};</text>
                        <text>${x[1]}</text>
                    </button>
                `).join('')}
                <div class="ripples"></div>
            </div>
            <script>
                ${(0, browser_1.client_script)(client_code)}
            </script>
        </body>
    </html>`
});
