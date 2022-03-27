const fs = require('fs');
const { Client, Collection, Intents, MessageEmbed, Message } = require('discord.js');
const InvitesTracker = require('@androz2091/discord-invites-tracker');
const config = require('./config.json');
const AntiSpam = require("discord-anti-spam"),
{ promisify } = require('util'),
wait = promisify(setTimeout)
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

const dbInvite = require('./mongo/invite.js')

const tracker = InvitesTracker.init(client, {
    fetchGuilds: true,
    fetchVanity: true,
    fetchAuditLogs: true
});

tracker.on('guildMemberAdd', async (member, type, invite) => {

    const welcomeChannel = member.guild.channels.cache.get(config.joinAndLeave);

	const invitationApresAjout = await dbInvite.addInvite(invite.inviter.id, 1)

	await dbInvite.addInviter(invite.inviter.id, member.id)

	const messageJoin = `**${member.user.username}** est le membre numéro **${member.guild.memberCount} !**`

    if(type === 'normal'){
        welcomeChannel.send(`${member} vient de rejoindre.\nIl a été invité par **${invite.inviter.username}**`
			+` qui a désormais ${invitationApresAjout} invitations\n${messageJoin}`);
    }else if(type === 'vanity'){
        welcomeChannel.send(`${member} vient de rejoindre depuis l'URL du serveur.`);
    }else if(type === 'unknown'){
        welcomeChannel.send(`${member} vient de rejoindre. Je ne peux pas déterminer qui l'a invité.\n${messageJoin}`);
    }
});


