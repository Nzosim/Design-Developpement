const db = require('../mongo/level.js'),
        dbU = require('../mongo/user.js'),
        { MessageEmbed, MessageButton, MessageActionRow } = require('discord.js'),
        config = require('../config.json'),
        AntiSpam = require("discord-anti-spam"),
        Discord = require('discord.js'),
        messageConfig = require('../message-config.json')

const antiSpam = new AntiSpam({
        warnThreshold: 3, // Amount of messages sent in a row that will cause a warning.
        banThreshold: 5, // Amount of messages sent in a row that will cause a ban.
        maxInterval: 3000, // Amount of time (in milliseconds) in which messages are considered spam.
        warnMessage: "{@user}, Stop !", // Message that will be sent in chat upon warning a user.
        banMessage: "a été banni pour spam", // Message that will be sent in chat upon banning a user.
        maxDuplicatesWarning: 3, // Amount of duplicate messages that trigger a warning.
        ignoredPermissions: ["ADMINISTRATOR"], // Bypass users with any of these permissions.
        unMuteTime:  1440,
        ignoreBots: true, // Ignore bot messages.
        verbose: true, // Extended Logs from module.
        removeMessages: true, // If the bot should remove all the spam messages when taking action on a user!
        modLogsEnabled: true, // If to enable modlogs
        modLogsChannelName: "log-messages", // channel to send the modlogs too!
        modLogsMode: "embed",
})


/*
* Permet d'indiquer à messageDelete que le bot a supprimé le message et que ce n'est pas un utilisateur
*/
let delBot = false;
function del(){
        return delBot
}

module.exports = {
        name: 'messageCreate',
	async execute(message) {

                if(message.author.bot) return
                        
                /*
                * Ajoute à la base de données les personnes qui n'y sont pas 
                */
                dbU.exist(message.author.id, message.author.username)

                /*
                * Anti-lien
                */
                for(let i = 0 ; i < config.antiLien.length ; i++){
                        if(message.content.includes(config.antiLien[i]) && message.author.id != message.guild.ownerId){
                                if(message.channel.name.includes("ticket-")) return
                                delBot = true
                                message.channel.send('Les liens sont interdit !')
                                message.guild.channels.cache.get(config.log.logevents).send({embeds: [new MessageEmbed()
                                        .setTitle('**Anti Lien**')
                                        .setDescription(`${message.author} à envoyé : \n\n> ${message.content}`)]})
                                return message.delete()
                        }
                }

                /*
                * Système de level
                */
                await db.addXp(message.author.id, 23, message)

                /*
                * Système de sugestion
                */
                if(message.channel.id == config.sugestion){
                        delBot = true
                        const mess = message.content
                        const author = message.author
                        
                        const embed = new MessageEmbed()
                                .setColor(config.embedColor)
                                .setAuthor(
                                {
                                        name: `Suggestion de ${author.tag}`, 
                                        iconURL: author.displayAvatarURL()
                                })
                                .setDescription(mess)
                        message.channel.send({embeds: [embed]})
                                .then(msg => {
                                        msg.react('✅')
                                        msg.react('❌')
                                        message.delete()
                                })
                }

                /*
                * Système anti-spam
                */ 
                antiSpam.message(message)

                /*
                * Création ticket 
                */                        
                let title, description, bouton, commande = true
                switch(message.content){
                        case `${config.prefix}serveur-create`:
                                title = messageConfig.serveur.serveurTitle
                                description = messageConfig.serveur.serveurDescription
                                bouton = 'serveur'
                                break
                        case `${config.prefix}recrutement-create`:
                                title = messageConfig.recrutement.recrutementTitle
                                description = messageConfig.recrutement.recrutementDescription
                                bouton = 'recrutement'
                                break
                        case `${config.prefix}support-create`:
                                title = messageConfig.support.supportTitle
                                description = messageConfig.support.supportDescription
                                bouton = 'support'
                                break
                        case `${config.prefix}bot-create`:
                                title = messageConfig.bot.botTitle
                                description = messageConfig.bot.botDescription
                                bouton = 'bot'
                                break   
                        case `${config.prefix}web-create`:
                                title = messageConfig.web.webTitle
                                description = messageConfig.web.webDescription
                                bouton = 'web'
                                break
                        case `${config.prefix}kyoline-create`:
                                title = messageConfig.kyoline.kyolineTitle
                                description = messageConfig.kyoline.kyolineDescription
                                bouton = 'kyoline'
                                break
                        case `${config.prefix}soon-create`:
                                title = messageConfig.soon.soonTitle
                                description = messageConfig.soon.soonDescription
                                bouton = 'soon'
                                break
                        default:
                                commande = false
                }
                if(commande){
                        if(message.author.id != message.guild.ownerId) return message.reply("Vous n'avez pas la permission pour effectuer cette commande !")

                        if(message.content == `${config.prefix}soon-create` || message.content == `${config.prefix}kyoline-create`){
                                const embed = new MessageEmbed()
                                        .setImage(message.content == `${config.prefix}soon-create` ? messageConfig.soon.image1 : messageConfig.kyoline.image1)
                                        .setColor(config.embedColor)
                                const embed2 = new MessageEmbed()
                                        .setImage(message.content == `${config.prefix}soon-create` ? messageConfig.soon.image2 : messageConfig.kyoline.image2)
                                        .setColor(config.embedColor)
                                const embed3 = new MessageEmbed()
                                        .setImage(message.content == `${config.prefix}soon-create` ? messageConfig.soon.image3 : messageConfig.kyoline.image3)
                                        .setColor(config.embedColor)
                                message.channel.send({ embeds: [embed, embed2, embed3] })
                        }

                        const embed = new MessageEmbed()
                                .setTitle(title)
                                .setColor(config.embedColor)
                                .setDescription(description)
                        const row = new MessageActionRow()
                                .addComponents(new MessageButton()
                                        .setCustomId(bouton)
                                        .setLabel('Ouvrir un ticket')
                                        .setEmoji('✉️')
                                        .setStyle('PRIMARY'),
                                )

                        message.channel.send({
                                embeds: [embed],
                                components: [row]
                        })
                        delBot = true
                        message.delete()
                }

                /*
                * Message d'aide du bot
                */
                let title2, description2, commande2 = true
                switch(message.content){
                        case `${config.prefix}recrutement`:
                                title2 = messageConfig.recrutement.recrutementTitle
                                description2 = messageConfig.recrutement.recrutementDescription
                                break
                        case `${config.prefix}soutien-create`:
                                title2 = messageConfig.soutien.soutienTitle
                                description2 = messageConfig.soutien.soutienDescription
                                break
                        case `${config.prefix}botInfo`:
                                title2 = messageConfig.botInfo.botInfoTitle
                                description2 = messageConfig.botInfo.botInfoDescription
                                break
                        default:
                                commande2 = false
                }
                if(commande2){
                        if(message.author.id != message.guild.ownerId) return message.reply("Vous n'avez pas la permission pour effectuer cette commande !")

                        const embed = new MessageEmbed()
                                .setTitle(title2)
                                .setColor(config.embedColor)
                                .setDescription(description2)

                        message.channel.send({ embeds: [embed] })
                        delBot = true
                        message.delete()
                }

	}, del
}