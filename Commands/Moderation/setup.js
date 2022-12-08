const { Client, ChatInputCommandInteraction } = require("discord.js")
const Reply = require("../../Systems/Reply")


module.exports = {
    name: "setup",
    description: "Simulates",
    UserPerms: ["Administrator"],
    BotPerms: ["Administrator"],
    category: "Moderation",

    async execute(interaction, client) {

           // Not done as you can see
        
        
        return Reply(interaction, "✅", "Parece que tenho as permissões certas para funcionar perfeitamente bem!")
    }
}
