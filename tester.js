const puppeteer = require('puppeteer')

const preset = require('./setup_public.json')
const creds = require('./setup_creds.json')
const fs = require('fs');


(async () => {
  const filedata = await openF(preset.csv)
  let artists = filedata.split('\n').map(el=>{
    return el.split(',')
  })
  console.log(`total of ${artists.length} assigned by .csv`)
  //artists[0] = name, [1] = naver artistId
  
  const browser = await puppeteer.launch({
    headless:false
  })
  const page = await browser.newPage()
  page.on('console', console.log);


  await page.goto(preset.login.url)
  await page.click(preset.login.selectorId)
  await page.keyboard.type(creds.id)
  await page.click(preset.login.selectorPw)
  await page.keyboard.type(creds.pw)
  await page.click(preset.login.selectorSubmit)
  await page.waitForNavigation()
  await page.goto(preset.tracklist.url + '457253')
  await page.waitFor(10*1000)


  //test loopy
  //let artistId = '475004'

  
  //-------------------------------------fetch artist tracklist
  console.log('fetch artist tracklist from > ' + preset.tracklist.url + elArtist)
  await page.goto(preset.tracklist.url + elArtist)

  let tracklist = await page.evaluate((selector)=>{
    return [...document.querySelectorAll(selector)].map(el => el.innerText)
  },preset.tracklist.selectorTitle)

  let trackurls = await page.evaluate((selector)=>{
    return [...document.querySelectorAll(selector)].map(el=>/.*trackId=(\d+)/g.exec(el.href)[1])
  },preset.tracklist.selectorUrl)

  //console.log(tracklist)
  //console.log(trackurls)

  //-----------------------------------fetch a lyric
  
  await page.goto(preset.lyric.url + '20609554')
  await page.waitForSelector(preset.lyric.selectorLyric)
  let lyric = await page.evaluate((sel)=> document.querySelector(sel).innerText,preset.lyric.selectorLyric);
  if (lyric == undefined){
    console.log(`${tracklist[elTarget]} ... failed!`)
  }else{
    console.log(`${tracklist[elTarget]} ... success!`)
  }

  //console.log(lyric)

})();

function openF(targetFile){
  return new Promise((resolve,reject)=>{
    fs.readFile(targetFile,'utf-8',(err,res)=>{
      return resolve(res)
    })
  })
}

function openD(targetDirectory){
  return new Promise((resolve,reject)=>{
    fs.readdir(targetDirectory,(err,res)=>{
      return resolve(res)
    })
  })
}

function writeF(targetFile,content){
  return new Promise((resolve,reject)=>{
    fs.writeFile(targetFile, content, 'utf8',(err)=>{
      return resolve(err)
    })
  })
}

/*
//iteration example

//1
let content = await page.evaluate(() => {
  let divs = [...document.querySelectorAll('div')];
  return divs.map((div) => div.textContent.trim());
});

//2
let username = await page.evaluate((sel) => {
    return document.querySelector(sel).getAttribute('href').replace('/', '');
  }, usernameSelector);

let email = await page.evaluate((sel) => {
    let element = document.querySelector(sel);
    return element? element.innerHTML: null;
  }, emailSelector);
*/