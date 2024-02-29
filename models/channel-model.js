const {Schema,model} = require("mongoose");

const ChannelSchema = new Schema({
    title:{type:String,unique:true, required:true},
    users:{type:Array, required:true}
})

module.exports = model('Channel',ChannelSchema)