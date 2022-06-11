import * as Discord from "discord.js";
import { Intents, Client } from "discord.js";

import { Store } from './store';
import { Settings } from "./settings";
import { MessageBuilder } from './util/massageBuilder';

const intents = [
    Intents.FLAGS.GUILDS,
    Intents.FLAGS.GUILD_MEMBERS,
    Intents.FLAGS.GUILD_BANS,
    Intents.FLAGS.GUILD_EMOJIS_AND_STICKERS,
    Intents.FLAGS.GUILD_INTEGRATIONS,
    Intents.FLAGS.GUILD_WEBHOOKS,
    Intents.FLAGS.GUILD_INVITES,
    Intents.FLAGS.GUILD_VOICE_STATES,
    Intents.FLAGS.GUILD_PRESENCES,
    Intents.FLAGS.GUILD_MESSAGES,
    Intents.FLAGS.GUILD_MESSAGE_REACTIONS,
    Intents.FLAGS.GUILD_MESSAGE_TYPING,
    Intents.FLAGS.DIRECT_MESSAGES,
    Intents.FLAGS.DIRECT_MESSAGE_REACTIONS,
    Intents.FLAGS.DIRECT_MESSAGE_TYPING,
    Intents.FLAGS.GUILD_SCHEDULED_EVENTS
];

const client = new Client({ intents });

client.on("ready", () => {
    console.log("Ready!");
    console.log(`UserName: ${client.user?.username}`);

    Store.Guild = client.guilds.cache.get(Settings.Data.GuildId);
    Store.LogChannel = Store.Guild?.channels.cache.get(Settings.Data.LogChannelId) as Discord.TextChannel;
});

client.on("messageCreate", async message => {
    if (message.author.bot) return;

    let handled = true;
    let tempMessage = message;
    if (message.content.startsWith("!채널설정")) {
        Store.LogChannel = message.channel as Discord.TextChannel;
        if (Store.LogChannel != undefined) {
            tempMessage = await message.channel.send("로그채널이 설정되었습니다.");
            Settings.Data.LogChannelId = message.channel.id;
            Settings.Save();
        }
    } else if (message.content.startsWith("!서버설정")) {
        const guild = message.guild;
        if (guild == null) return;
        Store.Guild = guild;
        tempMessage = await message.channel.send("서버설정이 완료되었습니다.");
        Settings.Data.GuildId = guild.id;
        Settings.Save();
    } else {
        handled = false;
    }

    if (handled) {
        await message.delete();
        setTimeout(() => {
            tempMessage?.delete();
        }, 3000);
    }
});

client.on("voiceStateUpdate", async (oldState, newState) => {
    if (oldState?.channelId !== newState?.channelId) {
        if (oldState.channelId && newState.channelId) {
            Store.LogChannel?.send({ embeds: [MessageBuilder.Embed("이동", `**${oldState.member?.displayName}**님이 ${oldState.channel?.name}에서 ${newState.channel?.name}으로 이동하였습니다.`, "#99FF")] });
        } else if (newState.channelId) {
            Store.LogChannel?.send({ embeds: [MessageBuilder.Embed("입장", `**${oldState.member?.displayName}**님이 ${newState.channel?.name}에 입장하였습니다.`, "#99ff99")] });
        } else {
            Store.LogChannel?.send({ embeds: [MessageBuilder.Embed("퇴장", `**${oldState.member?.displayName}**님이 ${oldState.channel?.name}에서 퇴장하였습니다.`, "#ff9999")] });
        }
    }
});

client.login(Settings.Data.Token);