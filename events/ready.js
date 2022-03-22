const config = require('../config.json'),
	mongoose = require('mongoose');

const { MessageEmbed } = require('discord.js')

module.exports = {
	name: 'ready',
	once: true,
	async execute(client) {
		console.log(`Ready! Logged in as ${client.user.tag}`);

		/*
		* Activité du bot
		*/
		client.user.setActivity(config.activite.message, { type: config.activite.type });

		/*
		* Connection à la base de données MongoDB
		*/
		await mongoose.connect('mongodb+srv://DesignDeveloppement:86t5mnhVQDaTfqzV@designdeveloppement.di8ct.mongodb.net/DesignDeveloppement?retryWrites=true&w=majority', {
			keepAlive: true
		}).then(console.log('MongoDB connected'))

	}
}