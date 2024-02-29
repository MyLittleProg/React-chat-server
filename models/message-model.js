const { ObjectId } = require("mongodb");
const {Schema,model} = require("mongoose");

const MessageSchema = new Schema({
    channel_id: ObjectId,
    author:{type:String},
    message:{type:String},
    date:{type:String},
    time:{type:String}
})

module.exports = model('Message',MessageSchema)