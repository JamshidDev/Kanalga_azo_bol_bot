const mongoose = require("mongoose");

const groupSchema = mongoose.Schema({
    group_id:{
        type:Number,
        required:true,
        unique:true,
    },
    group_name:String,
    group_username:String,
    connective_user_id:{
        type:Number,
        required:true,
        unique:true,
    },
    active_group:{
        type:Boolean,
        default:false,
    }
})

const Group = mongoose.model("Group", groupSchema);

module.exports = {Group}