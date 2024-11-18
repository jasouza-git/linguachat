"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const browser_1 = require("./browser");
let browser = new browser_1.Browser({
    size: [800, 800],
    html: /*html*/ `<html>
        <head>
            <title>LinguaChat</title>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <link rel="stylesheet" href="style.css">
        </head>
        <body>
            <!-- BROWSER -->
            <div class="side browser">
                <div class="options">
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
                <div id="browser">
                    <text class="icon"></text>
                    <text class="text"></text>
                </div>
            </div>
            ${ /* CHAT COMPONENTS */''}
            <!-- CHAT -->
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
                
            </script>
        </body>
    </html>`
});
console.log((0, browser_1.client_script)(async (brow) => {
    let url = brow.default_url;
}));
