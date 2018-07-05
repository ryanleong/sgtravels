const logger = require('heroku-logger');
const _ = require('lodash');
const axios = require('axios');
const config = require('config');

const TELEGRAM_BOT_URL = `${config.get('telegram.TELEGRAM_API_URL')}${process.env.TELEGRAM_API_KEY}`;

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
                callback_data: `carparkReq-${carpark.CarParkID}`
            }]
        });
    
        return {
            inline_keyboard: inline_keyboard
        }
    }

    generateBusReturnText(services) {
        let messageStr = '';

        _.forEach(services, (bus) => {
            const currentTime = new Date();
            
            // Arrival time as string
            let dateStr = bus.NextBus.EstimatedArrival.split('+');

            // Get time left
            let difference = new Date(dateStr[0]) - currentTime;

            // Check if time has passed
            if (difference < 0) {
                // Get next next bus
                dateStr = bus.NextBus2.EstimatedArrival.split('+');

                // Get time left
                difference = new Date(dateStr[0]) - currentTime;
            }

            // Time left in minutes
            const diffInMins = Math.round(((difference % 86400000) % 3600000) / 60000);

            messageStr += `Bus ${bus.ServiceNo} :     ${diffInMins} mins\n`;
        });

        return messageStr;
    }

    generateTranServiceAlerts(data) {
        const status = data.Status;
        const affectedSegments = data.AffectedSegments;
        const messages = data.Message;
        let returnMessage = 'There are currently no train faults';

        // No Faults
        if (status == 1) {
              // Step 0: No faults
            if (affectedSegments.length == 0) {
                console.log("Step 0");
            }
            
            // Step 5: Resolved faults
            else if (!this.hasAffectedTrainStationSegments(affectedSegments)) {
                console.log("Step 5");
                returnMessage = 'All previous faults has been resolved.' + returnMessage;
            }
        }

        // Has faults
        else if (status == 2) {
            
            // Step 2 - 4: Display fault messages
            if (messages.length > 0) {
                returnMessage = '';

                _.forEach(messages, (message, index) => {
                    returnMessage += `${message.Content}\n\n`;
                });
            }
        }

        return returnMessage;
    }

    hasAffectedTrainStationSegments(segmentData) {
        const affected = _.find(segmentData, (segment) => {
            return segment.Stations != "";
        })

        return affected === undefined ? false: true;
    }
}

module.exports = Telegram;
