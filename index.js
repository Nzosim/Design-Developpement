const fs = require('fs');
const { Client, Collection, Intents, MessageEmbed, Message } = require('discord.js');
const config = require('./config.json');
const AntiSpam = require("discord-anti-spam");
const client = new Client({ intents: ["GUILDS", "GUILD_MESSAGES", "GUILD_MEMBERS"] }); // GUILD_PRESENCES pour le status soutien
client.commands = new Collection();
client.login(config.token);


const commandFolders = fs.readdirSync("./commands");

for (const folder of commandFolders) {
	const commandFiles = fs.readdirSync(`./commands/${folder}`).filter((file) => file.endsWith(".js"));
	for (const file of commandFiles) {
		const command = require(`./commands/${folder}/${file}`);
		client.commands.set(command.data.name, command);
	}
}

const eventFiles = fs.readdirSync('./events').filter(file => file.endsWith('.js'));
for (const file of eventFiles) {
	const event = require(`./events/${file}`);
	if (event.once) {
		client.once(event.name, (...args) => event.execute(...args));
	} else {
		client.on(event.name, (...args) => event.execute(...args));
	}
}


client.on('interactionCreate', async interaction => {
	if (!interaction.isCommand()) return;
	const command = client.commands.get(interaction.commandName);
	if (!command) return;
	interaction.guild.channels.cache.get(config.log.logcommands).send(`${interaction.user.tag} a effectué la commande "${interaction.commandName}" dans le channel #${interaction.channel.name}`)

	try {
		await command.execute(interaction);
	} catch (error) {
		console.error(error);
		await interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true });
	}
});



// client.on('messageCreate', message => {

//     if (message.author.bot) return
//     const args = message.content.trim().split(/ +/g)
//     const commandName = args.shift().toLowerCase()
//     if (!commandName.startsWith(config.prefix)) return
//     const command = client.commands.get(commandName.slice(config.prefix.length))
//     if (!command) return
// 	console.log("qsefg")
//     command.execute(message)
	
// })


const antiSpam = new AntiSpam({
	warnThreshold: 3, // Amount of messages sent in a row that will cause a warning.
	banThreshold: 5, // Amount of messages sent in a row that will cause a ban.
	maxInterval: 3000, // Amount of time (in milliseconds) in which messages are considered spam.
	warnMessage: "{@user}, Stop !", // Message that will be sent in chat upon warning a user.
	banMessage: "a été banni pour spam", // Message that will be sent in chat upon banning a user.
	maxDuplicatesWarning: 3, // Amount of duplicate messages that trigger a warning.
	ignoredPermissions: ["ADMINISTRATOR"], // Bypass users with any of these permissions.
	unMuteTime:  1440,
	ignoreBots: true, // Ignore bot messages.
	verbose: true, // Extended Logs from module.
	removeMessages: true, // If the bot should remove all the spam messages when taking action on a user!
	modLogsEnabled: true, // If to enable modlogs
	modLogsChannelName: "log-messages", // channel to send the modlogs too!
	modLogsMode: "embed",
  })
  client.on("messageCreate", (message) => antiSpam.message(message));
