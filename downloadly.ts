import { queue } from 'async'
import { writeFile } from 'fs/promises'
import { load } from 'cheerio'

console.time("downloadly");
const q = queue(async (page: number) => {
    const resp = await fetch(`https://downloadly.ir/page/${page}/`, {
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
    $('article').each(function (i, elm) {
        const title = load(elm)("h2").text();
        const link = load(elm)("a").attr('href');
        links.push({ title, link })
    })
    await writeFile(`downloadly/${page}.json`, JSON.stringify(links, null, 2))
    console.log(page)
}, 2);


q.drain(async () => {
    console.timeEnd('downloadly')
})

for (let i = 1; i <= 10; i++) {
    q.push(i)
    //fetch
}