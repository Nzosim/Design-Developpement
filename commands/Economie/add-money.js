const { SlashCommandBuilder } = require('@discordjs/builders');
const db = require('../../mongo/user.js')
const dbMoney = require('../../mongo/money.js')
const Discord = require('discord.js')
const config = require('../../config.json')

module.exports = {
    data: new SlashCommandBuilder()
        .setName('add-money')
        .setDescription('Ajouter de l\'argent à un utilisateur')
        .addUserOption(option => option.setName('utilisateur').setDescription('Utilisateur concerné').setRequired(true))
        .addIntegerOption(option => option.setName('nombre').setDescription('Argent à ajouter').setRequired(true)),
    async execute(interaction){

       if(!interaction.member.permissions.has(Discord.Permissions.FLAGS.ADMINISTRATOR)) return interaction.reply("Vous n'avez pas la permission pour effectuer cette commande !")
    
        const user = interaction.options.getUser('utilisateur');
        const number = interaction.options.getInteger('nombre');

        if (number <=0) {
			return interaction.reply({ content: 'Vous devez entrer un nombre valide !', ephemeral: true });
		}

        db.exist(user.id, user.username)

        const moneyNow = await dbMoney.addMoney(user.id, number)
        interaction.guild.channels.cache.get(config.log.logmongo).send(`**${number} D&D** ont été ajouté à ${user.tag}, il est maintenant à **${moneyNow} D&D**.`)


        return interaction.reply({ content: `**${number}** D&D ont été ajouté à ${user.tag}, il est maintenant à **${moneyNow} D&D**.`});

    }
    
}




