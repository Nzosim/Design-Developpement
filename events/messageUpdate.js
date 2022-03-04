const {MessageEmbed } = require('discord.js'),
    config = require('../config.json')

module.exports = {
    name: 'messageUpdate', 
    execute(oldMessage, newMessage, message) {
        
        if(oldMessage.author.bot) return;

        if(oldMessage.content === newMessage.content) return;

        const Count = 1950;
        const Original = oldMessage.content.slice(0, Count) + (oldMessage.content.length > 1950 ? "..." : "");
        const Edited = newMessage.content.slice(0, Count) + (oldMessage.content.length > 1950 ? "..." : "");

        const Log = new MessageEmbed()
                            .setTitle(`${oldMessage.author.tag} a modifié un message`)
                            .setTimestamp()
                            .addFields({
                                name: 'Ancien',
                                value: `\n${Original}`,
                                inline: false
                            },{
                                name: 'Nouveau',
                                value: `\n${Edited} `.slice("0", "4096"),
                                inline: false
                            },{
                                name: 'Channel',
                                value: newMessage.channel.name,
                                inline: false
                            })
        return oldMessage.guild.channels.cache.get(config.log.messages).send({embeds: [Log]});
    }
}