const config = require('../config.json'),
    db = require('../mongo/user.js')

module.exports = {
	name: 'guildMemberRemove',
	async execute(member) {

        /*
        * Permet de retirer de la base de donnée les utilisateurs qui quitte le serveur (ne retire pas les warns de la personne)
        */
        await db.remove(member.id)
        return member.guild.channels.cache.get(config.log.logmongo).send(`Utilisateur retiré de la base de données : ${member.user.tag}`)
        
	},
};