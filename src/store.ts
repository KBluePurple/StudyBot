import * as Discord from "discord.js";

export class Store {
    public static Guild: Discord.Guild | undefined;
    public static LogChannel: Discord.TextChannel | undefined;
}
