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

// Allow POST data
app.use(bodyParser.json()); // support json encoded bodies
app.use(bodyParser.urlencoded({ extended: true })); // support encoded bodies


// webhook for telegram
app.post(webhookURL, (req, res) => {
    logger.info('Body', req.body);

    if(req.body.message) {
        // If Bot Command
        if (req.body.message.entities) {
            messageHandler.handleBotCommand(req.body.message);
        }

        // If standard message
        else {
            messageHandler.handleMessage(req.body.message);
        }
    }

    // If callback query from inline keyboard
    else if(req.body.callback_query) {
        messageHandler.handleCallbackQuery(req.body.callback_query);
    }
    
    res.send('SG Travels Bot');    
});


app.listen(PORT, () => console.log(`Listening on port ${PORT}...`));




// // test
// const m = {
//     "message_id": 84,
//     "from": {
//         "id": 333995996,
//         "is_bot": false,
//         "first_name": "Ryan",
//         "last_name": "Leong",
//         "username": "ryanleong",
//         "language_code": "en-US"
//     },
//     "chat": {
//         "id": 333995996,
//         "first_name": "Ryan",
//         "last_name": "Leong",
//         "username": "ryanleong",
//         "type": "private"
//     },
//     "date": 1530608485,
//     "text": "/carpark suntec",
//     "entities": [
//         {
//             "offset": 0,
//             "length": 8,
//             "type": "bot_command"
//         }
//     ]
// };
