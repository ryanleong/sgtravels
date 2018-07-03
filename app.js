const axios = require('axios');
const express = require('express');
const bodyParser = require('body-parser');
const _ = require('lodash');
const logger = require('heroku-logger');

const Messages = require('./Messages');
const messageHandler = new Messages();

// ExpressJS
const PORT = process.env.PORT || 3000;
const webhookURL = '/iZYiHHTeAFku7DxAUSsiZ';
const app = express();

app.use(bodyParser.json()); // support json encoded bodies
app.use(bodyParser.urlencoded({ extended: true })); // support encoded bodies


// AXIOS
global.API_URL = 'http://datamall2.mytransport.sg/ltaodataservice/CarParkAvailabilityv2';
global.AXIOS_HEADERS = {
    headers: {
        AccountKey: 'aku7DxAUSsiZYiHHTeAF6A==',
        accept: 'application/json'
    }
};

// Telegram
global.TELEGRAM_BOT_URL = 'https://api.telegram.org/bot551711816:AAEju_7ufObPEdr8P0vvM4FCIWmD1YW-Smo';

// Parking data
global.PARKING_DATA = [
    {
        CarParkID: '1',
        Area: 'Marina',
        Development: 'Suntec City',
        Location: '1.29375 103.85718',
        AvailableLots: 965,
        LotType: 'C',
        Agency: 'LTA'
    },
    {
        CarParkID: '2',
        Area: 'Marina',
        Development: 'Marina Square',
        Location: '1.29115 103.85728',
        AvailableLots: 1038,
        LotType: 'C',
        Agency: 'LTA'
    },
    {
        CarParkID: '3',
        Area: 'Marina',
        Development: 'Raffles City',
        Location: '1.29382 103.85319',
        AvailableLots: 293,
        LotType: 'C',
        Agency: 'LTA'
    }
]


// webhook for telegram
app.post(webhookURL, (req, res) => {
    // logger.info('POST params', req.body);
    logger.info('Body', req.body);


    if(req.body.message) {
        if (req.body.message.entities) {
            messageHandler.handleBotCommand(req.body.message);
        }
        else {
            messageHandler.handleMessage(req.body.message);
        }
    }

    else if(req.body.callback_query) {
        messageHandler.handleCallbackQuery(req.body.callback_query);
    }


    
    res.send('SG Travels Bot');    
});


app.get('/', (req, res) => {
    res.send('Welcome to SG Travels API.');
});


app.listen(PORT, () => console.log(`Listening on port ${PORT}...`));

