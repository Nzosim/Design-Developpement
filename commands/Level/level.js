const { SlashCommandBuilder } = require('@discordjs/builders'),
    canvacord = require("canvacord"),
    db = require('../../mongo/level.js'),
    Discord = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('level')
        .setDescription('permet de voir son level')
        .addUserOption(option => option.setName('user').setDescription('utilisateur')),
    async execute(interaction) {
    
        let user = interaction.options.getUser('user')
    
        if (user == null) user = interaction.user

        const result = await db.getLevel(user.id)
        const number = await db.getTop(user.id)

        const rank = new canvacord.Rank()
            .setAvatar(user.displayAvatarURL({dynamic: false, format: 'png'}))
            .setCurrentXP(result.xp)
            .setRequiredXP(db.getNeededXP(result.level))
            .setProgressBar("#AAAAAA", "COLOR")
            .setUsername(user.username)
            .setDiscriminator(user.discriminator)
            .setLevel(result.level)
            .setRank(number);

        rank.build().then(data => {
            const attachment = new Discord.MessageAttachment(data, "RankCard.png");
            return interaction.reply({files: [attachment]});
        })
	},
}