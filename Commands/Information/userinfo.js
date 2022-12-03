const { 
    EmbedBuilder, 
    ChatInputCommandInteraction, 
    ApplicationCommandOptionType
} = require("discord.js");

module.exports = {
    name: "userinfo",
    description: "Exibe as informações disponíveis sobre o alvo especificado.",
    options: [
        { name: "objeto", 
        description: "Selecione um objetivo.", 
        type: ApplicationCommandOptionType.User 
    }
    ],
    /**
     * @param {ChatInputCommandInteraction} interaction 
     */
    async execute(interaction) {
        const target                    = interaction.options.getMember("objeto") || interaction.member;
        const { user, presence, roles } = target;
        const formatter                 = new Intl.ListFormat("en-GB", { style: "narrow", type: "conjunction" });
        
        await user.fetch();

        const statusType = {
            idle: "1FJj7pX.png",
            dnd: "fbLqSYv.png",
            online: "JhW7v9d.png",
            invisible: "dibKqth.png"
        };

        const activityType = [
            "🕹 *Jogando*",
            "🎙 *Transmissão*",
            "🎧 *Ouvindo*",
            "📺 *Assistindo*",
            "🤹🏻‍♀️ *Personalizado*",
            "🏆 *Competindo em*"
        ];

        const clientType = [
            { name: "desktop", text: "Computador", emoji: "💻" },
            { name: "mobile", text: "Telefone", emoji: "📱" },
            { name: "web", text: "Website", emoji: "🌍" },
            { name: "offline", text: "Offline", emoji: "💤" }
        ];

        const badges = { // Replace these with emojis to match the preview.
            BugHunterLevel1: "Bug Hunter",
            BugHunterLevel2: "Bug Buster",
            CertifiedModerator: "Discord Certified Moderator",
            HypeSquadOnlineHouse1: "House of Bravery",
            HypeSquadOnlineHouse2: "House of Brilliance",
            HypeSquadOnlineHouse3: "House of Balance",
            Hypesquad: "HypeSquad Event Attendee",
            Partner: "Discord Partner",
            PremiumEarlySupporter: "Early Nitro Supporter",
            Staff: "Discord Staff",
            VerifiedBot: "Verified Bot",
            VerifiedDeveloper: "Verified Developer",
            ActiveDeveloper: "Active Developer"
        };

        const maxDisplayRoles = (roles, maxFieldLength = 1024) => {
            let totalLength = 0;
            const result = [];

            for (const role of roles) {
                const roleString = `<@&${role.id}>`;

                if (roleString.length + totalLength > maxFieldLength)
                    break;

                totalLength += roleString.length + 1; // +1 as it's likely we want to display them with a space between each role, which counts towards the limit.
                result.push(roleString);
            }

            return result.length;
        }

        const sortedRoles  = roles.cache.map(role => role).sort((a, b) => b.position - a.position).slice(0, roles.cache.size - 1);

        const clientStatus = presence?.clientStatus instanceof Object ? Object.keys(presence.clientStatus) : "offline";
        const userFlags    = user.flags.toArray();

        const deviceFilter = clientType.filter(device => clientStatus.includes(device.name));
        const devices      = !Array.isArray(deviceFilter) ? new Array(deviceFilter) : deviceFilter;

        interaction.reply({ embeds: [
            new EmbedBuilder()
                .setColor(user.hexAccentColor || "Random")
                .setAuthor({
                    name: user.tag,
                    iconURL: `https://i.imgur.com/${statusType[presence?.status || "invisible"]}`
                })
                .setThumbnail(user.avatarURL({ dynamic: true, size: 1024 }))
                .setImage(user.bannerURL({ dynamic: true, size: 1024 }))
                .addFields(
                    { name: "💳 ID", value: user.id },
                    { name: "🎢 Atividades", value: presence?.activities.map(activity => `${activityType[activity.type]} ${activity.name}`).join("\n") || "Nenhum" },
                    { name: "🤝🏻 Servidor associado", value: `<t:${parseInt(target.joinedTimestamp / 1000)}:R>`, inline: true },
                    { name: "📆 Conta criada", value: `<t:${parseInt(user.createdTimestamp / 1000)}:R>`, inline: true },
                    { name: "🦸🏻‍♀️ Nickname", value: target.nickname || "Nenhum", inline: true },
                    {
                        name: `🎭 Cargos (${maxDisplayRoles(sortedRoles)} do ${sortedRoles.length})`, 
                        value: `${sortedRoles.slice(0, maxDisplayRoles(sortedRoles)).join(" ") || "Nenhum"}`
                    },
                    { name: `🏅 Distintivos (${userFlags.length})`, value: userFlags.length ? formatter.format(userFlags.map(flag => `**${badges[flag]}**`)) : "Nenhum" },
                    { name: `🤳🏻 Dispositivos`, value: devices.map(device => `${device.emoji} ${device.text}`).join("\n"), inline: true },
                    { name: "🎨 Cor do Perfil", value: user.hexAccentColor || "Nenhum", inline: true },
                    { name: "🏋🏻‍♀️ Impulsionando Servidor", value: roles.premiumSubscriberRole ? `Desde <t:${parseInt(target.premiumSinceTimestamp / 1000)}:R>` : "Não", inline: true },
                    { name: "🎏 Banner", value: user.bannerURL() ? "** **" : "Nenhum" }
                )
        ], ephemeral: false });
    }
};
