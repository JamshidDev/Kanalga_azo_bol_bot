const { Bot, MemorySessionStorage, session, Keyboard, InlineKeyboard } = require("grammy");
const { chatMembers } = require("@grammyjs/chat-members");
const {
    conversations,
    createConversation,
} = require("@grammyjs/conversations");
const DB = require("./db");
const customLogger = require("./config/customLogger")

require('dotenv').config()


// controllers services
const { registerGroup, removeGroup } = require("./controllers/groupController");
const { registerChannel, removeChannel } = require("./controllers/channelController");
const { registerUser, removeUser } = require("./controllers/userController");

const { myGroupList, searchChannel } = require("./controllers/privateController");
const { Menu } = require("@grammyjs/menu");


const adapter = new MemorySessionStorage();

const BOT_TOKEN = process.env.TOKEN;
const HISTORY_BOT_CHAT_ID = process.env.HISTORY_BOT_CHAT_ID;









const bot = new Bot(BOT_TOKEN);

bot.use(session({
    type: "multi",
    session_db: {
        initial: () => {
            return {
                user_id: null,
                my_group_list: [],
                selected_group: null,

            }
        },
        storage: new MemorySessionStorage()
    },
    conversation: {},
}));

bot.use(chatMembers(adapter));

bot.use(conversations());
bot.use(createConversation(channelUsernameConversation));

async function channelUsernameConversation(conversation, ctx) {
    ctx = await conversation.wait();
    if (!ctx.message.text.includes('@')) {
        do {
            await ctx.reply("⚠️ Noto'g'ri formatdagi kanal usernamemi kiritildi. \n Quyidagicha kiriting 👇👇  \n\n <b>Masalan: </b> @kanalusername ", {
                parse_mode: "HTML",
            });
            ctx = await conversation.wait();
        } while (!ctx.message.text.includes('@'));
    }
    let resultChannel = await searchChannel(ctx.message.text, ctx);
    let selected_group = ctx.session.session_db.selected_group;
    if (resultChannel.length) {
        if (selected_group) {
            let channel = resultChannel[0]._id;
            let group = selected_group._id;
            let creator = ctx.from.id;
        } else {
            ctx.reply("⚠️ Kutilmagan xatolik! \n <i>Qayta urning iltimos!</i>")
        }
    } else {
        ctx.reply(`⚠️ <b>Kanal topilmadi</b> \n\n<i>👮‍♂️ Siz izlayotgan kanalga bot adminstator qilinmagan yoki noto'g'ri kanal usernamini kiritdingiz. Iltimos tekshirip qayta haratkat qiling!</i>`, {
            parse_mode: "HTML",
        })

    }



}





// General function
const history_msg_template = async (ctx, msg_status, msg) => {
    let message = `${msg_status == 'success' ? '✅ ' : '⚠️ '} <b>NOTEFICATION</b> \n\n`
        + "🕹  <b>Action type</b>: " + ctx.update.my_chat_member.chat.type
        + "\n📑 <b>Name</b>: " + `<a href='https://t.me/${ctx.update.my_chat_member.chat.username}' >${ctx.update.my_chat_member.chat.title}</a>`
        + "\n🕹 <b>Username</b>: @" + ctx.update.my_chat_member.chat.username
        + "\n🆔 <b>Id</b>: " + ctx.update.my_chat_member.chat.id
        + "\n <b>Status</b>: " + ctx.update.my_chat_member.new_chat_member.status

        + "\n\n<b>Connective user</b> "
        + "\n👨‍💼 <b>Firstname</b>: " + ctx.update.my_chat_member.from.first_name
        + "\n🪪 <b>Id</b>: " + ctx.update.my_chat_member.from.id
        + "\n🕹 <b>Username</b>: @" + ctx.update.my_chat_member.from.username
        + "\n\n💬 <b>Message</b>: " + `<i>${msg}</i>`;

    await bot.api.sendMessage(HISTORY_BOT_CHAT_ID, message, {
        parse_mode: "HTML"
    })
}





