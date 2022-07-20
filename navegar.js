const puppeteer = require('puppeteer');
const createCsvWriter = require("csv-writer").createObjectCsvWriter;

let scrape = async () => {
    const browser = await puppeteer.launch({
        headless: false,
    });
    const page = await browser.newPage();

    await page.goto('http://www2.decom.ufop.br/terralab/posts/?category=all');

    let haveNext = false;
    let links = [];
    do {
        haveNext = false;
        const urls = await page.$$eval("article > div > a", (el) => {
            return el.map((a) => a.getAttribute("href"));
        }) // coleta os links presentes dentro das postagens
        
        links = links.concat(urls); 
        //concatenamos o resultado dessa página com o das páginas anteriores
        const button_next_page = await page.$("ul.page-numbers > li > a.next.page-numbers");
        
        if(button_next_page){
            await Promise.all(
                [
                    page.waitForNavigation(),  //espera que a navegação entre as páginas tenha terminado
                    page.$eval("ul.page-numbers > li > a.next.page-numbers", e => e.click()) //encontra a seta >> com com $eval e clica no elemento
                ]
            );
            haveNext = true;
        }
    } while (haveNext)
    const posts = []
    for (const url of links) {
        await page.goto(url);
        await page.waitForSelector("div.entry-content > div");

        const title = await page.$eval("div.header-callout > section > div > div > div > h3", (title) => title.innerText);
        const image = await page.$eval("header > a > img",(image) => image.getAttribute("src"));
        const content = await page.$eval("div.entry-content > div", el => el.innerText);

        const post = {
            title,
            image,
            content
        };
        posts.push(post);
    }

    browser.close();
    return posts;
};

scrape()
    .then((value) => {
        const csvWriter = createCsvWriter({
            path: "file.csv",
            header: [
                {id: 'title',title: 'Titulo'},
                {id: 'image',title: 'Imagem'},
                {id: 'content',title: 'Conteudo'},
            ],
        });
        csvWriter
        .writeRecords(value)
        .then(() => {
            console.log("...Feito");
        });
    })
    .catch((error) => console.log(error));