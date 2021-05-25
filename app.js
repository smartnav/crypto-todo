const express = require('express');
const logger = require('morgan');
const axios = require('axios');
const models = require('./server/models');
const cron = require('node-cron');
require('dotenv').config()
const CRONTIME = process.env.CRONTIME || 2;
// Set up the express app
const app = express();

// Log requests to the console.
app.use(logger('dev'));


// Setup a default route that sends back a welcome message in JSON format.
app.get('/', (req, res) => res.status(200).send({
  message: 'Welcome crypto todo app.',
}));

// WS request:
app.get('/service/price', async(req, res) => {
  const { fsyms, tsyms } = req.query;
  let cryptoRes = await cryptoSync(); 
  let record  = await getRec(fsyms, tsyms, cryptoRes);
  res.send(record);
})

// Get records from db if cryptoRes is null
const getRec = (fsyms, tsyms, cryptoRes = null) => {
    return new Promise((resolve, reject) => {
        if(cryptoRes){
            let result = display(cryptoRes, fsyms.split(','), tsyms.split(','))
            resolve(result);
        }else{
            models.cryptocompare
            .findOne({attributes: ['RAW', 'DISPLAY'], order: [['id', 'DESC']]})
            .then((data) => {
                let result = display(data.dataValues, fsyms.split(','), tsyms.split(','))
                resolve(result);
            })
            .catch((error) => {
                console.log('errr', error);
                resolve(false);
            });
        }
    })
}

//Sync realtime data with cryto url
const cryptoSync = (fsyms, tsyms) => {
    return new Promise((resolve, reject) => {
        let cryptoUrl = process.env.CRYPTO_URL;
        axios.get(cryptoUrl, {
            params: {
                fsyms : fsyms || process.env.FSYMS,
                tsyms : tsyms || process.env.TSYMS
            }
        })
        .then(async (response) => {
            //handle success
            if(response.data){
                let finalData = display(response.data);
                insertRec(finalData);
                resolve(finalData);
            }else{
                console.log("Error in fetch data");
                resolve(null)
            }
        })
        .catch(function (error) {
            // handle error
            console.log(error);
            resolve(null)
        })
    })
}

//Format the response
const display = (responsObj, fsymsArray=[], tsymsArray=[]) => {
        let finalData = {};
        for (const property in responsObj) {
            if (Object.hasOwnProperty.call(responsObj, property)) {
            let fsymsObj = responsObj[property];
            finalData[property] = {};
                for (const fsyms in fsymsObj) {
                    if(fsymsArray.length == 0 || fsymsArray.includes(fsyms)){
                        if (Object.hasOwnProperty.call(fsymsObj, fsyms)) {
                            const tsymsObj = fsymsObj[fsyms];
                            finalData[property][fsyms] = {};
                                for (const tsyms in tsymsObj) {
                                    if(tsymsArray.length == 0 || tsymsArray.includes(tsyms)){
                                    if (Object.hasOwnProperty.call(tsymsObj, tsyms)) {
                                        finalData[property][fsyms][tsyms] = {
                                            "CHANGE24HOUR" : tsymsObj[tsyms]["CHANGE24HOUR"],
                                            "CHANGEPCT24HOUR" : tsymsObj[tsyms]["CHANGEPCT24HOUR"],
                                            "OPEN24HOUR": tsymsObj[tsyms]["OPEN24HOUR"],
                                            "VOLUME24HOUR": tsymsObj[tsyms]["VOLUME24HOUR"],
                                            "VOLUME24HOURTO": tsymsObj[tsyms]["VOLUME24HOURTO"],
                                            "LOW24HOUR": tsymsObj[tsyms]["LOW24HOUR"],
                                            "HIGH24HOUR": tsymsObj[tsyms]["HIGH24HOUR"],
                                            "PRICE": tsymsObj[tsyms]["PRICE"],
                                            "LASTUPDATE": tsymsObj[tsyms]["LASTUPDATE"],
                                            "SUPPLY": tsymsObj[tsyms]["SUPPLY"],
                                            "MKTCAP": tsymsObj[tsyms]["MKTCAP"],
                                        };
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }
        return finalData;
}

//Insert data into postgres
const insertRec = (objectToSave) => {
    return new Promise((resolve, reject) => {
        models.cryptocompare.create(objectToSave)
        .then((data) => {
            resolve(data);
        })
        .catch((error) => {
            console.log('errr', error);
            resolve(false);
        });
    })
}

/* Cron to update order status */
cron.schedule('*/'+CRONTIME+' * * * *', async() => {
    await cryptoSync();
    console.log(`running a task ${CRONTIME} minute`);
});
/* End of cron */

module.exports = app;