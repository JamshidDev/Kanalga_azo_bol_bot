const mongoose = require('mongoose');


const channelSchema = mongoose.Schema({
    channel_id: {
        type: Number,
        required: true,
        unique: true,
    },
    channel_name: String,
    channel_username: String,
    connective_user_id: {
        type: Number,
        required: true,
    },
    active_channel:{
        type:Boolean,
        default:false,
    }

});


const Channel  = mongoose.model('Channel', channelSchema);
module.exports = {Channel};