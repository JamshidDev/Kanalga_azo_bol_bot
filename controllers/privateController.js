const { Group } = require("../models/groupModels");
const { Channel } = require("../models/channelModels");
const customLogger = require("../config/customLogger")

const myGroupList = async (user_id, ctx) => {
    try {

        let group_list =  await Group.find({connective_user_id: user_id, active_group:true}).exec();
        return group_list;

    } catch (error) {
        customLogger.log({
            level: 'error',
            message: error
        });
        return []
    }
}

const searchChannel = async (username, ctx)=>{
    try{
        let channel_username = username.split("@").join('');
        console.log(channel_username);
        let channel = await Channel.find({channel_username, active_channel:true}).exec();
        return channel;
    }catch(error){
        customLogger.log({
            level: 'error',
            message: error
        });
    
    }
}



module.exports = {
    myGroupList,
    searchChannel
}