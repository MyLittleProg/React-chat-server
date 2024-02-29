const ApiError = require('../exceptions/api-error')
const MessageService = require('../service/message-service')
const {validationResult} = require('express-validator')

class MessageController{
    async messageSend(req,res,next){
        try{
            const errors = validationResult(req)
            if(!errors.isEmpty()){
                return next(ApiError.BadRequest('Ошибка при валидации', errors.array()))
            }
            const{channel,author,message,date,time} = req.body

           
            const messageData = await MessageService.messageSendServer(channel,author,message,date,time)

            return res.json(messageData)
        }catch(e){
            next(e)
        }
    }
    async messageGet(req,res,next){
        try{
            const errors = validationResult(req)
            if(!errors.isEmpty()){
                return next(ApiError.BadRequest('Ошибка при валидации', errors.array()))
            }

            const channel = req.headers.id
            
            const result = await MessageService.messageGetServer(channel)
           
            return res.json(result)
        }catch(e){
            next(e)
        }
    }

}

module.exports = new MessageController()