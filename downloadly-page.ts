import { queue } from 'async'
import { writeFile, readFile } from 'fs/promises'
import { load } from 'cheerio'

interface PageLink {
    title: string,
    link: string
}

console.time("downloadly");
const q = queue(async (page: PageLink) => {
    const resp = await fetch(page.link, {
        "credentials": "include",
        "headers": {
            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:125.0) Gecko/20100101 Firefox/125.0",
            "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8",
            "Accept-Language": "en-US,en;q=0.5",
            "Upgrade-Insecure-Requests": "1",
            "Sec-Fetch-Dest": "document",
            "Sec-Fetch-Mode": "navigate",
            "Sec-Fetch-Site": "none",
            "Sec-Fetch-User": "?1"
        },
        "method": "GET",
        "mode": "cors"
    });

    //css selector
    //jquery
    const data = await resp.text();
    const $ = load(data);

    const links: any = [];
    const desc = $('.post_content p').first().text();

    console.log(page.title)
    $('.post_content a').each(function (i, elm) {
        if (elm.attribs.href.indexOf('.rar') > -1) {
            console.log(elm.attribs.href)
        }
    })

}, 2);


q.drain(async () => {
    console.timeEnd('downloadly')
})

const content = (await readFile(`downloadly/${1}.json`)).toString();
const data = JSON.parse(content);

for (let i = 0; i < data.length; i++) {
    q.push(data[i])
    //fetch
}