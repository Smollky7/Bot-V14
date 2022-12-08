const {
    Client,
    ChatInputCommandInteraction,
    EmbedBuilder,
    ActionRowBuilder,
    ButtonBuilder,
    ButtonStyle,
    ComponentType
} = require("discord.js")
const ms = require("ms")
const EditReply = require("../../Systems/EditReply")

module.exports = {
    name: "kick",
    description: "Kick é um membro do seu servidor.",
    UserPerms: ["KickMembers"],
    BotPerms: ["KickMember"],
    category: "Moderation",
    options: [{
            name: "user",
            description: "Selecione o usuário",
            type: 6,
            required: true,
        },
        {
            name: "reason",
            description: "Forneça um motivo",
            type: 3,
            required: false,
        },
    ],

    /**
     * 
     * @param {Client} client  
     * @param {ChatInputCommandInteraction} interaction 
     */

    async execute(interaction, client) {
        await interaction.deferReply({
            ephemeral: true
        })

        const {
            options,
            user,
            guild
        } = interaction

        const member = options.getMember("user")
        const reason = options.getString("reason") || "Nenhuma razão fornecida"

        if (member.id === user.id) return EditReply(interaction, "❌", `Você não pode chutar a si mesmo!`)
        if (guild.ownerId === member.id) return EditReply(interaction, "❌", `Você não pode chutar o dono do servidor!`)
        if (guild.members.me.roles.highest.position <= member.roles.highest.position) return EditReply(interaction,
            "❌", `Você não pode chutar um membro do mesmo nível que você ou superior!`)
        if (interaction.member.roles.highest.position <= member.roles.highest.position) return EditReply(interaction,
            "❌", `Não posso chutar um membro do mesmo nível que você ou superior!`)

        const Embed = new EmbedBuilder()
            .setColor(client.color)

        const row = new ActionRowBuilder().addComponents(

            new ButtonBuilder()
            .setStyle(ButtonStyle.Danger)
            .setCustomId("kick-yes")
            .setLabel("Yes"),

            new ButtonBuilder()
            .setStyle(ButtonStyle.Primary)
            .setCustomId("kick-no")
            .setLabel("No"),
        )

        const Page = await interaction.editReply({
            embeds: [
                Embed.setDescription(`**⚠️ | Você realmente quer chutar este membro?**`)
            ],
            components: [row]
        })

        const col = await Page.createMessageComponentCollector({
            componentType: ComponentType.Button,
            time: ms("15s")
        })

        col.on("collect", i => {
            if (i.user.id !== user.id) return

            switch (i.customId) {
                case "kick-yes": {

                    member.kick({
                        reason
                    })

                    interaction.editReply({
                        embeds: [
                            Embed.setDescription(`✅ | **${member}** foi expulso por: **${reason}**!`)
                        ],
                        components: []
                    })
                    member.send({
                        embeds: [
                            new EmbedBuilder()
                            .setColor(client.color)
                            .setDescription(`Você foi expulso de **${guild.name}**!`)
                            .setTimestamp()
                        ]
                    }).catch(err => {
                        if (err.code !== 50007) return console.log(err)
                    })
                }
                break;

            case "kick-no": {
                interaction.editReply({
                    embeds: [
                        Embed.setDescription(`✅ | Solicitação de kick cancelada`)
                    ],
                    components: []
                })
            }
            break;
            }
        })

        col.on("end", (collected) => {
            if (collected.size > 0) return

            interaction.editReply({
                embeds: [
                    Embed.setDescription(`❌ | Você não forneceu uma resposta válida a tempo!`)
                ],
                components: []
            })
        })
    }
}