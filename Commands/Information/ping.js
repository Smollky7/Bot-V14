const { Client, ChatInputCommandInteraction } = require("discord.js")
const Reply = require("../../Systems/Reply")

module.exports = {
    name: "ping",
    description: "Ping do bot.",
    category: "Informação",

    async execute(interaction, client) {

        return Reply(interaction, "⏳", `A latência atual do Websocket é : \`${client.ws.ping} ms\``, false)
    }
}