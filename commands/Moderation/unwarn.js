const { SlashCommandBuilder } = require('@discordjs/builders'),
    { MessageEmbed } = require('discord.js'),
    Discord = require('Discord.js'),
    db = require('../../mongo/warn.js'),
    config = require('../../config.json')

module.exports = {
	data: new SlashCommandBuilder()
		.setName('unwarn')
		.setDescription('retirer un membre à un membre')
        .addUserOption(option => option.setName('user').setDescription('personne à unwarn').setRequired(true))
        .addNumberOption(option => option.setName('number').setDescription('numéro de warn à retirer').setRequired(true)),
	async execute(interaction) {

        if(!interaction.member.permissions.has(Discord.Permissions.FLAGS.ADMINISTRATOR)) return interaction.reply("Vous n'avez pas la permission pour effectuer cette commande !")

        const user = interaction.options.getUser('user')
        const number = interaction.options.getNumber('number')

        const i = await db.unwarn(user.id, number)
        if(i == 1) return await interaction.reply({ content: "Veuillez entrer un warn valide !", ephemeral: true  })

        const embed = new MessageEmbed()
            .setTitle(`[UNWARN] ${user.tag}`)
            .addField('Modérateur', interaction.user.username, true)
            .setThumbnail(user.displayAvatarURL());

        const embedUser = new MessageEmbed()
            .setTitle(`Vous avez été [UNWARN] sur le serveur Design & Developpement`)
            .addField('Modérateur', interaction.user.username, true)

        await user.send({ embeds: [embedUser]}).catch(() => {})
        await interaction.reply({ embeds: [embed], ephemeral: true  })

        return interaction.guild.channels.cache.get(config.log.sanctions).send({ embeds: [embed]})
	},
}