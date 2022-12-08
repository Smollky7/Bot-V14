const { Client, ChatInputCommandInteraction, ButtonBuilder, ActionRowBuilder, ButtonStyle, EmbedBuilder } = require("discord.js")
const DB = require("../../Structures/Schemas/Verification")
const EditReply = require("../../Systems/EditReply")

module.exports = {
    name: "verify",
    description: "Sistema de Verificação.",
    UserPerms: ["ManageGuild"],
    category: "Moderation",
    options: [
        {
            name: "role",
            description: "Selecione a função de membros verificados",
            type: 8,
            required: true
        },
        {
            name: "channel",
            description: "Selecione o canal de verificação",
            type: 7,
            required: false
        },
    ],

    async execute(interaction, client) {
        await interaction.deferReply({ ephemeral: true})

        const { options, guild, channel } = interaction

        const role = options.getRole("role")
        const Channel = options.getChannel("channel") || channel

        let Data = await DB.findOne({ Guild: guild.id }).catch(err => { })

        if (!Data) {
            Data = new DB({
                Guild: guild.id,
                Role: role.id
            })

            await Data.save()
        } else {

            Data.Role = role.id
            await Data.save()
        }

        Channel.send({
            embeds: [
                new EmbedBuilder()
                    .setColor(client.color)
                    .setTitle("✅ | Verificação")
                    .setDescription("Clique no botão para verificar!")
                    .setTimestamp()
            ],
            components: [
                new ActionRowBuilder().addComponents(
                    new ButtonBuilder()
                        .setCustomId("verify")
                        .setLabel("Verify")
                        .setStyle(ButtonStyle.Secondary)
                )
            ]
        })

        return EditReply(interaction, "✅", `Painel de verificação enviado com sucesso em ${Channel}`);
      
      
    }
}