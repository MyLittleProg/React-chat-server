const ApiError = require('../exceptions/api-error')
const messageModel = require('../models/message-model')
const mongoose = require('mongoose');
class MessageService{
    async messageSendServer(channel,author,message,date,time){
        if(author === '' || message === '' || time === '' || date === '' || channel === ''){
            throw ApiError.BadRequest('Не введены некторые данные')
        }
        const newMessageId = new mongoose.Types.ObjectId();
        const message_server = {
            channel_id: channel,
            author: author,
            message: message,
            date: date,
            time: time,
            _id: newMessageId
            };

        await messageModel.create(message_server)
    }
    async messageGetServer(channel){
        const result = await messageModel.find({channel_id:channel})
        return result
    }
}

module.exports = new MessageService();