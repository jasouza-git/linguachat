"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const browser_1 = require("./browser");
/* ----- CLIENT ----- */
let client_code = async (async_browser, events) => {
    /* ----- EMOJI TO FONTAWESOME ----- */
    let fa = {
        0x1F600: 0xf581, // grinning face
        0x1F603: 0xf581, // grinning face with big eyes
        0x1F604: 0xf582, // grinning face with smiling eyes
        0x1F601: 0xf59a, // beaming face with smiling eyes
        0x1F606: 0xf585, // grinning squinting face
        0x1F605: 0xf583, // grinning face with sweat
        0x1F923: 0xf586, // rolling on the floor laughing
        0x1F602: 0xf588, // face with tears of joy
        0x1F642: 0xf118, // slightly smiling face
        0x1F643: 0xe395, // upside-down face
        0x1FAE0: 0xe483, // melting face
        0x1F609: 0xf4da, // winking face
        0x1F60A: 0xf5b8, // smiling face with smiling eyes
        0x1F607: 0xe38f, // smiling face with halo
        0x1F970: 0xe390, // smiling face with hearts
        0x1F60D: 0xf584, // smiling face with heart-eyes
        0x1F929: 0xf587, // star-struck
        0x1F618: 0xf598, // face blowing a kiss
    };
    /* ----- SCRAPPING ----- */
    let scrapers = {
        facebook: {
            url: 'https://www.facebook.com/',
            groups: async (id, page) => {
                let out = [];
                // First click the messages button
                async_browser.wait(id, '[aria-label="Messenger"]', d => { d[0].click(); return true; });
                // Get group chats
                out = await (async_browser.wait(id, '[aria-label="Chats"]  [data-virtualized="false"] [role="link"]', doms => {
                    var _a;
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
                }));
                return out;
            },
            chat_page: [],
            chats: async (p, page) => {
                if (p.chat_page.length == 0)
                    p.chat_page = [0, 0]; // HOME / PAGE 0
                if (p.id == undefined)
                    p.id = async_browser.open(null, scrp_id, p.url);
                if (page > p.chat_page[1])
                    while (p.chat_page[1] < page) {
                        await (async_browser.exec(p.id, () => {
                            window.scrollTo(0, document.body.scrollHeight);
                        }));
                        p.chat_page[1]++;
                    }
                let pass = {
                    fa: fa,
                    page: page,
                    /*parse: (doms:HTMLElement[]):HTMLElement[] => {
                        return [];//doms.filter(d => !d.hasAttribute('data-page'));
                    }*/
                };
                let out = await (async_browser.wait(p.id, `[role="main"]>div>div>div>div+div>div>div:last-child>div>div:last-child>div div[aria-labelledby]>div>div>div>div>div>div:not([data-0]):not(:first-child)>div>div:not([data-page])`, doms => {
                    var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k;
                    let out = [];
                    for (const dom of doms) {
                        dom.setAttribute('data-page', String(pass.page));
                        let sec = dom.querySelectorAll(':scope>div');
                        let time = Array.from(sec[1].querySelectorAll(':scope>div>div:nth-child(2)>div>div:nth-child(2) div>span:nth-last-child(3) [attributionsrc] span[aria-labelledby]>span>span')).reduce((a, b) => {
                            let style = window.getComputedStyle(b);
                            return [...a, ...(style.position == 'relative' ?
                                    [[b instanceof HTMLElement ? b.innerText : '', Number(style.order)]]
                                    : [])
                            ];
                        }, []).sort((a, b) => a[1] - b[1]).map(x => x[0]).join('');
                        let summ = '';
                        let data = Array.from(sec[2].querySelectorAll(':scope>div')).map(x => {
                            var _a, _b;
                            let imgs = Array.from(x.querySelectorAll('img'));
                            if (imgs.length) {
                                return imgs.map(y => {
                                    if (y.src.startsWith('https://static.xx.fbcdn.net/images/emoji.php'))
                                        return `<text class="emoji">${Array.from(y.alt).map(c => {
                                            let cd = c.codePointAt(0);
                                            summ += c;
                                            if (cd && cd in pass.fa)
                                                return String.fromCodePoint(pass.fa[cd]);
                                            return c;
                                        }).join('')}</text>`;
                                    summ += `<text class="summ_sent">image</text>`;
                                    return `<img src="${y.src}"></img><br>`;
                                }).join('');
                            }
                            else {
                                summ += (_a = x.innerText) !== null && _a !== void 0 ? _a : '';
                                return (_b = x.innerText) !== null && _b !== void 0 ? _b : '';
                            }
                        }).join('<br>');
                        out.push({
                            type: '',
                            user: {
                                name: (_b = (_a = sec[1].querySelector(':scope>div>div:nth-child(2)>div>div:first-child [attributionsrc]')) === null || _a === void 0 ? void 0 : _a.innerText) !== null && _b !== void 0 ? _b : '',
                                prof: (_d = (_c = sec[1].querySelector(':scope>div>div:nth-child(1) svg image')) === null || _c === void 0 ? void 0 : _c.getAttribute('xlink:href')) !== null && _d !== void 0 ? _d : '',
                                nick: sec[1].querySelector(':scope>div>div:nth-child(2)>div>div:nth-child(2)>span>div>span:last-child [title="Shared with Custom"]') ? 'friend' : 'public',
                            },
                            data: data,
                            summ: summ,
                            date: time.toLowerCase() == 'just now' ? new Date() :
                                time.endsWith('s') ? new Date(new Date().getTime() - Number(time.slice(0, -1)) * 1000) :
                                    time.endsWith('m') ? new Date(new Date().getTime() - Number(time.slice(0, -1)) * 1000 * 60) :
                                        time.endsWith('h') ? new Date(new Date().getTime() - Number(time.slice(0, -1)) * 1000 * 60 * 60) :
                                            time.startsWith('Yesterday') ? new Date(`${new Date().getMonth() + 1}/${new Date().getDate()}/${new Date().getFullYear()} ${time.slice(12)}`) :
                                                new Date(time.replace(/\sat\s/g, ` ${new Date().getFullYear()} `).replaceAll('AM', ' AM').replaceAll('PM', ' PM')),
                            time: time,
                            reacts: [{
                                    icon: 'f164',
                                    text: 'Reactions',
                                    data: (_f = (_e = sec[3].querySelector(':scope>div>div>div>div>div:not(:last-child)>div>div:first-child>div:last-child>span>div>span[aria-hidden="true"]')) === null || _e === void 0 ? void 0 : _e.innerText) !== null && _f !== void 0 ? _f : '0',
                                }, {
                                    icon: 'f086',
                                    text: 'Comments',
                                    data: ((_h = (_g = sec[3].querySelector(':scope>div>div>div>div>div:not(:last-child)>div>div:last-child>div:nth-child(2)')) === null || _g === void 0 ? void 0 : _g.innerText) !== null && _h !== void 0 ? _h : '0').split(' ')[0],
                                }, {
                                    icon: 'f1e0',
                                    text: 'Share',
                                    data: ((_k = (_j = sec[3].querySelector(':scope>div>div>div>div>div:not(:last-child)>div>div:last-child>div:nth-child(3)')) === null || _j === void 0 ? void 0 : _j.innerText) !== null && _k !== void 0 ? _k : '0').split(' ')[0],
                                }]
                        });
                    }
                    return out;
                }, pass));
                //async_browser.tabs[p.id].view.webContents.openDevTools();
                return out;
            },
            /*
            get_groups_q: '[aria-label="Chats"] [data-virtualized="false"] [role="link"]',
            get_groups: (n,doms) => {
                let out:scrape_group[] = [];
                for (let d of doms) {
                    let prof = d.querySelector<HTMLImageElement>('img[referrerpolicy="origin-when-cross-origin"]');
                    let name = d.querySelector<HTMLSpanElement>(':scope>div:first-child>div:first-child>div:nth-child(2)>div>div>div>span>span');
                    let prev = d.querySelector<HTMLSpanElement>(':scope>div:first-child>div:first-child>div:nth-child(2)>div>div>div>div:last-child>span:first-child');
                    let last = d.querySelector<HTMLSpanElement>(':scope>div:first-child>div:first-child>div:nth-child(2)>div>div>div>div:last-child>span:last-child');
                    if (prof == null || name == null || prev == null || last == null) continue;
                    out.push({
                        link: d.getAttribute('href')??'',
                        prof: prof.src,
                        name: name.innerText,
                        prev: prev.innerText.replace(/\s+/g,' '),
                        last: last.innerText.split('\n')[0],
                        on: d.getAttribute('aria-current')=='page',
                    });
                }
                return out;
            },
            get_chats_q: '[role=main]>div>div>div>div>div>div+div>div>div>div>div>div>div>div>div>div>div>div>div [role=row]:last-child>div:first-child>div',
            get_chats: (n,doms) => {
                let out:scrape_chat[] = [];
                doms = doms.slice(1).reverse();
                var img:HTMLImageElement|null = null;
                for (const d of doms) {
                    let main = d.querySelector(':scope>div[class]:not([role=presentation])');
                    if (main == null) {
                        out.push({
                            type: 'status',
                            user: null,
                            data: d.querySelector<HTMLDivElement>(':scope>div[class][role=presentation]>div:first-child>div:first-child')?.innerText ?? '',
                        });
                        continue;
                    }
                    let q:{ <T extends Element>(q: string, cont: true): T[];
                            <T extends Element>(q: string, cont?: false): T | null;
                    } = <T extends Element>(q,cont=false) => cont ? Array.from(main.querySelectorAll<T>(`:scope>div:nth-child(2)>div:first-child${q}`)) : main.querySelector<T>(`:scope${q}`);
                    
                    img = q('>div:first-child img[style="border-radius: 50%;"]')??img;
                    let attach = q<HTMLAnchorElement>(' [aria-label^="Open Attachment, "]');
                    let type =  q('>span:first-child') ? 'unsent' :
                                q(' [aria-label="Group audio call"]') ? 'audio call' :
                                q(' [aria-label="Group video call"]') ? 'video call' :
                                q(' [aria-label="Live Location"]') ? 'location' :
                                q(' [aria-label="Audio scrubber"]') ? 'audio' :
                                '';
                    let to_html = (dom:HTMLElement|null) => {
                        let out = '';
                        if (dom != null)
                            for (const child of dom.childNodes)
                                out += !('tagName' in child) ? (child.textContent??'').replace(/\n/g,'<br>') :
                                    child instanceof HTMLSpanElement && child.getAttribute('role') == 'gridcell' ? `<a data-link="${child.querySelector('a')?.getAttribute('href')}">${to_html(child.querySelector('a'))}</a>` :
                                    child instanceof HTMLSpanElement && child.querySelector('img') != null ? `<img src="${child.querySelector('img')?.src}"></img>` :
                                    '';
                        return out;
                    };
                    
                    let chat = {
                        type: type,
                        user: q('>div:first-child')?.getAttribute('style')?.includes('--paddingEnd') && img != null ? {
                            name: img.getAttribute('alt')??'Unknown',
                            prof: img.getAttribute('src')??'',
                            nick: main?.previousSibling instanceof HTMLElement ? main.previousSibling.innerText : '',
                        } : null,
                        data: attach != null ? `<a href="${attach.getAttribute('href')}">${attach.getAttribute('aria-label')?.slice(17)}</a>` :
                            q(' span>[dir="auto"]',true).length ? to_html(q<HTMLElement>(' span>[dir="auto"]',true)[0]) :
                            Array.from(q<HTMLImageElement>(' img',true)).map(i=>`<img src="${i.src}"></img>`).join(''),
                    };
                    if (out.length && out[out.length-1].user?.name == chat.user?.name && !out[out.length-1].type.length) {
                            out[out.length-1].data = chat.data+'<br>'+out[out.length-1].data;
                    } else out.push(chat);
                }
                out.reverse();
                return out;
            },*/
        }
    };
    /* ----- PROFILE ----- */
    let profile = {
        name: 'Jason',
        tabs: [
            // Saves
            { favi: 'e0bb', icon: true, text: 'Saves', cont: 'saves' },
            // Facebook
            { favi: 'f09a', icon: true, text: 'Facebook', cont: 'facebook', tabs: [
                    // Group chats
                    { cont: 'facebook' }
                ] }
        ],
        date: '%b %d, %Y %H:%M (%R)',
    };
    // Variables
    //let main_id = async_browser.new_win();
    let scrp_id = async_browser.new_win /*([0,-async_browser.size[1],async_browser.size[0]*2,async_browser.size[1]]);/*/([800, 0, 800, 1600]);
    async_browser.wins[scrp_id].show = true;
    //var scraps:{[site:string]:number} = {};
    let def_url = async_browser.default_url;
    /* ----- Shortcuts ----- */
    var q = (x, dom = document) => dom.querySelector(x);
    var Qf = (x, dom = document) => ((f) => dom.querySelectorAll(x).forEach(f));
    var Q = (x, dom = document) => Array.from(dom.querySelectorAll(x));
    function button(para, add) {
        var _a;
        return /*html*/ `<button ${para.on ? 'class="on"' : ''} ${para.cont ? `data-cont="${para.cont}"` : ''} ${!para.favi ? 'data-empty="true" data-active="false"' : ''}>
            ${para.icon || !para.favi ? /*html*/ `<span ${!para.favi ? 'class="spin"' : ''}>&#x${(_a = para.favi) !== null && _a !== void 0 ? _a : 'f110'};</span>` : /*html*/ `<img ${(add === null || add === void 0 ? void 0 : add.circle) ? 'class="circle"' : ''} src="${para.favi}"></img>`}
            ${para.text ? /*html*/ `<text>${para.text}</text>` : ''}
        </button>`;
    }
    function formatDate(date, format) {
        if (isNaN(Number(date)))
            return '';
        // https://www.w3schools.com/python/python_datetime.asp
        const weeks = ['Sunday', 'Monday', 'Tuesday', 'Wenesday', 'Thursday', 'Friday', 'Saturday'];
        const month = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
        const def = Number(new Date()) - Number(date);
        const replacements = {
            '%a': weeks[date.getDay()].slice(0, 3),
            '%A': weeks[date.getDay()],
            '%w': date.getDay(),
            '%d': date.getDate(),
            '%b': month[date.getMonth()].slice(0, 3),
            '%B': month[date.getMonth()],
            '%m': date.getMonth(),
            '%y': String(date.getFullYear()).slice(-2).padStart(2, '0'),
            '%Y': date.getFullYear(),
            '%H': String(date.getHours()).padStart(2, '0'),
            '%I': String(date.getHours() % 12).padStart(2, '0'),
            '%p': date.getHours() < 12 ? 'AM' : 'PM',
            '%M': String(date.getMinutes()).padStart(2, '0'),
            '%S': String(date.getSeconds()).padStart(2, '0'),
            '%f': String(date.getMilliseconds()).padStart(6, '0'),
            '%R': def < 1000 ? 'Just now' :
                def < 60000 ? `${Math.round(def / 1000)}s ago` :
                    def < 3600000 ? `${Math.round(def / 60000)}m ago` :
                        def < 86400000 ? `${Math.round(def / 3600000)}h ago` :
                            `${Math.round(def / 86400000)}d ago`,
        };
        console.log(replacements);
        return format.replace(/%a|%A|%w|%d|%b|%B|%m|%y|%Y|%H|%I|%p|%M|%S|%f|%R/g, (match) => replacements[match]);
    }
    function generate_tab(tabs = null) {
        let out = '';
        if (tabs == null) {
            out += button({ favi: 'logo_gray.png', text: 'Home' });
            tabs = profile.tabs;
        }
        for (const tab of tabs) {
            out += button(tab);
            if (tab.tabs)
                out += /*html*/ `
                <div class="sub">
                    ${generate_tab(tab.tabs)}
                </div>
            `;
        }
        return out;
    }
    function generate_chat(chat) {
        let out = document.createElement('div');
        // HEAD
        let head = document.createElement('div');
        head.classList.add('head');
        if (chat.user) {
            let prof = document.createElement('img');
            prof.src = chat.user.prof;
            head.appendChild(prof);
            let name = document.createElement('text');
            name.classList.add('name');
            name.innerText = chat.user.name;
            if (chat.user.nick) {
                let nick = document.createElement('span');
                nick.innerText = chat.user.nick;
                name.appendChild(nick);
            }
            head.appendChild(name);
        }
        if (chat.date || chat.time) {
            let time = document.createElement('text');
            time.classList.add('time');
            console.log(chat.date, chat.time);
            time.innerText = chat.date ? formatDate(chat.date, profile.date) : chat.time ? chat.time : '';
            head.appendChild(time);
        }
        // REACTS
        if (chat.reacts) {
            let reacts = document.createElement('div');
            reacts.classList.add('reacts');
            for (const r of chat.reacts) {
                let rb = document.createElement('button');
                let e = document.createElement('span');
                e.innerHTML = `&#x${r.icon};`;
                rb.appendChild(e);
                let t = document.createElement('text');
                t.innerText = r.text;
                rb.appendChild(t);
                let p = document.createElement('p');
                p.classList.add('num');
                p.innerText = r.data;
                rb.appendChild(p);
                reacts.appendChild(rb);
            }
            head.appendChild(reacts);
        }
        out.appendChild(head);
        // TODO ACTS
        // BODY
        let body = document.createElement('div');
        body.classList.add('body');
        body.innerHTML = chat.data;
        out.appendChild(body);
        // Summary
        let summ = document.createElement('div');
        summ.classList.add('summ');
        let summt = document.createElement('text');
        summt.innerHTML = chat.summ;
        summ.appendChild(summt);
        out.appendChild(summ);
        return out;
    }
    async function is_visible(dom) {
        return new Promise(res => {
            const observer = new IntersectionObserver((entries, observer) => {
                for (const entry of entries) {
                    let i = entry.isIntersecting;
                    observer.disconnect();
                    res(i);
                }
            }, { threshold: 0.1 });
            observer.observe(dom);
        });
    }
    function update_loaders() {
        // Update Dynamic Tabs
        Qf('#tabs button[data-active="false"][data-cont][data-empty]')(async (d) => {
            var _a;
            if (!(await is_visible(d)))
                return;
            d.setAttribute('data-active', 'true');
            let cont = (_a = d.getAttribute('data-cont')) !== null && _a !== void 0 ? _a : '';
            if (scrapers[cont].id == undefined)
                scrapers[cont].id = async_browser.open(null, scrp_id, scrapers[cont].url);
            let tabs = await scrapers[cont].groups(scrapers[cont].id, 0);
            let p = d.parentElement;
            let parser = new DOMParser();
            console.log(p, d, tabs);
            for (const tab of tabs) {
                let but = parser.parseFromString(button({
                    text: tab.name,
                    favi: tab.prof,
                }, { circle: true }), 'text/html');
                let but_dom = but.body.firstChild;
                if (but_dom)
                    p === null || p === void 0 ? void 0 : p.appendChild(but_dom);
            }
            p === null || p === void 0 ? void 0 : p.removeChild(d);
        });
        Qf('#chat p.loader[data-active="false"][data-cont][data-page]')(async (d) => {
            var _a, _b, _c;
            if (!(await is_visible(d)))
                return;
            d.setAttribute('data-active', 'true');
            let scp = scrapers[(_a = d.getAttribute('data-cont')) !== null && _a !== void 0 ? _a : ''];
            let page = Number(d.getAttribute('data-page'));
            let chats = await scp.chats(scp, page, fa);
            let loader = document.createElement('p');
            loader.classList.add('loader');
            loader.setAttribute('data-active', 'false');
            loader.setAttribute('data-cont', (_b = d.getAttribute('data-cont')) !== null && _b !== void 0 ? _b : '');
            loader.setAttribute('data-page', String(Number((_c = d.getAttribute('data-page')) !== null && _c !== void 0 ? _c : '0') + 1));
            Qf('#chat')(c => {
                c.removeChild(d);
                for (const chat of chats) {
                    console.log('ADDING', chat);
                    c.appendChild(generate_chat(chat));
                }
                c.appendChild(loader);
            });
            update_loaders();
        });
    }
    // Tabs
    Qf('#tabs')(d => {
        d.innerHTML = generate_tab();
        d.onclick = async (e) => {
            let f = e.target;
            while (f != d && f != null && !(f instanceof HTMLButtonElement))
                f = f.parentNode;
            if (f == null)
                return;
            Qf('#tabs button.on')(d => {
                if (d.nextElementSibling && d.nextElementSibling.classList.contains('sub') && d.nextElementSibling.contains(f)) {
                    d.classList.add('group');
                }
                else
                    d.classList.remove('on');
            });
            f.classList.toggle('on');
            if (f.hasAttribute('data-cont') && !f.hasAttribute('data-empty')) {
                Qf('#chat')(d => d.innerHTML = '<p class="loader" data-active="false" data-cont="' + f.getAttribute('data-cont') + '"data-page="0"></p>');
            }
            update_loaders();
        };
    });
    Qf('#chat')(d => d.addEventListener('scroll', update_loaders));
    /*Qf<HTMLButtonElement>('#tabs button')(d=>d.onclick=()=>{
        d.classList.toggle('on');
        changed_tab();
    });*/
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
        <body class="">
            <div id="tabs">
            </div>
            <div id="head">
                <button>
                    <span>&#xf00d;</span>
                    <text>Close</text>
                </button>
                <div contenteditable="true">
                    <span class="back">https://</span>facebook.com
                </div>
                <button>
                    <span>&#xf0ee;</span>
                    <text>Upload</text>
                </button>
                <button>
                    <span>&#xe20a;</span>
                    <text>Send</text>
                </button>
            </div>
            <div id="site">
            </div>
            <div id="chat">
            </div>
            <script>
                ${(0, browser_1.client_script)(client_code)}
            </script>
        </body>
    </html>`
});
