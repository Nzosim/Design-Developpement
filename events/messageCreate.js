const db = require('../mongo/user.js')
const { MessageEmbed } = require('discord.js');

module.exports = {
	name: 'messageCreate',
	async execute(message) {
                if(message.author.bot) return

                //permet d'ajouter à la base de donnée les personnes qui n'y sont pas
                let userCreer = await db.exist(message.author.id)
                if(userCreer) message.guild.channels.cache.get('943259188824518696').send(`Utilisateur ajouté à la base de données : ${message.author.tag}`)

                //anti lien 
                if(message.content.includes('https://') || message.content.includes('http://') || message.content.includes('discord.gg')){
                        message.channel.send('Les liens sont interdit !')
                        message.guild.channels.cache.get('943531071755128902').send({embeds: [new MessageEmbed().setTitle('**Anti Lien**').setDescription(`${message.author} à envoyé : \n\n> ${message.content}`)]})
                        message.delete()
                }		
	},
};