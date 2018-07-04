const Lta = require('./Lta');

class Train extends Lta {
    constructor() {
        super();

        this.API_URL = this.LTA_API_URL + this.TRAIN_API_EXT;
    }

    getServiceAlerts(returnHandler) {
        this.getData(this.API_URL, (response) => {
            returnHandler(response.data);
        });
    }
}

module.exports = Train;
