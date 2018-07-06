const logger = require('heroku-logger');

const Carparks = require('./Carparks');
const Bus = require('./Bus');
const Train = require('./Train');
const Telegram = require('./Telegram');

const Users = require('./Users');

class Messages {

    constructor() {
        this.carparkHandler = new Carparks();
        this.busHandler = new Bus();
        this.trainHandler = new Train();
        this.telegramHandler = new Telegram();

        this.userHandler = new Users();
    }

    commandHelp(chat_id) {

        const helpText = `
Welcome to the SG Travels Bot

Commands:
/busstop - Get arrival timings based on bus stop ID
/carpark - Search for carpark at location
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

        // Set state
        this.userHandler.updateUser(chat_id, 'CARPARK_REQUESTING_TERM');

        this.telegramHandler.send({
            chat_id: chat_id,
            text: 'Please enter a location for search.',
        });
    }

    handleCarparkSearch(message) {
        const chat_id = message.chat.id;
        const term = message.text;

        const carparkResultList = this.carparkHandler.search(term);

        // If no results
        if (carparkResultList.length < 1) {
            // Set state
            this.userHandler.updateUser(chat_id, 'CARPARK_REQUESTING_TERM');

            this.telegramHandler.send({
                chat_id: chat_id,
                text: 'There are no carpark locations with this name.\nPlease enter another location.',
            });

            return;
        }

        const keyboard = this.telegramHandler.generateInlineKeyboard(carparkResultList);

        this.telegramHandler.send({
            chat_id: chat_id,
            text: 'Select one of the options.',
            reply_markup: keyboard
        });
    }

    commandBusstop(message) {
        const chat_id = message.chat.id;

        // Set state
        this.userHandler.updateUser(chat_id, 'BUS_REQUESTING_TERM');

        this.telegramHandler.send({
            chat_id: chat_id,
            text: 'Please enter a bus stop ID.',
        });
    }

    handleBusStopSearchResponse(message) {
        const chat_id = message.chat.id;
        const stopId = message.text;

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

        // Reset user state to defult
        this.userHandler.updateUser(chat_id);
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
                    this.commandBusstop(message);
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

    handleCallbackQuery(callback) {
        const chat_id = callback.message.chat.id;
        const callbackData = callback.data.split('-');

        // Carpark callback
        if (callbackData[0] == 'carparkReq') {
            const id = callbackData[1];
            const carpark = this.carparkHandler.getById(id)[0];
            const carparkReply = `Carpark: ${carpark.Development}\nAvailable lots: ${carpark.AvailableLots}`;
    
            this.telegramHandler.send({
                chat_id: chat_id,
                text: carparkReply
            });

            // Reset user state to defult
            this.userHandler.updateUser(chat_id);
        }

    }

    onReceive(req) {

        // If bot command
        if (req.body.message && req.body.message.entities) {

            // Reset user state to defult when new command
            this.userHandler.updateUser(req.body.message.chat.id);

            this.handleBotCommand(req.body.message);
        }

        // If callback query from inline keyboard
        else if(req.body.callback_query) {
            this.handleCallbackQuery(req.body.callback_query);
        }

        // If standard message
        else {

            const currentUser = this.userHandler.getUser(req.body.message.chat.id);
            if (currentUser === undefined) {
                // Create/Update user to keep track of state
                this.userHandler.updateUser(req.body.message.chat.id);
            }

            switch (currentUser.getState()) {
                case 'CARPARK_REQUESTING_TERM':
                    this.handleCarparkSearch(req.body.message);
                    break;
            
                case 'BUS_REQUESTING_TERM':
                    this.handleBusStopSearchResponse(req.body.message);
                    break;
            
                default:
                    this.commandHelp(req.body.message.chat.id);
                    break;
            }
        }

    }
}

module.exports = Messages;
