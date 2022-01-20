'use strict'

const chrome = require('selenium-webdriver/chrome');
let webdriver = require('selenium-webdriver');
var https = require("https");

var request = require('request');

// Import DB Connection
require("./config/db");

// require express and bodyParser
const express = require("express");
const bodyParser = require("body-parser");

// create express app
const app = express();

// define port to run express app
const port = process.env.PORT || 3000;

// use bodyParser middleware on express app
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Add endpoint
app.get('/', (req, res) => {
    res.send("Webscraping Blaze Double :D");
});

// Listen to server
app.listen(port, () => {
    console.log(`Servidor rodando em http://localhost:${port}`);
});

// Import API route
var routes = require('./routes/resultadoRoutes'); //importing route
routes(app);

console.log("Rodando web scraping");

var numeroUltimo = -987;

(async function blazeBot() {

    let options = new chrome.Options();
    options.setChromeBinaryPath(process.env.CHROME_BINARY_PATH);
    let serviceBuilder = new chrome.ServiceBuilder(process.env.CHROME_DRIVER_PATH);

    //Don't forget to add these for heroku
    options.addArguments("--headless");
    options.addArguments("--disable-gpu");
    options.addArguments("--no-sandbox");


    let driver = new webdriver.Builder()
        .forBrowser('chrome')
        .setChromeOptions(options)
        .setChromeService(serviceBuilder)
        .build();

    await driver.get('https://blaze.com/pt/games/double')
    await driver.manage().window().maximize()

    await driver.sleep(5000)

    var i = 0;

    while (true) {
        const now = new Date();
        now.setUTCMilliseconds(-3600 * 3 * 1000);

        if (now.toLocaleTimeString('pt-br') > '23:59:55') {
            process.exit(0);
        }

        await driver.sleep(500)

        try {
            var isCompleted = await driver.findElement(webdriver.By.xpath('//*[@id="roulette"]')).getAttribute('class');

            if (isCompleted.includes('complete')) {
                await driver.sleep(2000)
                var classUltimo = await driver.findElement(webdriver.By.xpath('//*[@id="roulette-recent"]/div/div[1]/div[1]/div/div')).getAttribute('class');
                classUltimo.includes('white') ? numeroUltimo = '0' : numeroUltimo = await driver.findElement(webdriver.By.xpath('//*[@id="roulette-recent"]/div/div[1]/div[1]/div/div/div')).getText();

                if (numeroUltimo >= 0) {
                    var resultado = {
                        "time": now.toLocaleTimeString('pt-br').slice(0, 5),
                        "result": numeroUltimo
                    };

                    request({
                        url: `http://localhost:${port}/resultados`,
                        method: "POST",
                        json: true,   // <--Very important!!!
                        body: resultado
                    }, function (error, response, body) {
                    });

                    request({
                        url: `http://localhost:${port}/hoje`,
                        method: "POST",
                        json: true,   // <--Very important!!!
                        body: resultado
                    }, function (error, response, body) {
                    });


                    console.log("Adicionando", numeroUltimo, now.toLocaleTimeString('pt-br'));
                    await driver.sleep(25 * 1000)
                }
            }
        } catch (e) {
            console.log("Deu erro");
            process.exit(0)
        }

    }
})()

setInterval(function () {
    https.get("https://webcrepe-mongodb.herokuapp.com");
}, 20 * 60 * 1000); // every 20 minutes
