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

    handleBotCommand(message) {
        const chat_id = message.chat.id;
        const messsageText = message.text;

        if (message.entities[0].type == 'bot_command') {
            const term = messsageText.substr(messsageText.indexOf(" ") + 1);

            logger.info('Search Term', { term: term });

            const carparkResultList = this.carparkHandler.search(term);
            const keyboard = this.telegramHandler.generateInlineKeyboard(carparkResultList);

            this.send({
                chat_id: chat_id,
                text: 'Select one of the options.',
                reply_markup: keyboard
            });
        }
    }

    handleMessage(message) {
        const chat_id = message.chat.id;
        const message_id = message.message_id;

        logger.info('message_id', { message_id: message_id });
    
        this.send({
            chat_id: chat_id,
            text: `Received your text: ${message.text}`
        });
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
