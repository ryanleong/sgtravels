const axios = require('axios');
const express = require('express');
const _ = require('lodash');

const app = express();
const PORT = process.env.PORT;

const API_URL = 'http://datamall2.mytransport.sg/ltaodataservice/CarParkAvailabilityv2';
const AXIOS_HEADERS = {
    headers: {
        AccountKey: 'aku7DxAUSsiZYiHHTeAF6A==',
        accept: 'application/json'
    }
};

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

app.get('/', (req, res) => {
    res.send('Welcome to SG Travels API.');
});

app.get('/parking', (req, res) => {
    axios.get(API_URL, AXIOS_HEADERS)
        .then(response => {
            // console.log(response.data.value[0]);
            parkingData = response.data.value;
            res.send('Parking Data updated!');
        }
    );
});


// Search for parking location
app.get('/parking/:location', (req, res) => {
    const searchLocation = req.params.location.toLowerCase();
    
    const result = _.filter(parkingData, (location) => {
        const currentLocation = location.Development.toLowerCase();

        if (_.includes(currentLocation, searchLocation)) {
            return location;
        }
    });

    res.send(result);
});

// Get parking by id
app.get('/parking/id/:id', (req, res) => {
    const id = req.params.id.toLowerCase();

    const result = _.filter(parkingData, (location) => {
        return id == location.CarParkID.toLocaleLowerCase();
    });

    res.send(result);
});


app.listen(PORT, () => console.log('Listening on port 3000!'));

