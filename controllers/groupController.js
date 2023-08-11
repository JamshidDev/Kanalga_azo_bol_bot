const { Group } = require("../models/groupModels");
const {Relation} = require("../models/relationChannelGroup");

const customLogger = require("../config/customLogger")


const registerGroup = async (data, ctx) => {
    try {
        const { group_id } = data;

        let exist_group = await Group.findOne({ group_id }).exec();

        if (!exist_group) {
            await Group.create(data)
        } else {
            let _id = exist_group._id;
            await Group.findByIdAndUpdate(_id, data);
        }
    } catch (error) {
        customLogger.log({
            level: 'error',
            message: error
        });
    }


}

const removeGroup = async (data, ctx) => {
    try {
        const { group_id } = data;
        let exist_group = await Group.findOne({ group_id }).exec();
        if (exist_group) {
            let _id = exist_group._id;
            await Group.findOneAndRemove(_id);
        } else {
            console.log("Groupt not found for deleteing --->")
        }
        await Relation.deleteMany({group_id });

        
    } catch (error) {
        customLogger.log({
            level: 'error',
            message: error
        });
    }
}

module.exports = { registerGroup, removeGroup }