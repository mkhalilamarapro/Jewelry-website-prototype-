const {defineConfig,devices}=require('@playwright/test');
const exe=process.env.CHROMIUM_PATH?{launchOptions:{executablePath:process.env.CHROMIUM_PATH,args:(process.env.CHROMIUM_ARGS||'').split(' ').filter(Boolean)}}:{};
module.exports=defineConfig({testDir:'./tests',timeout:60000,retries:0,reporter:[['list']],
 use:{trace:'off'},
 projects:[
  {name:'chromium',use:{...devices['Desktop Chrome'],...exe}},
  {name:'firefox',use:{...devices['Desktop Firefox']}},
  {name:'webkit',use:{...devices['Desktop Safari']}}]});
