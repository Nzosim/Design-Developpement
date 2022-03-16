const { SlashCommandBuilder } = require('@discordjs/builders');
const db = require('../../mongo/user.js')
const dbMoney = require('../../mongo/money.js')

const config = require('../../config.json')

module.exports = {
    data: new SlashCommandBuilder()
        .setName('money')
        .setDescription('Afficher l\'argent d\'un utilisateur')
        .addUserOption(option => option.setName('utilisateur').setDescription('Utilisateur concerné')),
    async execute(interaction){
    
        let user = interaction.options.getUser('utilisateur');

        if (user == null) user = interaction.user

        db.exist(user.id, user.username)

        const money = await dbMoney.seeMoney(user.id)
        interaction.guild.channels.cache.get(config.log.logmongo).send(`${user.tag} à actuellement : **${money} D&D**.`)

        return interaction.reply({ content: `Vous avez actuellement : **${money} D&D**.`});

    }
}