bot.on("my_chat_member", async (ctx) => {


    let type = ctx.update.my_chat_member.chat.type;
    let status = ctx.update.my_chat_member.new_chat_member.status;


    if (type == 'channel') {

        let channel_id = ctx.update.my_chat_member.chat.id;
        let channel_name = ctx.update.my_chat_member.chat.title;
        let channel_username = ctx.update.my_chat_member.chat.username;
        let connective_user_id = ctx.update.my_chat_member.from.id;

        let data = {
            channel_id,
            channel_name,
            channel_username,
            connective_user_id,
        }
        if (status == 'administrator') {
            data.active_channel = true;
            registerChannel(data, ctx);
            history_msg_template(ctx, 'success', "The bot was assigned to the admin of the channel");
        } else {
            data.active_channel = false;
            removeChannel(data, ctx);
            history_msg_template(ctx, 'faild', "The bot was assigned to the admin of the channel");
        }
    } else if (type == 'group' || type == "supergroup") {

        let group_id = ctx.update.my_chat_member.chat.id;
        let group_name = ctx.update.my_chat_member.chat.title;
        let group_username = ctx.update.my_chat_member.chat.username;
        let connective_user_id = ctx.update.my_chat_member.from.id;

        let new_chat_member = ctx.update.my_chat_member.new_chat_member;

        let data = {
            group_id,
            group_name,
            group_username,
            connective_user_id,
        }
        if (status == 'administrator' && new_chat_member.can_delete_messages) {
            data.active_group = true;
            registerGroup(data, ctx)
            history_msg_template(ctx, 'success', "The bot was assigned to the admin of the group")
        } else {
            data.active_group = false;
            removeGroup(data, ctx)
            history_msg_template(ctx, 'faild', "The bot has been removed from the group admin or the required permissions have not been granted")
        }
    } else if (type == 'private') {
        console.log(status);

        let user_id = ctx.update.my_chat_member.chat.id;
        let first_name = ctx.update.my_chat_member.chat.first_name;
        let username = ctx.update.my_chat_member.chat.username;

        let data = {
            user_id,
            first_name,
            username,
        }

        if (status == "member") {
            data.active_user = true;
            registerUser(data, ctx)
        } else {
            data.active_user = false;
            removeUser(data, ctx)
        }

    }


})






const pm = bot.chatType("private");



const main_menu = new Keyboard()
    .text("👥 Mening guruhlarim")
    .text("📊 Kanallar")
    .persistent()
    .resized();


pm.command("start", (ctx) => {
    try {
        ctx.reply("Salom Bro. Kanalga a'zo bo'l bo'tga xush kelibsiz!", {
            reply_markup: main_menu
        })

    } catch (error) {
        customLogger.log({
            level: 'error',
            message: error
        });
    }
})








const add_channel_btn_menu = new Menu("add_channel_btn_menu")
    .text("➕ Kanal ulash", async (ctx) => {
        ctx.answerCallbackQuery();
        ctx.deleteMessage()
        ctx.reply(`👮‍♂️ <b>Ulamoqchi bo'lgan kanal usernameni yozing.</b>
    \n📝Eslatma: <i>Ulamoqchi bo'lgan kanalizga botni administrator qiligan bo'lishingiz shart! Aks holda gruppaga kanalni bog'lay olmaysiz.</i>
    \n\n <b>Masalar:</b> @kanalusername`, {
            parse_mode: "HTML"
        })

        await ctx.conversation.enter("channelUsernameConversation");
    })
pm.use(add_channel_btn_menu);

const my_group_menu = new Menu("my_group_menu");
my_group_menu.dynamic(async (ctx, range) => {
    let group_list = await ctx.session.session_db.my_group_list
    group_list.forEach((item) => {
        range
            .text(item.group_name, async (ctx) => {
                ctx.session.session_db.selected_group = item;

                ctx.deleteMessage()
                ctx.reply("<b>Gruppa nomi</b>: " + item.group_name +
                    "\n<b>Gruppa username:</b>  @" + item.group_username +
                    "\n\nGruppaga kanal ulash uchun <b>➕ Kanal ulash</b> tugmasini bosing.", {
                    parse_mode: "HTML",
                    reply_markup: add_channel_btn_menu,
                })
                await ctx.answerCallbackQuery();
            })
            .row();
    });
});


pm.use(my_group_menu);
pm.hears("👥 Mening guruhlarim", async (ctx) => {
    try {
        let user_id = ctx.from.id;
        let group_list = await myGroupList(user_id, ctx);
        if (group_list.length) {
            ctx.session.session_db.my_group_list = group_list;
            ctx.reply("👮‍♂️ <b>Sizning gruppalaringiz</b> \n\n"
                + "📝 Eslatma: <i>Siz tomondan quyidagi gruppalarga bot admin sifatida tayinlangan!</i>", {
                parse_mode: "HTML",
                reply_markup: my_group_menu
            })
        } else {
            ctx.reply("⚠️ Sizda hozirda gruppalar yo'q \n\n ", {
                parse_mode: "HTML",
            })
        }
    } catch (error) {
        customLogger.log({
            level: 'error',
            message: error
        });
    }
})

















bot.start({
    // Make sure to specify the desired update types
    allowed_updates: ["my_chat_member", "chat_member", "message", "callback_query", "inline_query"],
});