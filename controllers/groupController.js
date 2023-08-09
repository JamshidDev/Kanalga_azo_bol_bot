const {Group} = require("../models/groupModels");


const  registerGroup =  async (data, ctx)=>{
    try{
        const  {group_id, group_name, group_username, connective_user_id, active_group } = data;

        let exist_group = await Group.find({group_id});

        if(exist_group.length){
            let group = await Group.create({
                group_id,
                group_name,
                group_username,
                connective_user_id,
                active_group
            })

            console.log(group);

        }else{
            console.log("This group is exist already...");
        }


    }catch(error){
        console.log("Group register error ---> \n" +error);
    }
   

}

module.exports = {registerGroup}