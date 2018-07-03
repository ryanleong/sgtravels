const _ = require('lodash');

class Telegram {

    generateInlineKeyboard(options) {
        const inline_keyboard = _.map(options, (carpark) => {
            return [{
                text: carpark.Development,
                callback_data: carpark.CarParkID
            }]
        });
    
        return {
            inline_keyboard: inline_keyboard
        }
    }
}

module.exports = Telegram;
