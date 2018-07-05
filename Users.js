const _ = require('lodash');

const User = require('./User');

class Users {

    constructor() {
        this.userList = {};
    }

    createUser(id) {
        const user = new User(id);
        this.userList[id] = user;
        return user;
    }

    getUser(id) {
        return this.userList[id];
    }

    updateUser(id, state = 'DEFAULT') {
        // If in userList object
        if (id in this.userList) {
            // Update lastAccessed
            this.userList[id].setLastAccessed();
        }

        // If not in userList object
        else {
            // Create new user
            this.createUser(id);
        }

        // Update state
        this.userList[id].setState(state);
    }

    cleanUpUserList() {

        _.forEach(this.userList, (user) => {
            if (user.isTooOld()) {
                delete this.userList[user.getId()];
            }
        });

    }
}

module.exports = Users;
