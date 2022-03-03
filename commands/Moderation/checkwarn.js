const { SlashCommandBuilder } = require('@discordjs/builders'),
    { MessageEmbed } = require('discord.js'),
    Discord = require('Discord.js'),
    db = require('../../mongo/warn.js'),
    config = require('../../config.json')

module.exports = {
	data: new SlashCommandBuilder()
		.setName('checkwarn')
		.setDescription('liste des avertissement d\'un utilisateur')
        .addUserOption(option => option.setName('user').setDescription('Personne à avertir')),
	async execute(interaction) {

        if(!interaction.member.permissions.has(Discord.Permissions.FLAGS.ADMINISTRATOR)) return interaction.reply("Vous n'avez pas la permission pour effectuer cette commande !")

        const user = interaction.options.getUser('user')
        if (user == null) user = interaction.user

        let nombreWarn = await db.numberWarn(user.id)
        let res = await db.checkwarn(user.id)
        if(nombreWarn == 0) return interaction.reply({ content: "Vous avez 0 warn", ephemeral: true  })

        const embed = new MessageEmbed()
            .setTitle(`[WARN] de ${user.tag}`)
            
            .setThumbnail(user.displayAvatarURL());

        return await interaction.reply({ embeds: [embed], ephemeral: true  })
	},
}