const Lta = require('./Lta');

class Bus extends Lta {
    constructor() {
        super();

        this.API_URL = this.LTA_API_URL + this.BUS_API_EXT;
    }

    getArrivalTimings(stopId, messageHandler) {
        const url = `${this.API_URL}?BusStopCode=${stopId}`;

        this.getData(url, (response) => {
            // console.log(response.data);
            messageHandler(response.data);
        });
    }
}

module.exports = Bus;
