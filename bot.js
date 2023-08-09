const { Bot, MemorySessionStorage } = require("grammy");
const { chatMembers } = require("@grammyjs/chat-members");
const DB = require("./db");

require('dotenv').config()


const adapter = new MemorySessionStorage();

const  BOT_TOKEN = process.env.TOKEN;
const HISTORY_BOT_CHAT_ID = process.env.HISTORY_BOT_CHAT_ID;









const bot = new Bot(BOT_TOKEN);


bot.use(chatMembers(adapter));



// General function
const history_msg_template = async ( ctx,msg_status, msg)=>{
    let message = `${msg_status == 'success'? '✅ ' : '⚠️ ' } <b>NOTEFICATION</b> \n\n`
    +"🕹  <b>Action type</b>: " +ctx.update.my_chat_member.chat.type
    +"\n📑 <b>Name</b>: " +`<a href='https://t.me/${ctx.update.my_chat_member.chat.username}' >${ctx.update.my_chat_member.chat.title}</a>`
    +"\n🕹 <b>Username</b>: @" +ctx.update.my_chat_member.chat.username
    +"\n🆔 <b>Id</b>: " +ctx.update.my_chat_member.chat.id
    +"\n <b>Status</b>: " +ctx.update.my_chat_member.new_chat_member.status

    +"\n\n<b>Connective user</b> "
    +"\n👨‍💼 <b>Firstname</b>: " +ctx.update.my_chat_member.from.first_name
    +"\n🪪 <b>Id</b>: " +ctx.update.my_chat_member.from.id
    +"\n🕹 <b>Username</b>: @" +ctx.update.my_chat_member.from.username
    +"\n\n💬 <b>Message</b>: " +`<i>${msg}</i>`;

    await bot.api.sendMessage(HISTORY_BOT_CHAT_ID, message, {
        parse_mode:"HTML"
    })
}




bot.on("my_chat_member", async (ctx) => {
    

    let type = ctx.update.my_chat_member.chat.type;
    let status = ctx.update.my_chat_member.new_chat_member.status;


    if (type == 'channel') {

    } else if (type == 'group' || type == "supergroup") {

        let group_id = ctx.update.my_chat_member.chat.id;
        let group_name = ctx.update.my_chat_member.chat.title;
        let group_username = ctx.update.my_chat_member.chat.username;
        let connective_user_id = ctx.update.my_chat_member.from.id;

        let new_chat_member = ctx.update.my_chat_member.new_chat_member;

        console.log(new_chat_member);

        let data = {
            group_id,
            group_name,
            group_username,
            connective_user_id,
        }
        if (status == 'administrator' && new_chat_member.can_delete_messages) {
           data.active_group = true;
           history_msg_template(ctx,'success', "The bot was assigned to the admin of the group")
           
        }else{
            data.active_group = false;
            history_msg_template(ctx, 'faild', "The bot has been removed from the group admin or the required permissions have not been granted")
        }

        





    }else if (type == 'private'){

    }


})
























bot.start({
    // Make sure to specify the desired update types
    allowed_updates: ["my_chat_member", "chat_member", "message"],
});