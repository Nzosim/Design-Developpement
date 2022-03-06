const config = require('../config.json'),
    db = require('../mongo/user.js')

module.exports = {
	name: 'guildMemberAdd',
	async execute(member) {

        /*
        * Permet d'ajouter à la base de donnée les utilisateurs qui rejoigne le serveur 
        */
        await db.createUser(member.id, member.user.username)
        return member.guild.channels.cache.get(config.log.logmongo).send(`Utilisateur ajouté à la base de données : ${member.user.tag}`)
        
	},
};


// member.guild.channels.cache.get(config.event.join).send(`${member.user} vient de nous rejoindre. Il a été invité par ${} qui a désormais ${} invitations`)





// module.exports = async (member) => {


//     const embed = new MessageEmbed()
//     .setTitle('Member Joined')
//     .setDescription(`User: ${member.user.tag} (${member})\nUser ID: ${member.id}\nAcc. Created: ${member.user.createdAt}\nServer Mmebr Count: ${member.guild.memberCount}`)
//     .setColor("GREEN")
//     .setTimestamp()
//     .setThumbnail(`${member.user.avatarURL}`)

//     member.guild.channels.cache.get(data.ChannelID).send({ embeds: [embed]})
// }


// client.on("guildMemberAdd", member => {
//     // To compare, we need to load the current invite list.
//     member.guild.invites.fetch().then(newInvites => {
//       // This is the *existing* invites for the guild.
//       const oldInvites = invites.get(member.guild.id);
//       // Look through the invites, find the one for which the uses went up.
//       const invite = newInvites.find(i => i.uses > oldInvites.get(i.code));
//       // This is just to simplify the message being sent below (inviter doesn't have a tag property)
//       const inviter = client.users.cache.get(invite.inviter.id);
//       // Get the log channel (change to your liking)
//       const logChannel = member.guild.channels.cache.find(channel => channel.name === "join-logs");
//       // A real basic message with the information we need. 
//       inviter
//         ? logChannel.send(`${member.user.tag} joined using invite code ${invite.code} from ${inviter.tag}. Invite was used ${invite.uses} times since its creation.`)
//         : logChannel.send(`${member.user.tag} joined but I couldn't find through which invite.`);
//     });
//   });