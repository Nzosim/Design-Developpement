const config = require('../config.json')
// const { MessageEmbed, MessageActionRow, MessageButton } = require('discord.js');

module.exports = {
	name: 'ready',
	once: true,
	execute(client) {
		console.log(`Ready! Logged in as ${client.user.tag}`);
		client.user.setActivity("vos messages", { type: "WATCHING" });

		// const ticketdisc = client.channels.cache.get(config.ticket.ticketServeurDiscord)

		// const embed = new MessageEmbed()
		// 	.setColor('BLUE')
		// 	.setTitle('Ticket Serveur')
		// 	.setDescription('Cliquez sur le bouton ci-dessous pour ouvrir un ticket\nLes abus seront sanctionnés')
		// 	.setFooter({text: 'Bot made by Nzosim#0379', iconURL: 'https://cdn.discordapp.com/avatars/942865850602487838/45794545655611f2f2f65532d548417b.webp'})
		// const row = new MessageActionRow()
		// 	.addComponents(
		// 		new MessageButton()
		// 		.setCustomId('ticket-serveur')
		// 		.setLabel('Ouvrir un ticket')
		// 		.setEmoji('✉️')
		// 		.setStyle('PRIMARY'),
		// 	);
			
		// 	ticketdisc.send({
		// 		embeds: [embed],
		// 		components: [row]
		// 	})
	}
}