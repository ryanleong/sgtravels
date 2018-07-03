const logger = require('heroku-logger');
const _ = require('lodash');
const axios = require('axios');

const TELEGRAM_BOT_URL = 'https://api.telegram.org/bot551711816:AAEju_7ufObPEdr8P0vvM4FCIWmD1YW-Smo';

class Telegram {

    send(data) {
        axios.post(`${TELEGRAM_BOT_URL}/sendMessage`, data)
            .then((res) => {
                logger.info('Message sent', {
                    message: 'Sent',
                });            
            }
        );
    }

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
