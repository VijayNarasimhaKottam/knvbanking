const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  
  page.on('console', msg => console.log('PAGE LOG:', msg.text()));
  
  console.log('Navigating to index.html...');
  await page.goto('http://localhost:3000/index.html');
  
  console.log('Clicking Login in navbar...');
  let reloads = 0;
  page.on('framenavigated', frame => {
    if (frame === page.mainFrame()) {
      reloads++;
      console.log('Navigated to:', frame.url());
    }
  });

  await page.click('a[href="login.html"].btn-primary');
  
  // Wait 3 seconds to see if it loops
  await new Promise(r => setTimeout(r, 3000));
  console.log(`Total navigations: ${reloads}`);
  
  await browser.close();
})();
