import * as fs from "fs";

export class Setting {
    public Data: {
        Token: string;
        GuildId: string;
        LogChannelId: string;
    }

    public Save() {
        fs.writeFileSync("./settings.json", JSON.stringify(this.Data, null, 4));
    }

    constructor() {
        if (fs.existsSync("./settings.json")) {
            this.Data = JSON.parse(fs.readFileSync("./settings.json", "utf8"));
        } else {
            this.Data = {
                Token: "",
                GuildId: "",
                LogChannelId: ""
            };
            this.Save();
        }
    }
}

export const Settings = new Setting();
