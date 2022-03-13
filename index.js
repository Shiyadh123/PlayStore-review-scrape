
//importing  dependencies
const puppeteer = require('puppeteer');
const fs = require('fs');
const gplay = require('google-play-scraper');


//ENTER THE APP ID HERE
const appId='com.shopify.mobile';
 

//main function for scraping
(async () => {      

    // code for launching a browser window(in chromium-default)
    const browser = await puppeteer.launch({ headless: false });  

    // code to open a page in the browser
    const page = await browser.newPage();   

     // redirect the page in to  the website to be scrapped                      
    await page.goto("https://play.google.com/store/apps/details?id="+appId);           

    // function to return the total number of reviews of the app
    const reviewsCount = await page.evaluate(() => { 
        let reviewsCountContainer =document.querySelector(".AYi5wd.TBRnV > span");
        let count= reviewsCountContainer.innerHTML;   
         return  count;  
    });
     
    //closing the chromium window
    await browser.close();

    //converting the count from comma separated string to number
    let arr=reviewsCount.split(',');
    let countInNumber=0;
    arr.forEach((i)=> countInNumber=countInNumber+i);


    //fetching the reviews
    gplay.reviews({
        appId: appId,
        sort: gplay.sort.RATING,
        num: parseInt(parseInt(countInNumber))
      })
      .then((reviews)=> {

          //writing the reviews into the file
         fs.writeFile("test.txt", JSON.stringify(reviews.data), function(err) {
            if(err) {
                return console.log(err);
            }
            console.log("The file was saved!");
        });
      });
})(); 



 