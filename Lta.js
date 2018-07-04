const axios = require('axios');

const LTA_API_URL = 'http://datamall2.mytransport.sg/ltaodataservice';
const CARPARK_API_EXT = '/CarParkAvailabilityv2';
const BUS_API_EXT = '/BusArrivalv2';
const TRAIN_API_EXT = '/TrainServiceAlerts';

const AXIOS_HEADERS = {
    headers: {
        AccountKey: 'aku7DxAUSsiZYiHHTeAF6A==',
        accept: 'application/json'
    }
};


class Lta {

    constructor() {
        // API
        this.LTA_API_URL = LTA_API_URL;
        this.CARPARK_API_EXT = CARPARK_API_EXT;
        this.BUS_API_EXT = BUS_API_EXT;
        this.TRAIN_API_EXT = TRAIN_API_EXT;

        // Axios headers
        this.AXIOS_HEADERS = AXIOS_HEADERS;
    }

    getData(url, callback, recurringInterval = -1) {
        axios.get(url, this.AXIOS_HEADERS)
            .then(response => {
                callback(response);
            });

        if (recurringInterval > 0 ) {
            setTimeout(() => {
                this.updateData(url, callback, true);
            }, recurringInterval);
        }
    }

}

module.exports = Lta;
