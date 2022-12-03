const { Client, Partials, Collection } = require("discord.js")
const ms = require("ms")
const {  promisify } = require("util")
const { glob } = require("glob")
const PG = promisify(glob)
const Ascii = require("ascii-table")
require("dotenv").config()
const { Channel, GuildMember, Message, Reaction, ThreadMember, User, GuildScheduledEvent } = Partials
const config = require("../config.json");

const client = new Client({
    intents: 131071,
    partials: [Channel, GuildMember, Message, Reaction, ThreadMember, User, GuildScheduledEvent],
    allowedMentions: { parse: ["everyone", "roles", "users"] },
    rest: { timeout: ms("1m") }
})

// COLORS
client.color = "Aqua"
client.channelC = "Green"
client.channelD = "Red"
client.channelU = "Purple"
client.emojiC = "Green"
client.emojiD = "Red"
client.serverB = "Red"
client.serverUB = "Green"
/////////////////////////////////////
client.commands = new Collection()

const Handlers = ["Events", "Commands", "EventStack", "Errors"]

Handlers.forEach(handler => {

    require(`./Handlers/${handler}`)(client, PG, Ascii)
})

module.exports = client 

client.login(config.TOKEN)