var q = x=>document.querySelector(x);
var Qf = x=>(f=>document.querySelectorAll(x).forEach(f));
var Q = x=>Array.from(document.querySelectorAll(x));
var tab = {
    len: 0,
    on: -1,
};
if (electron == undefined) {
    var electron = {
        send: (...x) => console.log('ELECTRON SEND', x),
        on: (...x) => console.log('ELECTRON ON', x)
    };
}

function tab_open() {
    q('#browser').setAttribute('class','loading');
    let index = Number(this.getAttribute('data-index'));
    if (isNaN(index)) return;
    tab.on = index;
    Qf('#side>div:not(.options)')((d,n) => {
        if (n == tab.on) d.classList.add('on');
        else d.classList.remove('on')
    });
    electron.send('tab-open', index);
}
function tab_url() {
    q('#browser').setAttribute('class','loading');
    let index = Number(this.parentElement.getAttribute('data-index'));
    if (isNaN(index)) return;
    electron.send('tab-url', this.value);
}
function tab_new() {
    q('#browser').setAttribute('class','loading');
    tab.on = tab.len;
    tab.len++;
    let d = document.createElement('div');
    d.innerHTML='<img onload="this.classList.add(\'loaded\')"></img><text></text><input placeholder="Page URL:"></input>';
    d.querySelector('input').addEventListener('change', tab_url);
    d.setAttribute('data-index', tab.on);
    d.addEventListener('click', tab_open);
    q('#side').insertBefore(d, q('#side>button'));
    Qf('#side>div:not(.options)')((d,n) => {
        if (n == tab.on) d.classList.add('on');
        else d.classList.remove('on')
    });
    electron.send('tab-new', 'https://www.google.com');
}
function tab_close() {
    q('#browser').setAttribute('class',tab.len > 1 ? 'loading' : '');
    q('#side').removeChild(Q('#side>div:not(.options)')[tab.on]);
    Qf('#side>div:not(.options)')((d,n) => d.setAttribute('data-index', n));
    tab.on--;
    tab.len--;
    if (tab.on < 0 && tab.len) tab.on = 0;
    Qf('#side>div:not(.options)')((d,n) => {
        if (n == tab.on) d.classList.add('on');
        else d.classList.remove('on')
    });
    electron.send('tab-close');
}

q('#nav').addEventListener('click', function(e){
    let w = document.createElement('div');
    let r = this.getBoundingClientRect();
    let p = q('#nav .ripples')
    w.classList.add('ripple');
    w.style.left = `${e.clientX-r.left}px`;
    w.style.top = `${e.clientY-r.top}px`;
    p.appendChild(w);
    setTimeout(()=>p.removeChild(w), 500);
});
Qf('#nav>button')(d=>d.addEventListener('click', function() {
    console.log(this);
    let t = this.querySelectorAll('text:last-child');
    if (t.length == 0) return;
    let n = t[0].innerText.toLowerCase();
    document.body.setAttribute('class', n);
}));

q('.side.browser>div.options>button:nth-child(1)').addEventListener('click', tab_new);
q('.side.browser>div.options>button:nth-child(2)').addEventListener('click', ()=>electron.send('tab-back'));
q('.side.browser>div.options>button:nth-child(3)').addEventListener('click', ()=>electron.send('tab-reload'));
q('.side.browser>div.options>button:nth-child(4)').addEventListener('click', ()=>electron.send('tab-next'));
q('.side.browser>div.options>button:nth-child(5)').addEventListener('click', tab_close);

window.addEventListener('resize', e => {
    let r = q('#browser').getBoundingClientRect();
    electron.send('tab-resize', r.left+2, r.top+2, r.width-4, r.height-4);
});
electron.on('url-changed', url => {
    Q('#side>div:not(.options)')[tab.on].querySelector('input').value = url;
});
electron.on('title-changed', title => {
    Q('#side>div:not(.options)')[tab.on].querySelector('text').innerText = title;
});
electron.on('favicon-changed', url => {
    Q('#side>div:not(.options)')[tab.on].querySelector('img').src = url;
});
electron.on('browser-options', (...a) => {
    let c = [true,a[0],tab.len!=0,a[1],tab.len!=0];
    Qf('#side>div.options>button')((b,n) => {
        if (c[n]) b.removeAttribute('disabled');
        else b.setAttribute('disabled','');
    });
});
window.dispatchEvent(new Event('resize'));