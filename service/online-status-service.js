const onlineStatusModel = require("../models/online-status-model");



class MessageService{
    async sendStatus(nickname,status){
        const candidate = await onlineStatusModel.findOne({nickname:nickname})
        if(candidate){
            const condition = { nickname:nickname }
            const update =  { $set: { status: status }}
            await onlineStatusModel.updateOne(condition, update)
        }else{
            await onlineStatusModel.create({nickname,status})
        }
    }
    async getStatus(){

        const result = await onlineStatusModel.find({status:'online'})
        if(result){
            const resultData = result.map(elem=> elem.nickname)
            return resultData
        }
        
    }
}

module.exports = new MessageService();