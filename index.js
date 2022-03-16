const fs = require('fs');
const { Client, Collection, Intents, MessageEmbed, Message } = require('discord.js');
const InvitesTracker = require('@androz2091/discord-invites-tracker');
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




// const tracker = InvitesTracker.init(client, {
//     fetchGuilds: true,
//     fetchVanity: true,
//     fetchAuditLogs: true
// });

// tracker.on('guildMemberAdd', (member, type, invite) => {

//     const welcomeChannel = member.guild.channels.cache.get(config.joinAndLeave);

//     if(type === 'normal'){
//         welcomeChannel.send(`Welcome ${member}! You were invited by ${invite.inviter.username}!`);
//     }

//     else if(type === 'vanity'){
//         welcomeChannel.send(`Welcome ${member}! You joined using a custom invite!`);
//     }

//     else if(type === 'unknown'){
//         welcomeChannel.send(`Welcome ${member}! I can't figure out how you joined the server...`);
//     }

// });