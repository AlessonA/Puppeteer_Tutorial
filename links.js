const puppeteer = require('puppeteer');

let scrape = async () => {
    const browser = await puppeteer.launch({
        headless: false,
    });
    const page = await browser.newPage();

    await page.goto('http://www2.decom.ufop.br/terralab/posts/?category=all');

    // Acessa e os elementos html para pegar os links dentro da tag article.
    const urls = page.$$eval("article > div > a", (el) => {
        return el.map((a) => a.getAttribute('href'));
    });

    //fecha o navegador depois da execução.
    browser.close();
    return urls
};

scrape()
    .then((value) => {
        console.log(value)
    })
    .catch((error) => console.log(error));