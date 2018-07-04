const logger = require('heroku-logger');

const Carparks = require('./Carparks');
const Bus = require('./Bus');
const Train = require('./Train');
const Telegram = require('./Telegram');

class Messages {

    constructor() {
        this.carparkHandler = new Carparks();
        this.busHandler = new Bus();
        this.trainHandler = new Train();
        this.telegramHandler = new Telegram();
    }

    commandHelp(chat_id) {

        const helpText = `
Welcome to the SG Travels Bot

Commands:
/busstop <bus_stop_id> - Get arrival timings based on bus stop ID
/carpark <location> - Search for carpark at location
/train - Check if there are train faults
/help - Display help menu
        `;

        this.telegramHandler.send({
            chat_id: chat_id,
            text: helpText
        });
    }

    commandCarpark(message) {
        const chat_id = message.chat.id;
        const term = message.text.substr(message.text.indexOf(" ") + 1);

        // Check if search has no term
        if (message.text.split(" ").length == 1) {
            this.commandHelp(chat_id);
            return;
        }

        logger.info('Search Term', { term: term });

        const carparkResultList = this.carparkHandler.search(term);
        const keyboard = this.telegramHandler.generateInlineKeyboard(carparkResultList);

        this.telegramHandler.send({
            chat_id: chat_id,
            text: 'Select one of the options.',
            reply_markup: keyboard
        });
    }

    commandBus(message) {
        const chat_id = message.chat.id;
        const stopId = message.text.substr(message.text.indexOf(" ") + 1);

        // Check if search has no term
        if (message.text.split(" ").length == 1) {
            this.commandHelp(chat_id);
            return;
        }

        this.busHandler.getArrivalTimings(stopId, (data) => {

            if (data.Services) {

                const messageStr = this.telegramHandler.generateBusReturnText(data.Services);

                this.telegramHandler.send({
                    chat_id: chat_id,
                    text: messageStr,
                });
            }
            else {
                this.telegramHandler.send({
                    chat_id: chat_id,
                    text: 'There are no buses running.',
                });
            }
        });
    }

    commandTrain(message) {
        const chat_id = message.chat.id;

        this.trainHandler.getServiceAlerts((data) => {
            const alert = this.telegramHandler.generateTranServiceAlerts(data.value);

            this.telegramHandler.send({
                chat_id: chat_id,
                text: alert,
            });
        });
    }

    handleBotCommand(message) {
        const messageText = message.text;

        if (message.entities[0].type == 'bot_command') {

            const command = messageText.split(" ")[0];

            switch(command) {
                
                case '/carpark':
                    this.commandCarpark(message);
                    break;
                
                case '/busstop':
                    this.commandBus(message);
                    break;

                case '/train':
                    this.commandTrain(message);
                    break;
                    
                default:
                    this.commandHelp(message.chat.id);
                    break;
            }
        }
    }

    handleMessage(message) {
        this.commandHelp(message.chat.id);

        // const chat_id = message.chat.id;
        // const message_id = message.message_id;

        // logger.info('message_id', { message_id: message_id });
    
        // this.telegramHandler.send({
        //     chat_id: chat_id,
        //     text: `Received your text: ${message.text}`
        // });
    }

    handleCallbackQuery(callback) {
        const chat_id = callback.message.chat.id;
        const id = callback.data;

        const carpark = this.carparkHandler.getById(id)[0];
        const carparkReply = `Carpark: ${carpark.Development}\nAvailable lots: ${carpark.AvailableLots}`;

        this.telegramHandler.send({
            chat_id: chat_id,
            text: carparkReply
        });
    }
}

module.exports = Messages;
