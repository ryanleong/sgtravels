const axios = require('axios');
const config = require('config');

class Lta {

    constructor() {
        // API
        this.LTA_API_URL = config.get('lta.LTA_API_URL');

        // Axios headers
        this.AXIOS_HEADERS = {
            headers: {
                AccountKey: process.env.LTA_API_KEY,
                accept: 'application/json'
            }
        };
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
