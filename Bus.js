const Lta = require('./Lta');
const config = require('config');

class Bus extends Lta {
    constructor() {
        super();

        this.API_URL = this.LTA_API_URL + config.get('lta.LTA_BUS_API_EXT');
    }

    getArrivalTimings(stopId, messageHandler) {
        const url = `${this.API_URL}?BusStopCode=${stopId}`;

        this.getData(url, (response) => {
            messageHandler(response.data);
        });
    }
}

module.exports = Bus;
