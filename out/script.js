// @ts-check

/** @type {{send:(...x:any[])=>void,on:(...x:any[])=>void}} */
// @ts-ignore
const electron = window.electron ?? {
    send: (...x) => console.log('ELECTRON SEND: ', x),
    on: (...x) => console.log('ELECTRON ON: ', x),
};
/** Browser API
 * - Connection to `electron`
 *   - `tab-open(id:number,url:string)` - Opens a tab
 *   - `tab-go(step:number)` - Goes to a step in the tab focused history
 *   - `tab-close` - Closes current tab focused
 *   - `tab-show` - Shows browser
 *   - `tab-hide` - Hides browser
 * - Properties
 *   - `dom` - Browser div element
 *   - `tabs` - All tabs in browser
 *   - `focus` - Current tab being shown
 *   - `on_focus` - Triggered when a tab is focused/shown
 *   - `on_blue` - Triggered when the browser is hidden
 *   - `open` - Opens a tab
 *   - `get_id` - Gets available id for new tab
 *   - `go(n)` - Step in focused tab's history
 *   - `close()` - Closes focused tab
 *   - `show()` - Shows/Resizes browser
 *   - `error()` - Shows browser error
 */
class Browser {
    /* ----- PROPERTIES ----- */
    /** @type {HTMLElement} */
    dom;
    /** @type {{[index:number]:{url:string}}} */
    tabs = {};
    /** @type {number} */
    focus = -1;
    /** @type {number} */
    id;

    /* ----- EVENT LISTENERS ----- */
    /**
     * Triggered when a tab becomes visible
     * @param {number} id 
     */
    on_focus = id => {};
    /**
     * Triggered when no tabs are visible
     */
    on_blur = () => {};
    /**
     * Triggered when a tab changes url
     * @param {number} id 
     * @param {string} url 
     */
    on_delta_url = (id, url) => {};
    /**
     * Triggered when a tab changes title
     * @param {number} id 
     * @param {string} title 
     */
    on_delta_title = (id, title) => {};
    /**
     * Triggered when a tab changes favicon
     * @param {number} id 
     * @param {string} favicon 
     */
    on_delta_favicon = (id, favicon) => {};

    /* ----- ACTIONS ----- */
    /**
     * Opens a tab
     * - If `id` is null then creates a new tab
     * - If `url` is not null then sets the tab url
     * @param {number} id - ID of tab
     * @param {string|null} url - URL of tab
     */
    open(id, url=null) {
        this.dom.setAttribute('class','loading');
        electron.send('tab-open', id, url);
    }
    /** @returns {number} Available ID for new tab */
    new_id() {
        let id = 0;
        while (this.tabs[id] != undefined) id++;
        return id;
    }
    /**
     * Goes to a history path relative present
     * @param {number} n - Step size
     */
    go(n) {
        if (this.focus == -1) return this.error();
        electron.send('tab-go', this.focus, n);
    }
    /**
     * Closes the current tab in focus
     */
    close() {
        if (this.focus == -1) return this.error();
        electron.send('tab-close', this.focus);
    }
    /**
     * Shows/Resizes the browser tab
     */
    show() {
        let r = this.dom.getBoundingClientRect();
        electron.send('tab-resize', r.left+2, r.top+2, r.width-4, r.height-4);
    }
    /**
     * Shows error in tab
     */
    error() {
        this.dom.setAttribute('class','error');
        electron.send('tab-hide');
    }
    
    /* ----- CONSTRUCTOR ----- */
    /** @param {HTMLElement} dom */
    constructor(dom) {
        this.dom = dom;
        electron.on('browser-created', id => {
            this.id = id;
            window.addEventListener('resize', this.show);
            
            electron.on('url-changed', (id,url) => {
                this.on_delta_url(id,url);
            });
            electron.on('title-changed', (id,title) => {
                this.on_delta_title(id,title);
            });
            electron.on('favicon-changed', (id,url) => {
                this.on_delta_favicon(id, url);
            });
        });
        electron.send('browser-create');
        /*electron.on('browser-options', (...a) => {
            let c = [true,a[0],tab.len!=0,a[1],tab.len!=0];
            Qf('.side.browser>div.options>button')((b,n) => {
                if (c[n]) b.removeAttribute('disabled');
                else b.setAttribute('disabled','');
            });
        });*/
    }
}

