const { Client, ActivityType, userMention } = require("discord.js")
const ms = require("ms")
const mongoose = require("mongoose")
const { MONGODBURL } = require("../../config.json")

module.exports = {
    name: "ready",

    /**
     * @param {Client} client 
     */
    async execute(client) {
        const { user, ws } = client 

        console.log(`Logged into ${client.user.tag}.`)

        setInterval(() => {

            const ping = ws.ping 

            user.setActivity({
                name: `Ping: ${ping} ms`,
                type: 3
            })
        }, ms("5s"))

        if(!MONGODBURL) return 

        mongoose.connect(MONGODBURL, {
            useNewUrlParser: true,
            useUnifiedTopology: true 
        }).then(() => {
            console.log("Connected to the database successfully.")
        }).catch(err => console.log(err))
    }
}