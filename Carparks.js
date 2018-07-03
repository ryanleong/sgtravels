const _ = require('lodash');
const axios = require('axios');

// API
const API_URL = 'http://datamall2.mytransport.sg/ltaodataservice/CarParkAvailabilityv2';
const AXIOS_HEADERS = {
    headers: {
        AccountKey: 'aku7DxAUSsiZYiHHTeAF6A==',
        accept: 'application/json'
    }
};

// Parking Data
let PARKING_DATA = [];


class Carparks {
    constructor() {
        this.updateData();
    }

    search(term) {
        const searchLocation = term.toLowerCase();
        
        const result = _.filter(PARKING_DATA, (location) => {
            const currentLocation = location.Development.toLowerCase();
    
            if (_.includes(currentLocation, searchLocation)) {
                return location;
            }
        });
    
        return result;
    }

    getById(id) {
        const result = _.filter(PARKING_DATA, (location) => {
            return id == location.CarParkID;
        });
    
        return result;
    }

    updateData() {
        axios.get(API_URL, AXIOS_HEADERS)
            .then(response => {
                PARKING_DATA = response.data.value;
                console.log('updated');
            }
        );

        setTimeout(() => {
            this.updateData();
        }, 900000);
    }


}

module.exports = Carparks;
