const { SlashCommandBuilder } = require('@discordjs/builders');
const db = require('../../mongoose.js')
const Discord = require('Discord.js')
const config = require('../../config.json')

module.exports = {
    data: new SlashCommandBuilder()
        .setName('removemoney')
        .setDescription('Retirer de l\'argent à un utilisateur')
        .addUserOption(option => option.setName('utilisateur').setDescription('Utilisateur concerné').setRequired(true))
        .addIntegerOption(option => option.setName('nombre').setDescription('Argent à retirer').setRequired(true)),
    async execute(interaction){

       if(!interaction.member.permissions.has(Discord.Permissions.FLAGS.ADMINISTRATOR)) return interaction.reply("Vous n'avez pas la permission pour effectuer cette commande !")
    
        const user = interaction.options.getUser('utilisateur');
        const number = interaction.options.getInteger('nombre');

        if (number <=0) {
			return interaction.reply({ content: 'Vous devez entrer un nombre valide !', ephemeral: true });
		}

        let userCreer = await db.exist(user.id)
        if(userCreer) interaction.guild.channels.cache.get(config.log.logmongo).send(`Utilisateur ajouté à la base de données : ${message.author.tag}`)

        const remove = await db.removeMoney(user.id, number)
        interaction.guild.channels.cache.get(config.log.logmongo).send(`**${number} D&D** ont été retiré à ${user.tag}, il est maintenant à **${remove} D&D**.`)

        return interaction.reply({ content: `**${number} D&D** ont été retiré à ${user.tag}, il est maintenant à **${remove} D&D**.`});

    }
}