const mongoose = require('mongoose');

const relationChannelGroupSchema = mongoose.Schema({
    group:{
        type:mongoose.Schema.ObjectId,
        ref:"Group"
    },
    channel:{
        type:mongoose.Schema.ObjectId,
        ref:"Channel"
    },
    creator:{
        type:Number,
        required:true,
    },
    group_id:{
        type:Number,
        required:true,
    },
    channel_id:{
        type:Number,
        required:true,
    },
    active_relation:{
        type:Boolean,
        default:true
    }

})


const Relation = mongoose.model('Relation', relationChannelGroupSchema);
module.exports = {Relation}