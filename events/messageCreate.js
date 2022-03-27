const db = require('../mongo/level.js'),
        dbU = require('../mongo/user.js'),
        { MessageEmbed, MessageButton, MessageActionRow } = require('discord.js'),
        config = require('../config.json'),
        AntiSpam = require("discord-anti-spam"),
        Discord = require('discord.js');

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
                                .setTitle("**Explication fonctionnement du serveur :**")
                                .setColor(config.embedColor)
                                .setDescription("Pour chaque catégorie de services proposé sur le serveur (graphismes, developpement, ...)"
                                        +" il peut y avoir plusieurs personnes qui les proposent, vous aurez chacun votre channel avec vos tarifs et des exemples de vos créations"
                                        +"**\n\nRémunération :**\nComme c'est nous qui nous occupons de trouver vos clients et d'obtenir des commandes sur le serveur\n"
                                        +"- Nous prenons 20% de ce que vous rapportes chaque commande passé sur le serveur\n- Sauf si vous avez un nombre d'invitation supérieur\n"
                                        +" à 10, nous considérons que vous ramenez de potentiels clients donc vous gardez 100% de vos revenus")

                        message.channel.send({embeds: [embed]});
                        message.delete();
                }

	}, del
}