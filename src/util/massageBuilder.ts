import * as Discord from 'discord.js';

export abstract class MessageBuilder {
    public static Embed(title: string, description: string, color: Discord.ColorResolvable): Discord.MessageEmbed {
        const embed = new Discord.MessageEmbed();
        embed.setTitle(title);
        embed.setDescription(description);
        embed.setTimestamp();
        embed.setColor(color);
        return embed;
    }
}
