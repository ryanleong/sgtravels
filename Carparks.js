const _ = require('lodash');

class Carparks {
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
}

module.exports = Carparks;
