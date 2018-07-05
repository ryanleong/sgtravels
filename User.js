// Possible states
const states = {
    DEFAULT: 'DEFAULT',
    CARPARK_REQUESTING_TERM: 'CARPARK_REQUESTING_TERM',
    CARPARK_PICKING_RESULT: 'CARPARK_PICKING_RESULT',
    BUS_REQUESTIN_TERM: 'CARPARK_REQUESTING_TERM',
};

class User {
    constructor(id) {
        this.userId = id;
        this.lastAccessed = new Date();
        this.state = states.DEFAULT;
    }

    getId() {
        return this.userId;
    }

    getPossibleStates() {
        return states;
    }

    getState() {
        return this.state;
    }

    setState(state) {
        this.state = state;
    }

    getLastAccess() {
        return this.lastAccessed;
    }

    setLastAccessed() {
        this.lastAccessed = new Date();
        // this.lastAccessed = new Date(2018, 6, 5, 17, 30, 0, 0);
    }

    isTooOld() {
        const difference = new Date() - this.lastAccessed;
        const diffInMins = Math.round(((difference % 86400000) % 3600000) / 60000);

        if (diffInMins > 10) {
            return true;
        }
        else {
            return false;
        }
    }
}

module.exports = User;
