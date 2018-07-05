const Lta = require('./Lta');
const config = require('config');

class Train extends Lta {
    constructor() {
        super();

        this.API_URL = this.LTA_API_URL + config.get('lta.LTA_TRAIN_API_EXT');
    }

    getServiceAlerts(returnHandler) {
        this.getData(this.API_URL, (response) => {
            returnHandler(response.data);
        });
    }
}

module.exports = Train;
