"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const browser_1 = require("./browser");
let code = (0, browser_1.client_script)(async (brow) => {
    let icons = brow.tabs[0].favicon;
    let url = brow.default_url;
    brow.default_url = 'https://www.google.com';
    brow.open();
});
console.log(code);
