require('dotenv').config();

const config = require('config');
const express = require('express');
const bodyParser = require('body-parser');
const _ = require('lodash');
const logger = require('heroku-logger');

const Messages = require('./Messages');
const messageHandler = new Messages();

// ExpressJS
const PORT = process.env.PORT || 3000;
const webhookURL = config.get('telegram.TELEGRAM_WEBHOOK_EXT');
const app = express();

// Allow POST data
app.use(bodyParser.json()); // support json encoded bodies
app.use(bodyParser.urlencoded({ extended: true })); // support encoded bodies


// webhook for telegram
app.post(webhookURL, (req, res) => {
    logger.info('Body', req.body);

    messageHandler.onReceive(req);
    
    res.send('SG Travels Bot');    
});

app.listen(PORT, () => console.log(`Listening on port ${PORT}...`));
