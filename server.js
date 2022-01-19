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

var ultimoCache = -123;
var doisCache = -123;
var tresCache = -123;
var quatroCache = -123;

var numeroUltimo = -987;
var numeroDois = -987;
var numeroTres = -987;
var numeroQuatro = -987;

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

    await driver.sleep(3000)

    while (true) {
        console.log(new Date().toLocaleTimeString('BRT'));
        await driver.sleep(500)

        try {
            var isCompleted = await driver.findElement(webdriver.By.xpath('//*[@id="roulette"]')).getAttribute('class');
            var classUltimo = await driver.findElement(webdriver.By.xpath('//*[@id="roulette-recent"]/div/div[1]/div[1]/div/div')).getAttribute('class');
            var classDois = await driver.findElement(webdriver.By.xpath('//*[@id="roulette-recent"]/div/div[1]/div[2]/div/div')).getAttribute('class');
            var classTres = await driver.findElement(webdriver.By.xpath('//*[@id="roulette-recent"]/div/div[1]/div[3]/div/div')).getAttribute('class');
            var classQuatro = await driver.findElement(webdriver.By.xpath('//*[@id="roulette-recent"]/div/div[1]/div[4]/div/div')).getAttribute('class');

            if (isCompleted.includes('complete')) {
                await driver.sleep(2000)

                classUltimo.includes('white') ? numeroUltimo = '0' : numeroUltimo = await driver.findElement(webdriver.By.xpath('//*[@id="roulette-recent"]/div/div[1]/div[1]/div/div/div')).getText();
                classDois.includes('white') ? numeroDois = '0' : numeroDois = await driver.findElement(webdriver.By.xpath('//*[@id="roulette-recent"]/div/div[1]/div[2]/div/div/div')).getText();
                classTres.includes('white') ? numeroTres = '0' : numeroTres = await driver.findElement(webdriver.By.xpath('//*[@id="roulette-recent"]/div/div[1]/div[3]/div/div/div')).getText();
                classQuatro.includes('white') ? numeroQuatro = '0' : numeroQuatro = await driver.findElement(webdriver.By.xpath('//*[@id="roulette-recent"]/div/div[1]/div[4]/div/div/div')).getText();
            }
        } catch (e) {
            console.log(e);
            process.exit(0)
        }

        if (ultimoCache === numeroUltimo &&
            doisCache === numeroDois &&
            tresCache === numeroTres &&
            quatroCache === numeroQuatro) {

            await new Promise(resolve => setTimeout(resolve, 1000))

        } else {

            if (numeroUltimo >= 0) {
                var resultado = {
                    "result": numeroUltimo
                };

                request({
                    url: `http://localhost:${port}/resultados`,
                    method: "POST",
                    json: true,   // <--Very important!!!
                    body: resultado
                }, function (error, response, body) {
                    console.log("Adicionando", numeroUltimo);
                });

                request({
                    url: `http://localhost:${port}/hoje`,
                    method: "POST",
                    json: true,   // <--Very important!!!
                    body: resultado
                }, function (error, response, body) {
                    console.log("Adicionando", numeroUltimo);
                });
            }

            ultimoCache = numeroUltimo;
            doisCache = numeroDois;
            tresCache = numeroTres;
            quatroCache = numeroQuatro;

            if (new Date().toLocaleTimeString('BRT') > '23:59:55') {
                process.exit(0);
            }
        }

        await new Promise(resolve => setTimeout(resolve, 1000))

    }
})()

setInterval(function () {
    https.get("https://webcrepe-mongodb.herokuapp.com");
}, 20 * 60 * 1000); // every 20 minutes