/* ----- USEFUL FUNCTIONS ----- */
/**
 * Gets a single query match
 * @param {string} x - CSS Query
 * @returns {HTMLElement|null}
 */
var q = x=>document.querySelector(x);
/**
 * Does a for each loop to each query
 * @param {string} x - CSS Query
 * @returns {(f:(x:HTMLElement,n:number)=>void)=>void}
 */
var Qf = x=>(f=>document.querySelectorAll(x).forEach((x,n)=>{
    if (x instanceof HTMLElement) f(x,n);
}));
/**
 * Returns an array of elements
 * @param {string} x - CSS Query
 * @returns {HTMLElement[]}
 */
var Q = x=>Array.from(document.querySelectorAll(x));
/**
 * Main Browser
 */
var browser = new Browser(q('#browser')??document.createElement('div'));


/** ----- BINDING ----- */
/**
 * Returns the tab element based on id and a function to deal with it
 * @param {number} id 
 * @param {(x:HTMLElement)=>void} f
 */
var QTab = (id,f) => Qf(`.side.browser>div:not(.options)[data-id=${id}]`)(f);
browser.on_blur = () => Qf('.side.browser>div:not(.options).on')(d=>d.classList.remove('on'));
browser.on_focus = id => {
    browser.on_blur();
    QTab(id,d=>d.classList.add('on'));
};
browser.on_delta_url = (id, url) => {
    QTab(id,d=>{
        let i = d.querySelector('input');
        if (i) i.value = url;
    });
};
browser.on_delta_title = (id, title) => {
    QTab(id,d=>{
        let i = d.querySelector('text');
        // @ts-ignore
        if (i) i.innerText = title;
    });
};
browser.on_delta_favicon = (id, url) => {
    QTab(id,d=>{
        let i = d.querySelector('img');
        if (i) i.src = url;
    });
};
Qf('.side.browser>div.options>button')((d,n) => {
    switch (n) {
        case 0:
            d.addEventListener('click', function(){
                let id = browser.new_id();
                let d = document.createElement('div');
                d.setAttribute('data-id', String(id));
                d.innerHTML='<img onload="this.classList.add(\'loaded\')"></img><text></text><input placeholder="Page URL:" value="www.google.com"></input>';
                d.querySelector('input')?.addEventListener('change', () => {
                    browser.open(id, d.querySelector('input')?.value??null);
                });
                d.addEventListener('click', ()=>browser.open(id));
                q('.side.browser')?.appendChild(d);
                d.click();
            });
            break;
        case 1:
            d.addEventListener('click', function(){
                browser.go(-1);
            });
            break;
        case 2:
            d.addEventListener('click', function(){
                browser.go(0);
            });
            break;
        case 3:
            d.addEventListener('click', function(){
                browser.go(1);
            });
            break;
        case 4:
            d.addEventListener('click', function(){
                browser.close();
            });
            break;
    } 
});


q('#nav')?.addEventListener('click', function(e){
    let w = document.createElement('div');
    let r = this.getBoundingClientRect();
    let p = q('#nav .ripples');
    w.classList.add('ripple');
    w.style.left = `${e.clientX-r.left}px`;
    w.style.top = `${e.clientY-r.top}px`;
    p?.appendChild(w);
    setTimeout(()=>p?.removeChild(w), 500);
});
Qf('#nav>button')(d=>d.addEventListener('click', function() {
    /** @type {HTMLElement[]} */
    let t = Array.from(this.querySelectorAll('text:last-child'));
    if (t.length == 0) return;
    let n = t[0].innerText.toLowerCase();
    document.body.setAttribute('class', n);
    if (n == 'browser') browser.show();
}));
