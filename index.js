const express = require('express')
const db = require('./database');
const browserObject = require('./browser');
const scraperController = require('./pageController');

const app = express()

//Start the browser and create a browser instance
let browserInstance = browserObject.startBrowser();

// Pass the browser instance to the scraper controller
scraperController(browserInstance)

// target port 
app.listen(3000,()=>{
    console.log('Server running on port 3000')
})

// req ( going to server )
// res (feedback from server)
app.get('/', function (req, res) {
  res.send('Hello World')
})
