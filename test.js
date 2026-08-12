const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  
  page.on('console', msg => console.log('PAGE LOG:', msg.text()));
  page.on('pageerror', err => console.log('PAGE ERROR:', err.message));
  
  console.log('Navigating to login.html...');
  await page.goto('http://localhost:3000/login.html');
  
  console.log('Filling out form...');
  await page.type('#username', 'admin');
  await page.type('#password', 'Admin@123');
  
  // Get captcha
  const captchaText = await page.evaluate(() => document.getElementById('captcha-q').innerText);
  console.log('Captcha question:', captchaText);
  // Solve captcha (basic)
  const [a, op, b] = captchaText.replace('What is ', '').replace('?', '').split(' ');
  let ans = 0;
  if (op === '+') ans = parseInt(a) + parseInt(b);
  if (op === '-') ans = parseInt(a) - parseInt(b);
  if (op === '×') ans = parseInt(a) * parseInt(b);
  
  await page.type('#captcha-answer', ans.toString());
  
  console.log('Clicking login button...');
  await Promise.all([
    page.click('#login-submit'),
    page.waitForNavigation({ timeout: 5000 }).catch(e => console.log('Navigation timeout or error:', e.message))
  ]);
  
  console.log('Current URL after click:', page.url());
  
  await browser.close();
})();
