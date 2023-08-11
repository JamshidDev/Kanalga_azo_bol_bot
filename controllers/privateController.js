const { Group } = require("../models/groupModels");
const { Channel } = require("../models/channelModels");
const {Relation} = require("../models/relationChannelGroup");
const mongoose = require("mongoose");

const customLogger = require("../config/customLogger")

const myGroupList = async (user_id, ctx) => {
    try {

        let group_list = await Group.find({ connective_user_id: user_id, active_group: true }).exec();
        return group_list;

    } catch (error) {
        customLogger.log({
            level: 'error',
            message: error
        });
        return []
    }
}

const searchChannel = async (username, ctx) => {
    try {
        let channel_username = username.split("@").join('');
        let channel = await Channel.find({ channel_username, active_channel: true }).exec();
        return channel;
    } catch (error) {
        customLogger.log({
            level: 'error',
            message: error
        });

    }
}


const relationGroupChannel = async (data, ctx) => {
    try {
        let {group, channel} = data
        let exist_relation = await Relation.findOne({group, channel });
        if(!exist_relation){
            await Relation.create(data);
        }else{
            let _id = exist_relation._id;
            await Relation(_id, data);
        }
        return true
    } catch (error) {
        customLogger.log({
            level: 'error',
            message: error
        });
        return false
    }
}

const removeRelationGroupChannel = async (data, ctx) => {
    try {
        let {_id} = data
        let exist_relation = await Relation.findOne({_id});
        if(!exist_relation){
            await Relation.findOneAndRemove(_id);
        }else{
            console.log("Relation not found for deleting...");
        }
    } catch (error) {
        customLogger.log({
            level: 'error',
            message: error
        });
    }

}

const getRelationList= async (group_id)=>{
    try {
        let groups = await Relation.find({group_id, active_relation:true }).populate('group').populate('channel')
        return groups
    } catch (error) {
        customLogger.log({
            level: 'error',
            message: error
        });
        return []
    }
}





module.exports = {
    myGroupList,
    searchChannel,
    relationGroupChannel,
    removeRelationGroupChannel,
    getRelationList
}