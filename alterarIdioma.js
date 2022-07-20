const puppeteer = require('puppeteer');

let scrape = async () => {
  const browser = await puppeteer.launch({
    headless: false,
  });
  const page = await browser.newPage();
  await page.goto('https://www.primevideo.com/');
  
  //altera o idioma da pagina
  await page.click('[class="pv-nav-dropl__label"]')
  await page.click('[value="Português (Brasil)‎"]')

   
};

scrape()
  .then((value) => {
    
  })
  .catch((error) => console.log(error));