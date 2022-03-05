const db = require('../mongo/level.js'),
        dbU = require('../mongo/user.js'),
        { MessageEmbed } = require('discord.js'),
        config = require('../config.json')

module.exports = {
        name: 'messageCreate',
	async execute(message) {

                if(message.author.bot) return

                /*
                * Système de level
                */
                console.log(message.author.id)
                await db.addXp(message.author.id, 23, message)

                /*
                * Anti-lien
                */
                if(message.author.id == message.guild.ownerId) return // autorise l'owner à envoyer des liens 
                for(let i = 0 ; i < config.antiLien.length ; i++){
                        if(message.content.includes(config.antiLien[i])){
                                message.channel.send('Les liens sont interdit !')
                                message.guild.channels.cache.get(config.log.logevents).send({embeds: [new MessageEmbed()
                                        .setTitle('**Anti Lien**')
                                        .setDescription(`${message.author} à envoyé : \n\n> ${message.content}`)]})
                                message.delete()
                        }
                }
	},
};