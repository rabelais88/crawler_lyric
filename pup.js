const puppeteer = require('puppeteer')

const preset = require('./setup_public.json')
const creds = require('./setup_creds.json');


(async () => {
  const browser = await puppeteer.launch({
    headless:false
  })
  const page = await browser.newPage()
  console.log(preset)
  await page.goto(preset.login.url)
  await page.click(preset.login.selectorId)
  await page.keyboard.type(creds.id)
  await page.click(preset.login.selectorPw)
  await page.keyboard.type(creds.pw)
  await page.click(preset.login.selectorSubmit)
  await page.waitForNavigation()
  await page.goto(preset.tracklist.url + '457253')
  await page.waitFor(10*1000)
})()