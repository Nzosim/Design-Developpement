const db = require('../mongo/level.js'),
        dbU = require('../mongo/user.js'),
        { MessageEmbed } = require('discord.js'),
        config = require('../config.json'),
        AntiSpam = require("discord-anti-spam")

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

                await dbU.createUser(message.author.id, message.author.username)

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
                // const antiSpam = new AntiSpam({
                //         warnThreshold: 3, // Amount of messages sent in a row that will cause a warning.
                //         muteThreshold: 5, // Amount of messages sent in a row that will cause a kick.
                //         banThreshold: 10, // Amount of messages sent in a row that will cause a ban.
                //         maxInterval: 3000, // Amount of time (in milliseconds) in which messages are considered spam.
                //         warnMessage: "{@user}, Please stop spamming.", // Message that will be sent in chat upon warning a user.
                //         kickMessage: "**{user_tag}** has been kicked for spamming.", // Message that will be sent in chat upon kicking a user.
                //         muteMessage: "**{user_tag}** has been muted for spamming.", // Message that will be sent in chat upon muting a user.
                //         banMessage: "**{user_tag}** has been banned for spamming.", // Message that will be sent in chat upon banning a user.
                //         maxDuplicatesWarning: 2, // Amount of duplicate messages that trigger a warning.
                //         maxDuplicatesBan: 5, // Ammount of duplicate message that trigger a mute.
                //         ignoredPermissions: ["ADMINISTRATOR"], // Bypass users with any of these permissions.
                //         ignoreBots: true, // Ignore bot messages.
                //         verbose: true, // Extended Logs from module.
                //         removeMessages: true, // If the bot should remove all the spam messages when taking action on a user!
                //         modLogsEnabled: true, // If to enable modlogs
                //         modLogsChannelName: "log-messages", // channel to send the modlogs too!
                //         modLogsMode: "embed",
                //       })
                //       antiSpam.message(message)

	}, del
}