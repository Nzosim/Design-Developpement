const { SlashCommandBuilder } = require('@discordjs/builders'),
    { MessageEmbed } = require('discord.js'),
    Discord = require('Discord.js'),
    db = require('../../mongo/warn.js'),
    config = require('../../config.json')

module.exports = {
	data: new SlashCommandBuilder()
		.setName('warn')
		.setDescription('avertir un membre')
        .addUserOption(option => option.setName('user').setDescription('Personne à avertir').setRequired(true))
        .addStringOption(option => option.setName('raison').setDescription('Raison de l\'avertissement').setRequired(true)),
	async execute(interaction) {

        if(!interaction.member.permissions.has(Discord.Permissions.FLAGS.ADMINISTRATOR)) return interaction.reply("Vous n'avez pas la permission pour effectuer cette commande !")

        const user = interaction.options.getUser('user')
        const raison = interaction.options.getString('raison')

        if (user.id === interaction.guild.ownerID) return interaction.reply({ content: 'Vous ne pouvez pas warn le propriétaire du serveur', ephemeral: true })

        db.warn(await db.numberWarn(user.id)+1, user.id, raison, Date.now(), interaction.user.username)
        
        const embed = new MessageEmbed()
            .setTitle(`[WARN] ${user.tag}`)
            .addField('Modérateur', interaction.user.username, true)
            .addField('Raison', raison, true)
            .setThumbnail(user.displayAvatarURL());

        const embedUser = new MessageEmbed()
            .setTitle(`Vous avez été [WARN] sur le serveur Design & Developpement`)
            .addField('Modérateur', interaction.user.username, true)
            .addField('Raison', raison, true)
            .setDescription("Si vous pensez que cette sanction est une erreur veuillez répondre à ce message")

        await user.send({ embeds: [embedUser]}).catch(() => {})
        await interaction.reply({ embeds: [embed], ephemeral: true  })

        return interaction.guild.channels.cache.get(config.log.sanctions).send({ embeds: [embed]})
	},
}