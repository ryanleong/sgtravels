const axios = require('axios');
const express = require('express');
const bodyParser = require('body-parser');
const _ = require('lodash');
const logger = require('heroku-logger');

// ExpressJS
const PORT = process.env.PORT || 3000;
const webhookURL = '/iZYiHHTeAFku7DxAUSsiZ';
const app = express();

app.use(bodyParser.json()); // support json encoded bodies
app.use(bodyParser.urlencoded({ extended: true })); // support encoded bodies

// AXIO 
const API_URL = 'http://datamall2.mytransport.sg/ltaodataservice/CarParkAvailabilityv2';
const AXIOS_HEADERS = {
    headers: {
        AccountKey: 'aku7DxAUSsiZYiHHTeAF6A==',
        accept: 'application/json'
    }
};

// Telegram
const TELEGRAM_BOT_URL = 'https://api.telegram.org/bot551711816:AAEju_7ufObPEdr8P0vvM4FCIWmD1YW-Smo';

// Sample data
let parkingData = [
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



const sendMessage = (chat_id, message) => {
    const msg = message;

    axios.post(`${TELEGRAM_BOT_URL}/sendMessage`, {
        chat_id: chat_id,
        text: msg
    })
        .then((res) => {
            logger.info('Message sent', {
                message: msg,
            });            
        });
};

const getParkingById = (id) => {
    const result = _.filter(parkingData, (location) => {
        return id == location.CarParkID;
    });

    return result;
}

// webhook for telegram
app.post(webhookURL, (req, res) => {
    // logger.info('POST params', req.body);
    logger.info('Body', req.body);


    if(req.body.message) {
        const chat_id = req.body.message.chat.id;
        const messsage = req.body.message.text;
        const message_id = req.body.message.message_id;
    
        logger.info('message_id', { message_id: message_id });
    
        sendMessage(chat_id, `Received your text: ${messsage}`);
    }

    else if(req.body.callback_query) {
        const chat_id = req.body.callback_query.message.chat.id;
        const id = req.body.callback_query.data;

        const carpark = getParkingById(1)[0];
        const carparkReply = `Carpark: ${carpark.Development}\nAvailable lots: ${carpark.AvailableLots}`;

        sendMessage(chat_id, carparkReply);
    }


    
    res.send('SG Travels Bot');    
});


app.get('/', (req, res) => {

    // const replyKeyboardMakeup = {
    //     keyboard: [
    //         [ "Top Left", "Top Right" ],
    //         [ "Bottom Left", "Bottom Right" ]
    //     ],
    // }

    // const inlineKeyboardMakeup = {
    //     inline_keyboard: [
    //         [
    //             { text: "Suntec City", callback_data: 1 },
    //         ],
    //         [
    //             { text: "Marina Square", callback_data: 2 }
    //         ]
    //     ],
    // }

    // axios.post(`${TELEGRAM_BOT_URL}/sendMessage`, {
    //     chat_id: 333995996,
    //     text: 'working with you',
    //     reply_markup: inlineKeyboardMakeup
    // })
    //     .then((res) => {
    //         console.log(res.data);
    //     });

    // res.send('Welcome to SG Travels API.');





    // const carpark = getParkingById(1)[0];
    // const carparkReply = `Carpark: ${carpark.Development}\nAvailable lots: ${carpark.AvailableLots}`;

    // res.send(carparkReply);

    // axios.post(`${TELEGRAM_BOT_URL}/sendMessage`, {
    //     chat_id: 333995996,
    //     text: carparkReply,
    // })
    //     .then((res) => {
    //         console.log(res.data);
    //     });



});


// app.get('/parking', (req, res) => {
//     axios.get(API_URL, AXIOS_HEADERS)
//         .then(response => {
//             // console.log(response.data.value[0]);
//             parkingData = response.data.value;
//             res.send('Parking Data updated!');
//         }
//     );
// });


// // Search for parking location
// app.get('/parking/:location', (req, res) => {
//     const searchLocation = req.params.location.toLowerCase();
    
//     const result = _.filter(parkingData, (location) => {
//         const currentLocation = location.Development.toLowerCase();

//         if (_.includes(currentLocation, searchLocation)) {
//             return location;
//         }
//     });

//     res.send(result);
// });

// // Get parking by id
// app.get('/parking/id/:id', (req, res) => {
//     const id = req.params.id.toLowerCase();

//     const result = _.filter(parkingData, (location) => {
//         return id == location.CarParkID.toLocaleLowerCase();
//     });

//     res.send(result);
// });


app.listen(PORT, () => console.log(`Listening on port ${PORT}...`));

