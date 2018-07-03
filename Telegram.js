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

    generateBusReturnText(services) {
        let messageStr = '';

        _.forEach(services, (bus) => {
            let dateStr = bus.NextBus.EstimatedArrival.split('+');
            const difference = Math.abs(new Date(dateStr[0]) - new Date());
            const diffInMins = Math.round(((difference % 86400000) % 3600000) / 60000);

            messageStr += `Bus ${bus.ServiceNo} :     ${diffInMins} mins\n`;
        });

        return messageStr;
    }
}

module.exports = Telegram;
