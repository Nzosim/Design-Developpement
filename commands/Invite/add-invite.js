const { SlashCommandBuilder } = require('@discordjs/builders');
const db = require('../../mongo/user.js')
const dbInvite = require('../../mongo/invite.js')
const Discord = require('Discord.js')
const config = require('../../config.json')

module.exports = {
    data: new SlashCommandBuilder()
        .setName('add-invite')
        .setDescription('Ajouter des invitations à un utilisateur')
        .addIntegerOption(option => option.setName('nombre').setDescription('Nombre d\'invitation à ajouter').setRequired(true))
        .addUserOption(option => option.setName('utilisateur').setDescription('Utilisateur concerné')),
    async execute(interaction){

       if(!interaction.member.permissions.has(Discord.Permissions.FLAGS.ADMINISTRATOR)) return interaction.reply("Vous n'avez pas la permission pour effectuer cette commande !")
    
        let user = interaction.options.getUser('utilisateur');
        const number = interaction.options.getInteger('nombre');

        if(user == null) user = interaction.user

        if (number <=0) {
			return interaction.reply({ content: 'Vous devez entrer un nombre valide !', ephemeral: true });
		}

        db.exist(user.id, user.username)

        const invitationApresAjout = await dbInvite.addInvite(user.id, number)
        interaction.guild.channels.cache.get(config.log.logmongo).send(`**${number} invitations** ont été ajouté à ${user.tag}, il est maintenant à **${invitationApresAjout} invitations**.`)


        return interaction.reply({ content: `**${number}** invitations ont été ajouté à ${user.tag}, il est maintenant à **${invitationApresAjout} invitations**.`});

    }
}