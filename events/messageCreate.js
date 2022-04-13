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
                * Explication système recrutement serveur
                */ 
                if(message.content === `${config.prefix}recrutement`){
                        if(message.author.id != message.guild.ownerId) return message.reply("Vous n'avez pas la permission pour effectuer cette commande !")
                        delBot = true;
                        const embed = new MessageEmbed()
                                .setTitle(messageConfig.recrutementInfo.recrutementInfoTitle)
                                .setColor(config.embedColor)
                                .setDescription(messageConfig.recrutementInfo.recrutementInfoDescription)

                        message.channel.send({embeds: [embed]});
                        message.delete();
                }

                /*
                * Creation message et ticket recrutement
                */
                if(message.content === `${config.prefix}recrutement-create`){
                        if(message.author.id != message.guild.ownerId) return message.reply("Vous n'avez pas la permission pour effectuer cette commande !")
                        const embed = new MessageEmbed()
                                .setTitle(messageConfig.recrutement.recrutementTitle)
                                .setColor(config.embedColor)
                                .setDescription(messageConfig.recrutement.recrutementDescription)
                        const row = new MessageActionRow()
                                .addComponents(new MessageButton()
                                        .setCustomId('recrutement')
                                        .setLabel('POSTULER')
                                        .setEmoji('✉️')
                                        .setStyle('PRIMARY'),
                                )

                        message.channel.send({
                                embeds: [embed],
                                components: [row]
                        })
                        message.delete()
                }

                /*
                * Creation message et ticket support
                */
                if(message.content === `${config.prefix}support-create`){
                        if(message.author.id != message.guild.ownerId) return message.reply("Vous n'avez pas la permission pour effectuer cette commande !")
                        const embed = new MessageEmbed()
                                .setTitle(messageConfig.support.supportTitle)
                                .setColor(config.embedColor)
                                .setDescription(messageConfig.support.supportDescription)
                        const row = new MessageActionRow()
                                .addComponents(new MessageButton()
                                        .setCustomId('support')
                                        .setLabel('Ouvrir un ticket')
                                        .setEmoji('✉️')
                                        .setStyle('PRIMARY'),
                                )

                        message.channel.send({
                                embeds: [embed],
                                components: [row]
                        })
                        message.delete()
                }

                /*
                * Creation message et ticket commande bot discord
                */
                if(message.content === `${config.prefix}bot-create`){
                        if(message.author.id != message.guild.ownerId) return message.reply("Vous n'avez pas la permission pour effectuer cette commande !")
                        const embed = new MessageEmbed()
                                .setTitle(messageConfig.bot.botTitle)
                                .setColor(config.embedColor)
                                .setDescription(messageConfig.bot.botDescription)
                        const row = new MessageActionRow()
                                .addComponents(new MessageButton()
                                        .setCustomId('bot')
                                        .setLabel('Ouvrir un ticket')
                                        .setEmoji('✉️')
                                        .setStyle('PRIMARY'),
                                )

                        message.channel.send({
                                embeds: [embed],
                                components: [row]
                        })
                        message.delete()
                }

                /*
                * Creation message nous-soutenir
                */
                if(message.content === `${config.prefix}soutien-create`){
                        if(message.author.id != message.guild.ownerId) return message.reply("Vous n'avez pas la permission pour effectuer cette commande !")
                        const embed = new MessageEmbed()
                                .setTitle(messageConfig.soutien.soutienTitle)
                                .setColor(config.embedColor)
                                .setDescription(messageConfig.soutien.soutienDescription)
                        message.channel.send({
                                embeds: [embed]
                        })
                        message.delete()
                }

                /*
                * Creation message et ticket commande site web
                */
                if(message.content === `${config.prefix}web-create`){
                        if(message.author.id != message.guild.ownerId) return message.reply("Vous n'avez pas la permission pour effectuer cette commande !")
                        const embed = new MessageEmbed()
                                .setTitle(messageConfig.web.webTitle)
                                .setColor(config.embedColor)
                                .setDescription(messageConfig.web.webDescription)
                        const row = new MessageActionRow()
                                .addComponents(new MessageButton()
                                        .setCustomId('web')
                                        .setLabel('Ouvrir un ticket')
                                        .setEmoji('✉️')
                                        .setStyle('PRIMARY'),
                                )

                        message.channel.send({
                                embeds: [embed],
                                components: [row]
                        })
                        message.delete()
                }

                /*
                * Creation message et ticket commande kyolin
                */
                 if(message.content === `${config.prefix}kyoline-create`){
                        if(message.author.id != message.guild.ownerId) return message.reply("Vous n'avez pas la permission pour effectuer cette commande !")

                        const embed = new MessageEmbed()
                                .setImage("https://cdn.discordapp.com/attachments/955464773397544961/955528165713903616/fond_YT.jpg")
                                .setColor(config.embedColor)
                        const embed2 = new MessageEmbed()
                                .setImage("https://cdn.discordapp.com/attachments/955464773397544961/955528165416124446/banniereTJ.jpg")
                                .setColor(config.embedColor)
                        const embed3 = new MessageEmbed()
                                .setImage("https://cdn.discordapp.com/attachments/955464773397544961/955528166015926352/POV-1.jpg")
                                .setColor(config.embedColor)
                        const embed4 = new MessageEmbed()
                                .setTitle(messageConfig.graphiste.kyoline.kyolineTitle)
                                .setColor(config.embedColor)
                                .setDescription(messageConfig.graphiste.kyoline.kyolineDescription)
                        const row = new MessageActionRow()
                                .addComponents(new MessageButton()
                                        .setCustomId('kyoline')
                                        .setLabel('Ouvrir un ticket')
                                        .setEmoji('✉️')
                                        .setStyle('PRIMARY'),
                                )

                        message.channel.send({
                                embeds: [embed, embed2, embed3, embed4],
                                components: [row]
                        })
                        message.delete()
                }

                /*
                * Creation message et ticket commande soon
                */
                if(message.content === `${config.prefix}soon-create`){
                        if(message.author.id != message.guild.ownerId) return message.reply("Vous n'avez pas la permission pour effectuer cette commande !")

                        const embed = new MessageEmbed()
                                .setImage("https://cdn.discordapp.com/attachments/688806403539992660/955198400360497153/Antivol3.png")
                                .setColor(config.embedColor)
                        const embed2 = new MessageEmbed()
                                .setImage("https://cdn.discordapp.com/attachments/688806403539992660/955198314092036096/Antivol.jpg")
                                .setColor(config.embedColor)
                        const embed3 = new MessageEmbed()
                                .setImage("https://cdn.discordapp.com/attachments/688806403539992660/955198448976674856/Antivol2.jpg")
                                .setColor(config.embedColor)
                        const embed4 = new MessageEmbed()
                                .setTitle(messageConfig.graphiste.soon.soonTitle)
                                .setColor(config.embedColor)
                                .setDescription(messageConfig.graphiste.soon.soonDescription)
                        const row = new MessageActionRow()
                                .addComponents(new MessageButton()
                                        .setCustomId('soon')
                                        .setLabel('Ouvrir un ticket')
                                        .setEmoji('✉️')
                                        .setStyle('PRIMARY'),
                                )

                        message.channel.send({
                                embeds: [embed, embed2, embed3, embed4],
                                components: [row]
                        })
                        message.delete()
                }

                /*
                * Creation message et ticket commande serveur
                */
                if(message.content === `${config.prefix}serveur-create`){
                        if(message.author.id != message.guild.ownerId) return message.reply("Vous n'avez pas la permission pour effectuer cette commande !")

                        const embed = new MessageEmbed()
                                .setTitle(messageConfig.serveur.serveurTitle)
                                .setColor(config.embedColor)
                                .setDescription(messageConfig.serveur.serveurDescription)
                        const row = new MessageActionRow()
                                .addComponents(new MessageButton()
                                        .setCustomId('serveur')
                                        .setLabel('Ouvrir un ticket')
                                        .setEmoji('✉️')
                                        .setStyle('PRIMARY'),
                                )

                        message.channel.send({
                                embeds: [embed],
                                components: [row]
                        })
                        message.delete()
                }

                /*
                * Explication vente de bot discord
                */
                if(message.content === `${config.prefix}botInfo`){
                        if(message.author.id != message.guild.ownerId) return message.reply("Vous n'avez pas la permission pour effectuer cette commande !")
                        delBot = true;
                        const embed = new MessageEmbed()
                                .setTitle(messageConfig.botInfo.botInfoTitle)
                                .setColor(config.embedColor)
                                .setDescription(messageConfig.botInfo.botInfoDescription)

                        message.channel.send({embeds: [embed]});
                        message.delete();
                }

	}, del
}