const { Channel } = require("../models/channelModels");
const customLogger = require("../config/customLogger");

const registerChannel = async (data, ctx) => {
    try {
        console.log(data);
        const { channel_id} = data;

        let exist_channel = await Channel.findOne({ channel_id }).exec();

        if (!exist_channel) {
            await Channel.create(data )
        } else {
            let _id = exist_channel._id;
            await Channel.findByIdAndUpdate(_id, data);
        }

    } catch (error) {
        customLogger.log({
            level: 'error',
            message: error
        });
    }
}


const removeChannel = async (data, ctx) => {
    try {
        let { channel_id } = data;
        let exist_channel = await Channel.findOne({ channel_id }).exec();

        if (exist_channel) {
            let _id = exist_channel._id;
            await Channel.findOneAndRemove(_id);
        } else {
            console.log("Channel not found for deleteing --->")
        }
    } catch (error) {
        customLogger.log({
            level: 'error',
            message: error
        });
    }

}




module.exports = { registerChannel, removeChannel }