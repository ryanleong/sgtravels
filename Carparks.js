const _ = require('lodash');

const Lta = require('./Lta');

// Parking Data
let PARKING_DATA = [];

class Carparks extends Lta {
    constructor() {
        super();

        this.API_URL = this.LTA_API_URL + this.CARPARK_API_EXT;

        this.getData(this.API_URL, this.updateCallback, 900000);
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

    updateCallback(response) {
        PARKING_DATA = response.data.value;
    }

}

module.exports = Carparks;
