const {Schema,model} = require("mongoose");

const OnlineSchema = new Schema({
    nickname:{type:String,requred:true},
    status:{type:String,requred:true}
})

module.exports = model('Online',OnlineSchema)