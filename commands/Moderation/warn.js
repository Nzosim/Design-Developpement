const { SlashCommandBuilder } = require('@discordjs/builders'),
    { MessageEmbed } = require('discord.js'),
    Discord = require('Discord.js'),
    db = require('../mongo/warn.js')

module.exports = {
	data: new SlashCommandBuilder()
		.setName('clear')
		.setDescription('Supprimer plusieurs message')
        .addUserOption(option => option.setName('user').setDescription('Personne à avertir').setRequired(true))
        .addStringOption(option => option.setName('raison').setDescription('Raison de l\'avertissement').setRequired(true)),
	async execute(interaction) {

        if(!interaction.member.permissions.has(Discord.Permissions.FLAGS.ADMINISTRATOR)) return interaction.reply("Vous n'avez pas la permission pour effectuer cette commande !")

        const user = interaction.options.getUser('user')
        const raison = interaction.options.getString('raison')

        if (user.id === interaction.guild.ownerID) return interaction.reply({ content: 'Vous ne pouvez pas warn le propriétaire du serveur', ephemeral: true })
        
        db.warn(user.id, raison, Date.now(), interaction.user.id)
        
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




const parseDuration = require('parse-duration'),
    humanizeDuration = require('humanize-duration'),
    fs = require('fs')
    Discord = require('discord.js'),
    config = require('../config.json')

module.exports = {
    run: async (message, args, client) => {
        try{
            
            if(client.db.warns[member.id].length === 3){
                let muteRole = message.guild.roles.cache.find(role => role.name === 'Muted')
                        if (!muteRole) {
                            muteRole = await message.guild.roles.create({
                                data: {
                                    name: 'Muted',
                                    permissions: 0
                                }
                            })
                            message.guild.channels.cache.forEach(channel => channel.createOverwrite(muteRole, {
                                SEND_MESSAGES: false,
                                CONNECT: false,
                                ADD_REACTIONS: false
                            }))
                        }
                        const duration = parseDuration("1d")
                        const reason = "Trop d'infraction"
                        await member.roles.add(muteRole)
                        message.channel.send(`${member} a été mute pendant ${humanizeDuration(duration, {language: 'fr'})} <a:avis_2_2:821430548554711050>`).then(sent => sent.delete({timeout: 5e3}))
                        message.guild.channels.cache.get(config.logs).send(new Discord.MessageEmbed()
                            .setAuthor(`[MUTE] ${member.user.tag}`, member.user.displayAvatarURL())
                            .addField('Utilisateur', member, true)
                            .addField('Modérateur', message.author, true)
                            .addField('Raison', reason, true)
                            .addField('Durée', humanizeDuration(duration, {language: 'fr'}), true))
                        setTimeout(() => {
                            if (member.deleted || !member.manageable) return
                            member.roles.remove(muteRole)
                            message.channel.send(`${member} a été unmute <a:avis_2_2:821430548554711050>`).then(sent => sent.delete({timeout: 5e3}))
                        }, duration)
                        member.send(new Discord.MessageEmbed()
                        .setAuthor(`[MUTE] Vous avez été mute sur Infinity Pub`, member.user.displayAvatarURL())
                        .addField('Modérateur', message.author, true)
                        .addField('Raison', reason, true)
                        .addField('Durée', humanizeDuration(duration, {language: 'fr'}), true)
                        .setFooter('Si vous souhaitez contester ce warn repondé a ce message !'))
            }


            if(client.db.warns[member.id].length === 6){
                let muteRole = message.guild.roles.cache.find(role => role.name === 'Muted')
                        if (!muteRole) {
                            muteRole = await message.guild.roles.create({
                                data: {
                                    name: 'Muted',
                                    permissions: 0
                                }
                            })
                            message.guild.channels.cache.forEach(channel => channel.createOverwrite(muteRole, {
                                SEND_MESSAGES: false,
                                CONNECT: false,
                                ADD_REACTIONS: false
                            }))
                        }
                        const duration = parseDuration("5d")
                        const reason = "Trop d'infraction"
                        await member.roles.add(muteRole)
                        message.channel.send(`${member} a été mute pendant ${humanizeDuration(duration, {language: 'fr'})} <a:avis_2_2:821430548554711050>`).then(sent => sent.delete({timeout: 5e3}))
                        message.guild.channels.cache.get(config.logs).send(new Discord.MessageEmbed()
                            .setAuthor(`[MUTE] ${member.user.tag}`, member.user.displayAvatarURL())
                            .addField('Utilisateur', member, true)
                            .addField('Modérateur', message.author, true)
                            .addField('Raison', reason, true)
                            .addField('Durée', humanizeDuration(duration, {language: 'fr'}), true))
                        setTimeout(() => {
                            if (member.deleted || !member.manageable) return
                            member.roles.remove(muteRole)
                            message.channel.send(`${member} a été unmute <a:avis_2_2:821430548554711050>`).then(sent => sent.delete({timeout: 5e3}))
                        }, duration)
                        member.send(new Discord.MessageEmbed()
                        .setAuthor(`[MUTE] Vous avez été mute sur Infinity Pub`, member.user.displayAvatarURL())
                        .addField('Modérateur', message.author, true)
                        .addField('Raison', reason, true)
                        .addField('Durée', humanizeDuration(duration, {language: 'fr'}), true)
                        .setFooter('Si vous souhaitez contester ce warn repondé a ce message !'))
            }

            if(client.db.warns[member.id].length === 10){
                const reason = "Trop d'infraction"
            let muteRole = message.guild.roles.cache.find(role => role.name === 'Muted')
            if (!muteRole) {
                muteRole = await message.guild.roles.create({
                    data: {
                        name: 'Muted',
                        permissions: 0
                    }
                })
                message.guild.channels.cache.forEach(channel => channel.createOverwrite(muteRole, {
                    SEND_MESSAGES: false,
                    CONNECT: false,
                    ADD_REACTIONS: false
                }))
            }
            await member.roles.add(muteRole)
            message.channel.send(`${member} a été mute <a:avis_2_2:821430548554711050>`).then(sent => sent.delete({timeout: 5e3}))
            message.guild.channels.cache.get(config.logs).send(new Discord.MessageEmbed()
                .setAuthor(`[MUTE] ${member.user.tag}`, member.user.displayAvatarURL())
                .addField('Utilisateur', member, true)
                .addField('Modérateur', message.author, true)
                .addField('Raison', reason, true)
                .addField('Durée', '∞', true))
            member.send(new Discord.MessageEmbed()
            .setAuthor(`[MUTE] Vous avez été mute sur Infinity Pub`, member.user.displayAvatarURL())
            .addField('Modérateur', message.author, true)
            .addField('Raison', reason, true)
            .addField('Durée', '∞', true)
            .setFooter('Si vous souhaitez contester ce warn repondé a ce message !'))
            }