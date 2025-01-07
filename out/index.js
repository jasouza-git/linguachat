"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const browser_1 = require("./browser");
let DEBUG = 0;
/* ----- FRONTEND ----- */
let client_code = async (async_browser, events) => {
    var _a;
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
    /* ----- OTHER DATA ----- */
    let browser_id = async_browser.new_win([0, 0, 0, 0]);
    /* ----- SCRAPERS ----- */
    let scrape_id = async_browser.new_win([2 - 800 * 2, 0, 800 * 2, 800]);
    async_browser.wins[scrape_id].show = true;
    let scraper = {
        /**
         * ### Testing Scrapper
         * - `home #N?` - Home Test
         */
        test: {
            session: {},
            get: async function (page) {
                if (page.length == 0)
                    return [];
                if (page[0] == 'home') {
                    let out = [];
                    for (let n = 0; n < 10; n++)
                        out.push(this.rand_chat(2));
                    return out;
                }
                else if (page[0] == 'sub') {
                    let out = [];
                    for (let n = 0; n < 1; n++)
                        out.push(this.rand_chat(0));
                    return out;
                }
                else if (page[0] == 'lang') {
                    let out = [];
                    out.push({
                        name: 'Jan',
                        data: 'punta kau bukas??',
                    });
                    out.push({
                        name: 'Kiefer',
                        data: 'Ano na perma bukas na available?',
                    });
                    out.push({
                        name: 'Jan',
                        data: 'idk din eh',
                    });
                    out.push({
                        name: 'Jan',
                        data: 'Patrick',
                    });
                    /*out.push({
                        name: 'Title',
                        data: '<text class="token"><text class="info">What time did you went to the cinema?</text><text class="token word"><text class="info">What</text>An<text class="token fix root"><text class="info">Change "o" to "u"</text>u</text><text class="token fix"><text class="info">to link with noun</text>ng</text><text class="info sub">\'a.nʊŋ</text></text> <text class="token word noun"><text class="info">time</text>oras<text class="info sub">\'ɔ.ras</text></text> <text class="token word"><text class="info">you</text>ka<text class="info sub">ka</text></text> <text class="token word verb"><text class="info">went</text><text class="token fix"><text class="info">indicates completed action</text>nag<text class="info">past tense</text></text>kadtu<text class="info sub">nag\'kad.tu</text></text> <text class="token word"><text class="info">to</text>sa<text class="info sub">sa</text></text> <text class="token noun"><text class="info">cinema</text>sini<text class="info sub">\'si.ni</text></text>?</text>',
                        //data: '<text class="token sentence"><text class="info">What time did you went to the cinema?</text><text class="token word pronoun"><text class="info">What</text>Ano<text class="token fix"><text class="info">to link with noun</text>ng</text><text class="info">\'a.nʊŋ</text></text> <text class="token word root noun"><text class="info">time</text>oras<text class="info">\'ɔ.ras</text></text> <text class="token word root pronoun"><text class="info">you</text>ka<text class="info">ka</text></text> <text class="token word verb"><text class="info">went</text><text class="token fix"><text class="info">indicates completed action</text>nag<text class="info">past tense</text></text>kadtu<text class="info">nag\'kad.tu</text></text> <text class="token word root preposition"><text class="info">to</text>sa<text class="info">sa</text></text> <text class="token root noun"><text class="info">cinema</text>sini<text class="info">\'si.ni</text></text>?</text>',
                        summ: 'Hello World',
                        date: new Date()
                    });
                    out.push({
                        name: 'Title',
                        data: '<text class="token"><text class="info">The teacher will go to America next month</text><text class="token word noun"><text class="info">Will go to America</text><text class="token fix"><text class="info">future tense or intention</text>Mapa-</text>Amerika<text class="info sub">\'ma.pa.a\'me.ɾi.ka</text></text> <text class="token word"><text class="info">marks the subject of the sentence</text>ang<text class="info sub">aŋ</text></text> <text class="token word"><text class="info">teacher</text><text class="token fix"><text class="info">person with a profession</text>ma\'</text>estro<text class="info sub">ma\'ɛs.tɾo</text></text> <text class="token word"><text class="info">next</text><text class="token fix"><text class="info">future tense</text>sa</text>sunud<text class="info sub">sa\'su.nud</text></text> <text class="token word"><text class="info">linker to noun</text>nga<text class="info sub">ŋa</text></text> <text class="token word"><text class="info">month</text>bulan<text class="info sub">\'bu.lan</text></text></text>'
                    });
                    out.push({
                        name: 'Title',
                        data: '<text class="token sentence"><text class="info">I like apples</text><text class="token pronoun"><text class="info">I/me/my</text>我<text class="info sub">wǒ</text></text><text class="token"><text class="info">like</text><text class="token"><text class="info">to be fond of/to like/to enjoy to be happy/to feel pleased/happiness/delight/glad</text>喜<text class="info sub">xǐ</text></text><text class="token"><text class="info">joyous/happy/pleased</text>欢<text class="info sub">huān</text></text></text><text class="token"><text class="info">apple</text><text class="token"><text class="info">wild herb/duckweed</text>苹<text class="info sub">píng</text></text><text class="token"><text class="info">fruit</text>果<text class="info sub">guǒ</text></text></text></text></text>'
                    });
                    out.push({
                        name: 'JV',
                        data: `<text class="token">
                                <text class="info">Good morning ma’am Besona Phoenix Tata, is it okay ma’am if I’m late?</text>
                                <text class="token word"><text class="info">Good</text>Good<text class="info sub">gʊd</text></text>
                                <text class="token word"><text class="info">morning</text>morning<text class="info sub">ˈmɔːr.nɪŋ</text></text>
                                <text class="token word"><text class="info">ma’am</text>ma’am<text class="info sub">mæm</text></text>
                                <text class="token word noun"><text class="info">Proper noun</text>Besona Phoenix Tata<text class="info sub">ˈbɛ.səʊ.nə ˈfiː.nɪks ˈtɑː.tə</text></text>
                                <text class="token word"><text class="info">okay</text>okay<text class="info sub">ˈoʊ.keɪ</text></text>
                                <text class="token word"><text class="info">ma’am</text>ma’am<text class="info sub">mæm</text></text>
                                <text class="token word"><text class="info">if</text>if<text class="info sub">ɪf</text></text>
                                <text class="token word"><text class="info">I’m</text>I’m<text class="info sub">aɪm</text></text>
                                <text class="token word"><text class="info">late</text>late<text class="info sub">leɪt</text></text>?
                            </text><br><text class="token">
                                <text class="info">There’s a conflict ma’am with one of my subjects.</text>
                                <text class="token word"><text class="info">There is</text>Ga<text class="info sub">gæ</text></text>
                                <text class="token word"><text class="info">conflict</text>conflict<text class="info sub">ˈkɒn.flɪkt</text></text>
                                <text class="token word"><text class="info">ma’am</text>ma’am<text class="info sub">mæm</text></text>
                                <text class="token word"><text class="info">with</text>abi<text class="info sub">ˈæ.bi</text></text>
                                <text class="token word"><text class="info">one</text>isa<text class="info sub">ˈɪ.sæ</text></text>
                                <text class="token word"><text class="info">of</text>mo<text class="info sub">moʊ</text></text>
                                <text class="token word"><text class="info">my</text>ka<text class="info sub">ka</text></text>
                                <text class="token word"><text class="info">subject</text>subject<text class="info sub">ˈsʌb.dʒɪkt</text></text>
                            </text>`
                    });
                    out.push({
                        name: 'Besona',
                        data: `<text class="token">
                            <text class="info">What time are you coming?</text>
                            <text class="token word"><text class="info">What</text>What<text class="info sub">wɒt</text></text>
                            <text class="token word"><text class="info">time</text>time<text class="info sub">taɪm</text></text>
                            <text class="token word"><text class="info">are</text>ka<text class="info sub">ka</text></text>?
                        </text><br><text class="token">
                            <text class="info">Catch up after your exam JV Lechoncito.</text>
                            <text class="token word"><text class="info">Catch</text>Apas<text class="info sub">ˈæ.pəs</text></text>
                            <text class="token word"><text class="info">you</text>ka<text class="info sub">ka</text></text>
                            <text class="token word"><text class="info">just</text>lang<text class="info sub">læŋ</text></text>
                            <text class="token word"><text class="info">after</text>matapus<text class="info sub">məˈtæ.pus</text></text>
                            <text class="token word"><text class="info">your</text>inyo<text class="info sub">ɪn.joʊ</text></text>
                            <text class="token word"><text class="info">exam</text>exam<text class="info sub">ɪgˈzæm</text></text>
                            <text class="token word noun"><text class="info">Proper noun</text>JV Lechoncito<text class="info sub">ˈdʒeɪ.vi ˈlɛtʃ.ɔnˈsi.toʊ</text></text>
                        </text>`
                    });*/
                    return out;
                }
                return [];
            },
            rand: (r, z) => {
                let out = '';
                for (let n = 0; n < z; n++)
                    out += r[Math.floor(r.length * Math.random())];
                return out;
            },
            rand_word: function (z = 1) {
                let out = '';
                for (let n = 0; n < z; n++)
                    out += this.rand('0123456789abcdefghijklmnopqrstuvwxyz      \n', 20).replaceAll('\n', '<br>');
                return out;
            },
            rand_chat: function (n = 0, parent) {
                var _a, _b;
                let o = {
                    favicon: (61440 + Math.floor(Math.random() * 2303)).toString(16), //'f'+this.rand('0123456789abcdef',3),
                    favicon_flag: 2,
                    name: this.rand_word().replaceAll('<br>', ''),
                    data: this.rand_word(5),
                    summ: this.rand_word().replaceAll('<br>', ''),
                    info: this.rand_word().replaceAll('<br>', ''),
                    date: new Date(Number(new Date()) - (5000000 - Math.random() * 10000000)),
                    document: [],
                    children: [],
                    page: ['test', Math.random() < 0.5 ? 'sub' : 'lang'],
                };
                if (o.document)
                    for (let i = 0; i < (n > 0 ? Math.random() * 5 : 0); i++)
                        o.document.push(this.rand_chat(n - 1, o));
                if (o.children)
                    for (let i = 0; i < (n > 0 ? Math.random() * 5 : 0); i++) {
                        let c = this.rand_chat(0, o);
                        if (c.info)
                            c.info = c.info.slice(0, Math.floor(0.5 * Math.random() * ((_b = (_a = c.info) === null || _a === void 0 ? void 0 : _a.length) !== null && _b !== void 0 ? _b : 0)));
                        o.children.push(c);
                    }
                if (parent)
                    o.parent = parent;
                return o;
            }
        },
        /**
         * ### Facebook Scraper
         * By Jason C. D'Souza
         * - `home #N?` - Home Posts
         * - `gc #N?` - Group chats
         * - `chat ID #PAGE` - Chats
         */
        facebook: {
            session: {
                home: { id: -1, act: -1, scroll: 0, last_scroll: 0 },
                chat: { id: -1, act: -1, scroll: 0, img_url: '', img_alt: '' },
            },
            get: async function (page) {
                var _a, _b;
                /**
                 * ### Home Page
                 * - act
                 *   - `-1` - Doesnt exists
                 *   - `0` - Is at home page
                 *   - `1` - Is scrapping posts
                 *   - `2` - Is at comments area
                 *   - `3` - Is scrapping comments
                 * - scroll - Current scroll page of act 0 and 1
                 * - last_scroll - Scroll amount of home before leaving
                 */
                let home = this.session.home;
                let chat = this.session.chat;
                if (page.length > 1 && page[0] == 'home-comment' && !isNaN(Number(page[1])) && !isNaN(Number(page[2]))) {
                    // Ensure that home session is running
                    await waitUntil(() => [0, 2].includes(home.act));
                    if (home.act == 2)
                        await (async_browser.wait(home.id, '[aria-label="Close"]', doms => {
                            doms.forEach(x => x.click());
                            return true;
                        }));
                    home.act = 3;
                    // Parse data
                    let pagen = Number(page[1]), id = Number(page[2]);
                    let pass = { pagen: pagen, id: id };
                    console.log('Scroll data into view');
                    // Scroll data into view
                    await (async_browser.exec(home.id, () => {
                        let dom = document.querySelector(`[data-page="${pass.pagen}"][data-id="${pass.id}"]`);
                        if (dom)
                            dom.scrollIntoView();
                    }, pass));
                    console.log('Click comments');
                    // Click comments
                    await (async_browser.wait(home.id, `[data-page="${pagen}"][data-id="${id}"]>div>div>div>div>div:not([data-0]):not(:first-child)>div>div>div:nth-child(4)>div>div>div>div>div:not(:last-child)>div>div:last-child>div:nth-child(2)>span>div`, doms => {
                        doms[0].click();
                        return true;
                    }));
                    console.log('Read comments');
                    // Read comments
                    let out = await (async_browser.wait(home.id, '[role="dialog"]:not([aria-label="Notifications"])>div>div>div>div:nth-child(2)>div:nth-child(2)>div>div>div:nth-child(2)>div>div:nth-child(2)>div:nth-child(3)>div:not([class])', doms => {
                        var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k;
                        let out = [];
                        for (const dom of doms) {
                            let main = dom.querySelector('[role="article"]');
                            if (main == null)
                                continue;
                            let name = (_b = (_a = main.querySelector(':scope>div:nth-child(2)>div:first-child>div>div:first-child>div:first-child>span')) === null || _a === void 0 ? void 0 : _a.innerText) !== null && _b !== void 0 ? _b : '';
                            let label = (_c = main.getAttribute('aria-label')) !== null && _c !== void 0 ? _c : '';
                            let time = label.slice(12 + name.length);
                            let data_dom = main.querySelector(':scope>div:nth-child(2)>div:first-child>div>div:first-child>div:first-child>div:last-child');
                            let cont = main.querySelector(':scope>div:nth-child(2)>div:nth-child(2)>div>div:not(.html-div)');
                            let videos = (_d = cont === null || cont === void 0 ? void 0 : cont.getElementsByTagName('video')) !== null && _d !== void 0 ? _d : [];
                            let images = (_e = cont === null || cont === void 0 ? void 0 : cont.getElementsByTagName('img')) !== null && _e !== void 0 ? _e : [];
                            let data = (_f = data_dom === null || data_dom === void 0 ? void 0 : data_dom.innerHTML) !== null && _f !== void 0 ? _f : '';
                            let summ = (_g = data_dom === null || data_dom === void 0 ? void 0 : data_dom.innerText) !== null && _g !== void 0 ? _g : '';
                            for (const vid of videos) {
                                data += `<video src="${vid.src}"/>`;
                                summ += `[video]`;
                            }
                            for (const img of images) {
                                data += `<img src="${img.src}"/>`;
                                summ += `[${(_h = img.alt) !== null && _h !== void 0 ? _h : 'image'}]`;
                            }
                            out.push({
                                favicon: (_k = (_j = main.querySelector(':scope>div:first-child>span>a svg image')) === null || _j === void 0 ? void 0 : _j.getAttribute('xlink:href')) !== null && _k !== void 0 ? _k : '',
                                favicon_flag: 1,
                                name: name,
                                info: time,
                                data: data,
                                summ: summ,
                                date: time == 'about a minute ago' ? new Date(Number(new Date()) - 1000 * 60) :
                                    time == 'a day ago' ? new Date(Number(new Date()) - 1000 * 60 * 60 * 24) :
                                        time.endsWith(' minutes ago') ? new Date(Number(new Date()) - Number(time.slice(0, -12)) * 1000 * 60) :
                                            time.endsWith(' hours ago') ? new Date(Number(new Date()) - Number(time.slice(0, -10)) * 1000 * 60 * 60) :
                                                time.endsWith(' days ago') ? new Date(Number(new Date()) - Number(time.slice(0, -9)) * 1000 * 60 * 60 * 24) :
                                                    new Date(),
                            });
                        }
                        return out;
                    }));
                    home.act = 2;
                    return out;
                }
                else if (page.length == 0 || page[0] == 'home') { // home 
                    console.log('GOING HOME');
                    await waitUntil(() => [-1, 0, 2].includes(home.act));
                    console.log('CAN GO ', home.act);
                    let p_act = home.act;
                    home.act = 1;
                    // Variables
                    let pagen = page.length > 1 ? Number(page[1]) : home.scroll;
                    home.id = home.id > -1 ? home.id : async_browser.open(null, scrape_id, 'https://facebook.com/');
                    let pass = { fa: fa, pagen: pagen, id: home.id, last_scroll: home.last_scroll };
                    // Deal with previous session activity
                    if (p_act == 2)
                        await (async_browser.wait(home.id, '[aria-label="Close"]', doms => {
                            doms.forEach(x => x.click());
                            window.scrollTo(0, pass.last_scroll);
                            return true;
                        }, pass));
                    // Scroll to part
                    while (pagen > home.scroll) {
                        home.last_scroll = await (async_browser.exec(home.id, () => {
                            window.scrollTo(0, document.body.scrollHeight);
                            return window.scrollY;
                        }));
                        home.scroll++;
                    }
                    // Scrape
                    let out = await (async_browser.wait(home.id, '[role="main"]>div>div>div>div+div>div>div:last-child>div>div:last-child>div div[aria-labelledby]>div:not([data-page])', doms => {
                        var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k;
                        //                                                  [role="main"]>div>div>div>div+div>div>div:last-child>div>div:last-child>div div[aria-labelledby]>div>div>div>div>div>div:not([data-0]):not(:first-child)>div>div:not([data-page])', doms => {
                        let dat = [];
                        let id = 0;
                        for (const dom of doms) {
                            // Parse element
                            let sec = dom.querySelectorAll(':scope>div>div>div>div>div:not([data-0]):not(:first-child)>div>div>div');
                            if (sec.length < 4)
                                continue;
                            let time = Array.from(sec[1].querySelectorAll(':scope>div>div:nth-child(2)>div>div:nth-child(2) div>span:nth-last-child(3) [attributionsrc] span[aria-labelledby]>span>span')).reduce((a, b) => {
                                let style = window.getComputedStyle(b);
                                return [...a, ...(style.position == 'relative' ?
                                        [[b instanceof HTMLElement ? b.innerText : '', Number(style.order)]]
                                        : [])
                                ];
                            }, []).sort((a, b) => a[1] - b[1]).map(x => x[0]).join('');
                            dom.setAttribute('data-page', String(pass.pagen));
                            dom.setAttribute('data-id', String(id));
                            let comments = ((_b = (_a = sec[3].querySelector(':scope>div>div>div>div>div:not(:last-child)>div>div:last-child>div:nth-child(2)')) === null || _a === void 0 ? void 0 : _a.innerText) !== null && _b !== void 0 ? _b : '0').split(' ')[0];
                            // Skip sponsorships
                            if (time == 'S')
                                continue;
                            // Body scapping   
                            let summ = '';
                            let data = Array.from(sec[2].querySelectorAll(':scope>div')).map(x => {
                                var _a, _b;
                                let imgs = Array.from(x.querySelectorAll('img'));
                                if (imgs.length) {
                                    return imgs.map(y => {
                                        var _a;
                                        if (y.src.startsWith('https://static.xx.fbcdn.net/images/emoji.php'))
                                            return `<text class="emoji">${Array.from(y.alt).map(c => {
                                                let cd = c.codePointAt(0);
                                                summ += c;
                                                if (cd && cd in pass.fa)
                                                    return String.fromCodePoint(pass.fa[cd]);
                                                return c;
                                            }).join('')}</text>`;
                                        summ += `<text class="summ_sent">${(_a = y.getAttribute('alt')) !== null && _a !== void 0 ? _a : 'image'}</text>`;
                                        return `<img src="${y.src}"></img><br>`;
                                    }).join('');
                                }
                                else {
                                    summ += (_a = x.innerText) !== null && _a !== void 0 ? _a : '';
                                    return (_b = x.innerText) !== null && _b !== void 0 ? _b : '';
                                }
                            }).join('<br>');
                            // Add to data
                            dat.push({
                                // Head
                                favicon: (_d = (_c = sec[1].querySelector(':scope>div>div:nth-child(1) svg image')) === null || _c === void 0 ? void 0 : _c.getAttribute('xlink:href')) !== null && _d !== void 0 ? _d : '',
                                favicon_flag: 1,
                                name: (_f = (_e = sec[1].querySelector(':scope>div>div:nth-child(2)>div>div:first-child [attributionsrc]')) === null || _e === void 0 ? void 0 : _e.innerText) !== null && _f !== void 0 ? _f : '',
                                info: sec[1].querySelector(':scope>div>div:nth-child(2)>div>div:nth-child(2)>span>div>span:last-child [title="Shared with Custom"]') ? 'friend' : 'public',
                                date: time.toLowerCase() == 'just\u00A0now' ? new Date() :
                                    time.endsWith('s') ? new Date(new Date().getTime() - Number(time.slice(0, -1)) * 1000) :
                                        time.endsWith('m') ? new Date(new Date().getTime() - Number(time.slice(0, -1)) * 1000 * 60) :
                                            time.endsWith('h') ? new Date(new Date().getTime() - Number(time.slice(0, -1)) * 1000 * 60 * 60) :
                                                time.startsWith('Yesterday') ? new Date(`${new Date().getMonth() + 1}/${new Date().getDate()}/${new Date().getFullYear()} ${time.slice(12)}`) :
                                                    new Date(time.replace(/\sat\s/g, ` ${new Date().getFullYear()} `).replaceAll('AM', ' AM').replaceAll('PM', ' PM')),
                                // Body
                                data: data,
                                summ: summ,
                                // Foot
                                document: [],
                                children: [{
                                        favicon: 'f164',
                                        favicon_flag: 2,
                                        name: 'Reactions',
                                        info: (_h = (_g = sec[3].querySelector(':scope>div>div>div>div>div:not(:last-child)>div>div:first-child>div:last-child>span>div>span[aria-hidden="true"]')) === null || _g === void 0 ? void 0 : _g.innerText) !== null && _h !== void 0 ? _h : '0',
                                    }, {
                                        favicon: 'f086',
                                        favicon_flag: 2,
                                        name: 'Comments',
                                        info: comments,
                                        document: comments == '0' ? [] : [
                                            { page: ['facebook', 'home-comment', String(pass.pagen), String(id)], load: true },
                                            //{favicon:'f599',favicon_flag:2,name:'Test',data:'Test',info:'Test'}
                                        ]
                                    }, {
                                        favicon: 'f1e0',
                                        favicon_flag: 2,
                                        name: 'Share',
                                        info: ((_k = (_j = sec[3].querySelector(':scope>div>div>div>div>div:not(:last-child)>div>div:last-child>div:nth-child(3)')) === null || _j === void 0 ? void 0 : _j.innerText) !== null && _k !== void 0 ? _k : '0').split(' ')[0],
                                    }],
                                page: ['test', Math.random() < 0.5 ? 'sub' : 'lang']
                            });
                            id++;
                        }
                        return dat;
                    }, pass));
                    out.push({ page: ['facebook', 'home', String(pagen + 1)], load: true });
                    home.act = 0;
                    return out;
                }
                else if (page.length > 1 && page[0] == 'chat') {
                    let pagen = page.length > 2 ? Number(page[2]) : chat.scroll;
                    chat.id = chat.id > -1 ? chat.id : async_browser.open(null, scrape_id, `https://facebook.com/messages/t/${page[1]}`);
                    let pass = { pagen: pagen, image_url: chat.img_url, image_alt: chat.img_alt };
                    console.log(`${pagen} > ${chat.scroll}`);
                    while (pagen > chat.scroll) {
                        await (async_browser.wait(home.id, ('[role=main]>div>div>div>div>div>div>div>div>div>div>div>div>div>div[aria-label]>div>div[role="none"]'), doms => {
                            for (const dom of doms)
                                dom.scrollTo(0, 0);
                            document.body.style.background = 'red';
                            return true;
                        }));
                        chat.scroll++;
                    }
                    // Get all chats
                    let out = (await async_browser.wait(chat.id, '[role=main]>div>div>div>div>div>div+div>div>div>div>div>div>div>div>div>div>div>div>div [role=row]:last-child>div:first-child>div:not([data-page])', doms => {
                        var _a, _b, _c;
                        let out = [];
                        let img = new Image();
                        img.src = pass.image_url;
                        img.alt = pass.image_alt;
                        doms.reverse();
                        for (const d of doms) {
                            d.setAttribute('data-page', String(pass.pagen));
                            let main = d.querySelector(':scope>div[class]:not([role=presentation])');
                            let img_tmp = main === null || main === void 0 ? void 0 : main.querySelector(':scope>div:first-child img[style="border-radius: 50%;"]');
                            if (img_tmp)
                                img = img_tmp;
                            out.push({
                                favicon: img == null ? '' : img.src, favicon_flag: 1,
                                name: img == null ? 'Unknown' : (_a = img.getAttribute('alt')) !== null && _a !== void 0 ? _a : '',
                                data: (_c = (_b = main === null || main === void 0 ? void 0 : main.querySelector(':scope>div:nth-child(2)>div:first-child>div:first-child')) === null || _b === void 0 ? void 0 : _b.innerText) !== null && _c !== void 0 ? _c : '',
                            });
                        }
                        out.reverse();
                        for (let n = 1; n < out.length; n++) {
                            if (out[n].name == out[n - 1].name) {
                                out[n - 1].data = `${out[n - 1].data}<br>${out[n].data}`;
                                out.splice(n, 1);
                                n--;
                            }
                        }
                        return out;
                    }, pass));
                    out[0] = {
                        page: ['facebook', 'chat', page[2], String(pagen + 1)],
                        load: true,
                        parse: 1,
                    };
                    if (out.length > 2) {
                        chat.img_url = (_a = out[1].favicon) !== null && _a !== void 0 ? _a : chat.img_url;
                        chat.img_alt = (_b = out[1].name) !== null && _b !== void 0 ? _b : chat.img_alt;
                    }
                    return out;
                }
                return [];
            },
        },
        /**
         * ### Language Scrapper
         */
        lang: {
            session: {
                chatgpt: { id: -1, act: -1, scroll: 0 },
            },
            get: async function (page) {
                // This case scraps from chatgpt, format is: translate <language> <data id>
                if (page.length > 1 && page[0] == 'translate') {
                    let chatgpt = this.session.chatgpt;
                    // Ensure that chatgpt session is running
                    await waitUntil(() => [0].includes(chatgpt.act));
                    chatgpt.act = 1;
                    // Variables
                    let pagen = page.length > 2 ? Number(page[2]) : chatgpt.scroll;
                    chatgpt.id = chatgpt.id > -1 ? chatgpt.id : async_browser.open(null, scrape_id, 'https://chatgpt.com/');
                    //let pass = { pagen:pagen, id:chatgpt.id };
                }
                return [];
            },
        }
    };
    let data_focus = null;
    let profile = {
        name: 'Jason',
        date: '%b %d, %Y %H:%M (%R)',
        data: [
            { name: 'School', page: ['browser', 'https://usa.edu.ph/'], favicon: 'https://usa.mastersofterp.in/IMAGES/logo.png', children: [
                    { favicon: 'f0ac', favicon_flag: 2, name: 'Sites', children: [
                            { name: 'SanAg', page: ['browser', 'https://usa.neolms.com/'], favicon: 'https://usa.mastersofterp.in/IMAGES/logo.png' },
                            { name: 'Mastersoft', page: ['browser', 'https://usa.mastersofterp.in/default.aspx'], favicon: 'https://www.mastersofterp.com/images/favicon.ico' },
                            { name: 'Edusuite', page: ['browser', 'https://www.edusuite.asia/'], favicon: 'https://static.wixstatic.com/media/d50e11_8958b651a8064281b65730f8d88102cb%7Emv2.png/v1/fill/w_192%2Ch_192%2Clg_1%2Cusm_0.66_1.00_0.01/d50e11_8958b651a8064281b65730f8d88102cb%7Emv2.png' },
                        ] },
                    { favicon: 'f63d', favicon_flag: 2, name: 'Classes', children: [
                            { favicon: 'f8b1', favicon_flag: 2, name: 'CpE 311 - Operating System', document: [{ page: ['facebook', 'chat', '8001632903254030'], load: true, parse: 1 }] },
                            { favicon: 'e15a', favicon_flag: 2, name: 'CpE 315 - Logic Circuit', document: [{ page: ['facebook', 'chat', '8732909096733763'], load: true, parse: 1 }] },
                            { favicon: 'f78a', favicon_flag: 2, name: 'CpE 318 - Feedback', document: [{ page: ['facebook', 'chat', '8012298325530894'], load: true, parse: 1 }] }
                        ] },
                    { favicon: 'f500', favicon_flag: 2, name: 'Groups', children: [
                            { favicon: 'f808', favicon_flag: 2, name: 'Homo Genius', page: ['facebook', 'chat', '24744106065235956'] },
                            { favicon: 'f06d', favicon_flag: 2, name: 'Mga Ka-Linte Boys', page: ['facebook', 'chat', '9324936020857360'] }
                        ] },
                    { favicon: 'e533', favicon_flag: 2, name: 'Classmates', children: [
                            { name: 'Prestige Ace Seliedo', page: ['facebook', 'page', '7106254546141917'], favicon: 'https://scontent.fceb2-1.fna.fbcdn.net/v/t39.30808-1/432362057_2192739377736690_7728304573852027316_n.jpg?stp=dst-jpg_p100x100_tt6&_nc_cat=101&ccb=1-7&_nc_sid=0ecb9b&_nc_eui2=AeEod7I8rt8eZI_6Hk0QjXqFIC7HqhizMfogLseqGLMx-kpDo0N0TXC_Bz1xfuWHKNTrvTEdSJKz91iRs5ryYNOW&_nc_ohc=p_lWCtiEegkQ7kNvgEI_7II&_nc_ad=z-m&_nc_cid=0&_nc_zt=24&_nc_ht=scontent.fceb2-1.fna&_nc_gid=ARqPaF4NTsSC-TjN70QemC3&oh=00_AYBI3RZKQUNaqmmk0iO1pEMP-5vi2M5UetTMEVky_lugqQ&oe=67643EEE' },
                            { name: 'Patrick Raymund Hortillas', page: ['facebook', 'page', '7177560485655335'], favicon: 'https://scontent.fceb2-1.fna.fbcdn.net/v/t39.30808-1/336283585_541312681323802_4301575506319880601_n.jpg?stp=c0.0.1536.1536a_dst-jpg_s100x100_tt6&_nc_cat=103&ccb=1-7&_nc_sid=0ecb9b&_nc_eui2=AeHrRRwdU0XpK5o8K5qrzS3SGdasVNWHnb4Z1qxU1YedvhSggzAYVsU7s6KgAcF3JW_tKEW9xGmo_R8Af6lPIJ44&_nc_ohc=4exPyyRQ7K4Q7kNvgGJwPao&_nc_ad=z-m&_nc_cid=0&_nc_zt=24&_nc_ht=scontent.fceb2-1.fna&_nc_gid=ARqPaF4NTsSC-TjN70QemC3&oh=00_AYCY98qvy-oSpKKdZ_d2AFrYhBgS1WLPzGDPZWecYcWVuA&oe=67642978' },
                            { name: 'Brent Lachica', page: ['facebook', 'page', '7251434294983137'], favicon: 'https://scontent.fceb2-2.fna.fbcdn.net/v/t39.30808-1/426600487_2120538914989409_2738855524291754853_n.jpg?stp=dst-jpg_s100x100_tt6&_nc_cat=110&ccb=1-7&_nc_sid=0ecb9b&_nc_eui2=AeFV-WSiA1ZgtmdLzJ1PMV4f4YhiPnF7-3LhiGI-cXv7cvv7EzU1DG8zp8YooFNUfQFiWA3a0xeZSVo8YJQOF_CR&_nc_ohc=UTVPKyLL7JsQ7kNvgEEznnk&_nc_ad=z-m&_nc_cid=0&_nc_zt=24&_nc_ht=scontent.fceb2-2.fna&_nc_gid=ARqPaF4NTsSC-TjN70QemC3&oh=00_AYDSr05_WSIK2Z9rmzjxG_vZJOGji56Fbk271kOmBKaNZQ&oe=676459DE' },
                        ] }
                ] }, //{],load:true}]},
            { favicon: 'f588', favicon_flag: 2, name: 'Entertainment', children: [
                    { favicon: 'f09a', favicon_flag: 2, name: 'Facebook', document: [
                            { page: ['facebook', 'home'], load: true }
                        ] },
                    { favicon: 'https://9gag.com/favicon.ico', name: '9Gag', page: ['9gag', 'home'] },
                    { favicon: 'f167', favicon_flag: 2, name: 'Youtube', page: ['youtube', 'home'] },
                ], document: [{ page: ['test', 'lang'], load: true }] },
            { name: 'LinguaLearn', favicon: 'f1ab', favicon_flag: 2, page: ['lingua'], children: [
                    { name: 'Dictionary', favicon: 'e0c0', favicon_flag: 2, page: ['lingua', 'dict'] },
                    { name: 'Lession', favicon: 'e53d', favicon_flag: 2, page: ['lingua', 'lession'] }
                ] }
        ],
    };
    let data_keys = {};
    let data_keys_inc = 0;
    /* ----- Data processing ----- */
    function register_data(data) {
        if (data.id != undefined)
            return;
        let id = data_keys_inc++;
        data_keys[id] = data;
        data.id = id;
    }
    function parent_data(data = profile.data, parent = null) {
        for (const d of data) {
            register_data(d);
            if (parent != null)
                d.parent = parent;
            if (d.children)
                parent_data(d.children, d);
            if (d.document)
                parent_data(d.document, d);
        }
    }
    parent_data();
    /* ----- Shortcuts ----- */
    function q(x, dom = document) {
        return dom.querySelector(x);
    }
    function Q(x, dom = document) {
        return (f) => dom.querySelectorAll(x).forEach(f);
    }
    function waitUntil(conditionFn, interval = 100) {
        return new Promise(res => {
            const checkCondition = () => {
                if (conditionFn())
                    res();
                else
                    setTimeout(checkCondition, interval);
            };
            checkCondition(); // Start checking
        });
    }
    /** Converts Date Object into prefered date format */
    function format_date(date, format) {
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
            '%R': Math.abs(def) < 1000 ? 'Just now' :
                Math.abs(def) < 60000 ? `${Math.abs(Math.round(def / 1000))}s ${def > 0 ? 'ago' : 'soon'}` :
                    Math.abs(def) < 3600000 ? `${Math.abs(Math.round(def / 60000))}m ${def > 0 ? 'ago' : 'soon'}` :
                        Math.abs(def) < 86400000 ? `${Math.abs(Math.round(def / 3600000))}h ${def > 0 ? 'ago' : 'soon'}` :
                            `${Math.abs(Math.round(Math.abs(def) / 86400000))}d ${def > 0 ? 'ago' : 'soon'}`,
        };
        return format.replace(/%a|%A|%w|%d|%b|%B|%m|%y|%Y|%H|%I|%p|%M|%S|%f|%R/g, (match) => replacements[match]);
    }
    /** Checks if html element is visible */
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
    /* ----- Functions ----- */
    /** Converts chat data into html elements */
    function render_chat(ds) {
        var _a, _b, _c;
        let out = [];
        for (const d of ds) {
            let main = document.createElement('div');
            if (d.load)
                main.classList.add('loader');
            if (d.page)
                main.setAttribute('page', JSON.stringify(d.page));
            if (d.id != undefined)
                main.setAttribute('data-id', String(d.id));
            // Head
            let head = document.createElement('div');
            head.classList.add('head');
            // Favicon
            if (d.favicon) {
                let favicon = document.createElement(d.favicon_flag == 2 ? 'span' : 'img');
                favicon.classList.add('favicon');
                if (d.favicon_flag == 1)
                    favicon.classList.add('circle');
                if (favicon instanceof HTMLSpanElement)
                    favicon.innerHTML = `&#x${d.favicon};`;
                else
                    favicon.src = d.favicon;
                head.appendChild(favicon);
            }
            // Name
            if (d.name || d.info) {
                let name = document.createElement('text');
                name.classList.add('name');
                name.innerText = (_a = d.name) !== null && _a !== void 0 ? _a : '';
                if (d.info) {
                    let info = document.createElement('span');
                    info.innerText = d.info;
                    name.appendChild(info);
                }
                head.appendChild(name);
            }
            // Time
            if (d.date) {
                let date = document.createElement('text');
                date.classList.add('time');
                date.innerText = format_date(d.date, profile.date);
                head.appendChild(date);
            }
            // Options
            if (d.children) {
                let opts = document.createElement('div');
                opts.classList.add('options');
                for (const opt of d.children) {
                    let o = document.createElement('button');
                    o.setAttribute('data-id', String(opt.id));
                    o.addEventListener('click', () => {
                        var _a, _b, _c, _d, _e, _f;
                        let a = o.classList.contains('active');
                        for (const c of (_b = (_a = o.parentElement) === null || _a === void 0 ? void 0 : _a.querySelectorAll(':scope>.active')) !== null && _b !== void 0 ? _b : [])
                            c.classList.remove('active');
                        if (a)
                            o.classList.remove('active');
                        else
                            o.classList.add('active');
                        load_page(a ? d.id : opt.id, (_f = (_e = (_d = (_c = o.parentElement) === null || _c === void 0 ? void 0 : _c.parentElement) === null || _d === void 0 ? void 0 : _d.parentElement) === null || _e === void 0 ? void 0 : _e.querySelector(':scope>.foot')) !== null && _f !== void 0 ? _f : undefined);
                    });
                    if (opt.favicon) {
                        let i = document.createElement(opt.favicon_flag == 2 ? 'span' : 'img');
                        if (i instanceof HTMLSpanElement)
                            i.innerHTML = `&#x${opt.favicon};`;
                        else
                            i.src = opt.favicon;
                        if (opt.favicon_flag == 1)
                            i.classList.add('circle');
                        o.appendChild(i);
                    }
                    if (opt.name) {
                        let n = document.createElement('text');
                        n.innerText = opt.name;
                        o.appendChild(n);
                    }
                    if (opt.info) {
                        let i = document.createElement('p');
                        i.classList.add('info');
                        i.innerText = opt.info;
                        o.appendChild(i);
                    }
                    opts.appendChild(o);
                }
                head.appendChild(opts);
            }
            // Body
            main.appendChild(head);
            let body = document.createElement('div');
            body.classList.add('body');
            body.innerHTML = (_b = d.data) !== null && _b !== void 0 ? _b : '';
            main.appendChild(body);
            // Summary
            let summary = document.createElement('div');
            summary.classList.add('summ');
            let sumt = document.createElement('text');
            sumt.innerHTML = (_c = d.summ) !== null && _c !== void 0 ? _c : '';
            summary.appendChild(sumt);
            main.appendChild(summary);
            // End
            out.push(main);
            // Foot
            if (d.document) {
                for (const c of d.document)
                    c.parent = d;
                let foot = document.createElement('div');
                foot.classList.add('foot');
                let outr = render_chat(d.document);
                for (const o of outr)
                    foot.appendChild(o);
                main.appendChild(foot);
            }
        }
        return out;
    }
    /** Converts tabs data into html element */
    function render_tabs(data = null) {
        var _a;
        let out = document.createElement('div');
        let s = document.createElement('div');
        s.classList.add('scr');
        for (const d of (data !== null && data !== void 0 ? data : profile.data)) {
            let t = document.createElement('button');
            if (d.id != undefined)
                t.setAttribute('data-id', String(d.id));
            t.addEventListener('click', () => tab_focus(d));
            if (d.render) {
                t.classList.add('on');
                if (d.render == 2)
                    t.classList.add('group');
            }
            if (d.render) {
                t.classList.add('on');
                if (d.render == 2)
                    t.classList.add('group');
            }
            if (d.favicon) {
                let favicon = document.createElement(d.favicon_flag == 2 ? 'span' : 'img');
                favicon.classList.add('favicon');
                if (d.favicon_flag == 1)
                    favicon.classList.add('circle');
                if (favicon instanceof HTMLSpanElement)
                    favicon.innerHTML = `&#x${d.favicon};`;
                else
                    favicon.src = d.favicon;
                t.appendChild(favicon);
            }
            if (d.name) {
                let name = document.createElement('text');
                if (!top)
                    name.classList.add('name');
                name.innerText = (_a = d.name) !== null && _a !== void 0 ? _a : '';
                if (d.info && !top) {
                    let info = document.createElement('span');
                    info.innerText = d.info;
                    name.appendChild(info);
                }
                t.appendChild(name);
            }
            if (d.info) {
                let info = document.createElement('p');
                info.classList.add('info');
                info.innerText = d.info;
                t.append(info);
            }
            if (d.render) {
                if (s.children.length)
                    out.appendChild(s);
                s = document.createElement('div');
                s.classList.add('scr');
                out.appendChild(t);
                if (d.children) {
                    let c = render_tabs(d.children);
                    c.classList.add('sub');
                    out.appendChild(c);
                }
            }
            else
                s.append(t);
        }
        if (s.children.length)
            out.appendChild(s);
        //out.appendChild(s);
        if (data == null) {
            let dom = q('#tabs');
            if (dom) {
                dom.innerHTML = '';
                dom.appendChild(out);
                let n = out.children.length;
                for (let i = 0; i < n; i++)
                    dom.appendChild(out.children[0]);
                dom.removeChild(dom.children[0]);
            }
        }
        return out;
    }
    /** Capture new data */
    async function load_page(id, chat) {
        let d = data_keys[id];
        let parent = !d.parent ? profile.data : d.parent.document && d.parent.document.indexOf(d) != -1 ? d.parent.document : d.parent.children;
        if (parent == undefined)
            throw new Error(`ID ${id}: Has no parent`);
        let index = parent.indexOf(d);
        if (index == -1) {
            console.log(d, parent);
            throw new Error(`ID ${id}: Cant find index`);
        }
        let dom_chat = chat !== null && chat !== void 0 ? chat : q('#chat'), dom_site = q('#site'), dom_data = q(`[data-id="${d.id}"]`);
        if (dom_chat == null || dom_site == null || dom_data == null || dom_data.parentElement == null)
            return;
        let path = q('#head_path');
        let site = false;
        let changed = false;
        // Loading content based on document
        if (d.document) {
            dom_chat.innerHTML = '';
            let doms = render_chat(d.document);
            for (const dom of doms)
                dom_chat.appendChild(dom);
            changed = true;
        }
        // Loading content based on page
        if (d.page && d.page.length) {
            // Variables
            let is_scrapper = d.page[0] in scraper;
            // Loading
            if (is_scrapper) {
                let datas = await scraper[d.page[0]].get(d.page.slice(1), d);
                let n = 1;
                parent_data(datas, d.parent);
                for (const data of datas) {
                    register_data(data);
                    parent.splice(index + n++, 0, data);
                }
                parent.splice(index, 1);
                let doms = render_chat(datas);
                // ERRORLOG: Uncaught (in promise) TypeError: Cannot read properties of null (reading 'insertBefore')
                for (const dom of doms)
                    dom_data.parentElement.insertBefore(dom, dom_data);
                if (d.parse && d.parse & 1 && doms.length)
                    doms[doms.length - 1].scrollIntoView();
                dom_data.parentElement.removeChild(dom_data);
                parent.slice(index, 1);
                delete data_keys[id];
                data_keys[id] = {};
            }
            else if (d.page[0] == 'browser') {
                let id = d.meta && d.meta.id != undefined ? d.meta.id : null;
                if (d.meta == undefined)
                    d.meta = {};
                await resized();
                d.meta.id = async_browser.open(id, browser_id, d.page[1]);
                let url = d.page[1];
                path.innerHTML = `<span class="back">${url.includes('://') ? url.slice(0, url.indexOf('://') + 3) : ''}</span>${url.includes('://') ? url.slice(url.indexOf('://') + 3) : url}`;
                site = true;
            }
            changed = true;
        }
        // Change was dectected, update elements
        if (changed) {
            dom_chat.style.display = site ? 'none' : 'flex';
            dom_site.style.display = site ? 'block' : 'none';
            path.style.display = site ? 'block' : 'none';
            async_browser.wins[browser_id].show = site;
            resized();
        }
    }
    /** Focus on new tab */
    async function tab_focus(d) {
        if (data_focus != null) {
            let p = data_focus;
            while (p) {
                p.render = 0;
                p = p.parent;
            }
        }
        if (data_focus != d || d.parent) {
            if (data_focus == d && d.parent)
                d = d.parent;
            let p = d, n = 0;
            while (p) {
                p.render = n == 0 ? 1 : 2;
                n++;
                p = p.parent;
            }
            data_focus = d;
        }
        else
            data_focus = null;
        render_tabs();
        load_page(d.id);
        //update_loaders();
    }
    /** Updates all loaders, if visible then loads */
    function update_loaders() {
        Q('#chat div.loader:not(.loading)')(async (d) => {
            if (!(await is_visible(d)))
                return;
            d.classList.add('loading');
            let id = d.getAttribute('data-id');
            if (id) {
                await load_page(Number(id));
                //if (Object.keys(data_keys[Number(id)]).length==0) d.classList.remove('loading'); 
            }
        });
    }
    /** Resized event handler */
    async function resized() {
        var _a;
        let r = (_a = q('#site')) === null || _a === void 0 ? void 0 : _a.getBoundingClientRect();
        if (r == undefined)
            return;
        async_browser.wins[browser_id].size = [
            r.left,
            r.top,
            r.width,
            r.height,
        ];
        //update_loaders();
    }
    /** Translate */
    let chatgpt_id = -1;
    async function translate() {
        var _a;
        let content = '';
        let ids = [];
        let chat = q('#chat');
        if (chat == null)
            return;
        let n = 0;
        q('#chat').classList.add('translating');
        for (const c of chat.children) {
            let id = Number((_a = c.getAttribute('data-id')) !== null && _a !== void 0 ? _a : '');
            let data = data_keys[id];
            if (data == undefined || data.name == undefined || data.data == undefined)
                continue;
            ids.push(id);
            let div = document.createElement('div');
            div.innerHTML = data.data.replace(/<br>/g, ' ');
            content += `${data.name} #${n}: ${div.innerText}\n`;
            n++;
        }
        chatgpt_id = chatgpt_id > -1 ? chatgpt_id : async_browser.open(null, scrape_id, 'https://chatgpt.com/');
        let prompt = `You are going to be given a discussion, you are to parse it as HTML recursively into tokens in such a way that you teach a learner that only knows "English" to that region.
* The 'token' class represent a block of information, has two 'info' class in the top(representing the meaning/explaination) and the optional bottom(representing the pronounciation). In between them is the token content. The class 'sub' can be used with 'info' to allow the info to always render regardless if token is being focused
* The 'token' class can have additional classes such has:
  - 'word' - represents a word, adds horizontal margins to replicate a word
  - 'fix' - represents a prefix or suffix part
  - 'root' - used together with 'fix' to represent a part of the root that is modified when joined to the prefix/suffix
  - 'noun' - represents a noun



For example this discussion:
John: Anung oras ka nagkadtu sini?
Mary: Mapa-Amerika ang ma’estro sasunud nga bulan.


This is parsed into
[
  \`<text class="token"><text class="info">What time did you went to the cinema?</text><text class="token word"><text class="info">What</text>An<text class="token fix root"><text class="info">Change "o" to "u"</text>u</text><text class="token fix"><text class="info">to link with noun</text>ng</text><text class="info sub">\'a.nʊŋ</text></text> <text class="token word noun"><text class="info">time</text>oras<text class="info sub">\'ɔ.ras</text></text> <text class="token word"><text class="info">you</text>ka<text class="info sub">ka</text></text> <text class="token word verb"><text class="info">went</text><text class="token fix"><text class="info">indicates completed action</text>nag<text class="info">past tense</text></text>kadtu<text class="info sub">nag\'kad.tu</text></text> <text class="token word"><text class="info">to</text>sa<text class="info sub">sa</text></text> <text class="token noun"><text class="info">cinema</text>sini<text class="info sub">\'si.ni</text></text>?</text>\`,
  \`<text class="token"><text class="info">The teacher will go to America next month</text><text class="token word noun"><text class="info">Will go to America</text><text class="token fix"><text class="info">future tense or intention</text>Mapa-</text>Amerika<text class="info sub">\'ma.pa.a\'me.ɾi.ka</text></text> <text class="token word"><text class="info">marks the subject of the sentence</text>ang<text class="info sub">aŋ</text></text> <text class="token word"><text class="info">teacher</text><text class="token fix"><text class="info">person with a profession</text>ma\'</text>estro<text class="info sub">ma\'ɛs.tɾo</text></text> <text class="token word"><text class="info">next</text><text class="token fix"><text class="info">future tense</text>sa</text>sunud<text class="info sub">sa\'su.nud</text></text> <text class="token word"><text class="info">linker to noun</text>nga<text class="info sub">ŋa</text></text> <text class="token word"><text class="info">month</text>bulan<text class="info sub">\'bu.lan</text></text></text>\`,
]

Parse this:

${content}
`;
        let pass = { prompt: prompt };
        await (async_browser.wait(chatgpt_id, '#prompt-textarea', doms => {
            doms[0].innerText = pass.prompt;
            return true;
        }, pass));
        await (async_browser.wait(chatgpt_id, '[aria-label="Send prompt"]', doms => {
            doms[0].click();
            return true;
        }));
        await (async_browser.wait(chatgpt_id, '[aria-label="Stop streaming"]'));
        await (async_browser.wait(chatgpt_id, '[aria-label="Start voice mode"]'));
        let data = await (async_browser.wait(chatgpt_id, 'code.hljs.language-html', doms => {
            return doms[0].innerText.split('\n\n');
        }));
        console.log('REWRITING');
        n = 0;
        for (const d of data) {
            let e = document.querySelector(`[data-id="${ids[n]}"]>.body`);
            if (e)
                e.innerHTML = d;
            n++;
        }
        q('#chat').classList.remove('translating');
        console.log(content, chatgpt_id, data);
    }
    /* ----- Setup ----- */
    render_tabs();
    /* ----- Event listeners ----- */
    (_a = q('#head_translate')) === null || _a === void 0 ? void 0 : _a.addEventListener('click', translate);
    window.addEventListener('resize', resized);
    window.addEventListener('keyup', async (e) => {
        let debug_id = async_browser.wins[scrape_id].focus;
        if (debug_id == -1)
            return;
        if (e.key == 'q')
            console.log(profile.data, data_keys);
        else if (e.key == 'w')
            async_browser.tabs[debug_id].view.webContents.openDevTools();
        else if (e.key == 'a') {
            q('#chat').style.display = 'none';
            q('#site').style.display = 'block';
            resized();
            async_browser.open(debug_id, browser_id);
        }
        else if (e.key == 's') {
            q('#chat').style.display = 'flex';
            q('#site').style.display = 'none';
            resized();
            async_browser.wins[browser_id].show = false;
            async_browser.open(debug_id, scrape_id);
        }
    });
    setInterval(update_loaders, 10);
};
/* ----- BACKEND ----- */
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
                <button id="head_close">
                    <span>&#xf00d;</span>
                    <text>Close</text>
                </button>
                <div id="head_path" contenteditable="true"></div>
                <button id="head_upload">
                    <span>&#xf0ee;</span>
                    <text>Upload</text>
                </button>
                <button id="head_send">
                    <span>&#xe20a;</span>
                    <text>Send</text>
                </button>
                <button id="head_translate">
                    <span>&#xf1ab;</span>
                    <text>Translate</text>
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
