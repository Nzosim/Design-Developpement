const { SlashCommandBuilder } = require('@discordjs/builders');
const Discord = require('Discord.js')

module.exports = {
	data: new SlashCommandBuilder()
		.setName('clear')
		.setDescription('Supprimer plusieurs message')
        .addNumberOption(option => option.setName('nombre').setDescription('Nombre de message à supprimer').setRequired(true)),
	async execute(interaction) {

		if(!interaction.member.permissions.has(Discord.Permissions.FLAGS.MANAGE_MESSAGES)) return interaction.reply("Vous n'avez pas la permission pour effectuer cette commande !")

        const amount = interaction.options.getNumber('nombre')

        if (amount < 1 || amount > 100) {
            return interaction.reply({ content: `Vous pouvez seulement supprimer entre 1 et 100 messages`, ephemeral: true })
        }
      
        const { size } = await interaction.channel.bulkDelete(amount, true);

		return interaction.reply({ content: `${size} messages ont été supprimés`, ephemeral: true });

	},
}