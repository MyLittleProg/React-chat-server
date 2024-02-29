const ApiError = require('../exceptions/api-error')
const {validationResult} = require('express-validator')
const onlineStatusService = require('../service/online-status-service')

class OnlineStatusController{
    async statusSend(req,res,next){
        try{
            const errors = validationResult(req)
            if(!errors.isEmpty()){
                return next(ApiError.BadRequest('Ошибка при валидации', errors.array()))
            }
            const {nickname,status} = req.body
            
            const resultData = await onlineStatusService.sendStatus(nickname,status)

            return res.json(resultData)
        }catch(e){
            next(e)
        }
    }
    async statusGet(req,res,next){
        try{
            const errors = validationResult(req)
            if(!errors.isEmpty()){
                return next(ApiError.BadRequest('Ошибка при валидации', errors.array()))
            }
            
            
            const resultData = await onlineStatusService.getStatus()

            return res.json(resultData)
        }catch(e){
            next(e)
        }
    }
}

module.exports = new OnlineStatusController()