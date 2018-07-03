const axios = require('axios');
const logger = require('heroku-logger');

const Carparks = require('./Carparks');
const Telegram = require('./Telegram');

class Messages {

    constructor() {
        this.carparkHandler = new Carparks();
        this.telegramHandler = new Telegram();
    }

    send(data) {
        axios.post(`${TELEGRAM_BOT_URL}/sendMessage`, data)
            .then((res) => {
                logger.info('Message sent', {
                    message: data.text,
                });            
            });
    }

    commandHelp(chat_id) {

        const helpText = `
Welcome to the SG Travels Bot

Commands:
/carpark <location> - Search for carpark at location
/help - Brings up this menu
        `;

        this.send({
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

        this.send({
            chat_id: chat_id,
            text: 'Select one of the options.',
            reply_markup: keyboard
        });
    }

    handleBotCommand(message) {
        const messageText = message.text;

        if (message.entities[0].type == 'bot_command') {

            const command = messageText.split(" ")[0];

            switch(command) {
                case '/start':
                case '/help':
                    this.commandHelp(message.chat.id);
                    break;

                case '/carpark':
                    this.commandCarpark(message);
                    break;
            }
        }
    }

    handleMessage(message) {
        this.commandHelp(message.chat.id);

        // const chat_id = message.chat.id;
        // const message_id = message.message_id;

        // logger.info('message_id', { message_id: message_id });
    
        // this.send({
        //     chat_id: chat_id,
        //     text: `Received your text: ${message.text}`
        // });
    }

    handleCallbackQuery(callback) {
        const chat_id = callback.message.chat.id;
        const id = callback.data;

        const carpark = this.carparkHandler.getById(id)[0];
        const carparkReply = `Carpark: ${carpark.Development}\nAvailable lots: ${carpark.AvailableLots}`;

        this.send({
            chat_id: chat_id,
            text: carparkReply
        });
    }
}

module.exports = Messages;
