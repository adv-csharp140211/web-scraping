import { queue } from 'async'
import { writeFile } from 'fs/promises'

console.time("ttac");
const q = queue(async (id: number) => {
    const resp = await fetch(`https://newapi.ttac.ir/irfdamobile/v1/getnfisearchbyid?id=${id}`, {
        "credentials": "omit",
        "headers": {
            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:125.0) Gecko/20100101 Firefox/125.0",
            "Accept": "*/*",
            "Accept-Language": "en-US,en;q=0.5",
            "x-ssp-api-key": "1e1f660f-0b6d-44a7-b0fc-7aa4ae4c041e",
            "Sec-Fetch-Dest": "empty",
            "Sec-Fetch-Mode": "cors",
            "Sec-Fetch-Site": "same-site"
        },
        "referrer": "https://mobile.ttac.ir/",
        "method": "GET",
        "mode": "cors"
    });
    // const text = await resp.text();
    // await writeFile(`ttac/${id}.json`, text)
    const data = await resp.json();
    await writeFile(`ttac/${id}.json`, JSON.stringify(data, null, 2))
    console.log(id)
}, 10);


q.drain(async () => {
    console.timeEnd('ttac')
})

for (let i = 1; i <= 100; i++) {
    q.push(i)
    //fetch
}