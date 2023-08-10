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
    active_relation:{
        type:Boolean,
        default:true
    }

})


const relationChannelGroup = mongoose.model('RelationChannelGroup', relationChannelGroupSchema);

