const config = require('../config.json'),
    db = require('../mongo/user.js')

module.exports = {
	name: 'guildMemberRemove',
	async execute(member) {

        /*
        * Permet de retirer de la base de donnée les utilisateurs qui quitte le serveur (ne retire pas les warns de la personne)
        */
        await db.remove(member.id)
        member.guild.channels.cache.get(config.log.logmongo).send(`Utilisateur retiré de la base de données : ${member.user.tag}`)
        
        /*
        * Message lorsqu'un membre quitte le serveur
        */
        member.guild.channels.cache.get(config.joinAndLeave).send(`${member.user.tag} a quitté`);

        /*
        * Changement du channel : nombre de membre
        */
        return member.guild.channels.cache.get(config.memberCount).edit({ name: `📈 Membre : ${member.guild.memberCount}` })

	},
};