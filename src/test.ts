import { client_script } from "./browser";

let code = client_script(async brow => {
    let icons = brow.tabs[0].favicon;
    let url = brow.default_url;
    brow.default_url = 'https://www.google.com';
    brow.open();
});
console.log(code);