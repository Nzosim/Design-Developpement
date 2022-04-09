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
const discordModals = require('discord-modals') // Define the discord-modals package!
discordModals(client);

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

// tracker.on('guildMemberAdd', async (member, type, invite) => {

//     const welcomeChannel = member.guild.channels.cache.get(config.joinAndLeave);

// 	const invitationApresAjout = await dbInvite.addInvite(invite.inviter.id, 1)

// 	await dbInvite.addInviter(invite.inviter.id, member.id)

// 	const messageJoin = `**${member.user.username}** est le membre numéro **${member.guild.memberCount} !**`

//     if(type === 'normal'){
//         welcomeChannel.send(`${member} vient de rejoindre.\nIl a été invité par **${invite.inviter.username}**`
// 			+` qui a désormais ${invitationApresAjout} invitations\n${messageJoin}`);
//     }else if(type === 'vanity'){
//         welcomeChannel.send(`${member} vient de rejoindre depuis l'URL du serveur.`);
//     }else if(type === 'unknown'){
//         welcomeChannel.send(`${member} vient de rejoindre. Je ne peux pas déterminer qui l'a invité.\n${messageJoin}`);
//     }else{
// 		welcomeChannel.send(`${member} vient de rejoindre.\nIl a été invité par **DISBOARD**`);
// 	}
// });



const { Modal, TextInputComponent, showModal } = require('discord-modals')

client.on('interactionCreate', (interaction) => {
	if (interaction.customId == "recrutement"){
	
		const modal = new Modal() 
		.setCustomId('recrutement')
		.setTitle('Recrutement :')
		.addComponents(
			new TextInputComponent()
			.setCustomId('age')
			.setLabel('Quelle est votre âge ?')
			.setStyle('SHORT') 
			.setPlaceholder('Votre âge ici')
			.setRequired(true) 
		)
		.addComponents(
			new TextInputComponent()
			.setCustomId('poste')
			.setLabel('A quelle poste voulez vous postuler ?')
			.setStyle('SHORT') 
			.setPlaceholder('Developpeur, Graphiste, etc...')
			.setRequired(true) 
		)
		.addComponents(
			new TextInputComponent()
			.setCustomId('experience')
			.setLabel('Depuis quand êtes vous dans se domaine ?')
			.setStyle('SHORT') 
			.setPlaceholder('1 ans, 2 ans, etc...')
			.setRequired(true) 
		)
		.addComponents(
			new TextInputComponent()
			.setCustomId('time')
			.setLabel('Quels sont vos disponibilités ?')
			.setStyle('SHORT') 
			.setPlaceholder('tout les jous, week end, seulement pendant les vacances...')
			.setRequired(true) 
		)

		showModal(modal, {
			client: client, 
			interaction: interaction 
		})

	}

	if (interaction.customId == "support"){
	
		const modal = new Modal() 
		.setCustomId('support')
		.setTitle('Ticket Support :')
		.addComponents(
			new TextInputComponent()
			.setCustomId('prb')
			.setLabel('Quelle est votre problème ?')
			.setStyle('LONG') 
			// .setPlaceholder('Votre âge ici')
			.setRequired(true) 
		)

		showModal(modal, {
			client: client, 
			interaction: interaction 
		})

	}

	if (interaction.customId == "bot"){
	
		const modal = new Modal() 
		.setCustomId('bot')
		.setTitle('Commande de bot discord :')
		.addComponents(
			new TextInputComponent()
			.setCustomId('paie')
			.setLabel('Voulez-vous payer via PayPal ou invitations ?')
			.setStyle('SHORT') 
			.setPlaceholder('Paypal, invitations')
			.setRequired(true) 
		)
		.addComponents(
			new TextInputComponent()
			.setCustomId('detail')
			.setLabel('Veuillez lister les fonctionnalités voulues')
			.setStyle('LONG') 
			.setPlaceholder('Modération (warn, ban, ...), Anti-Raid, ...')
			.setRequired(true) 
		)
		.addComponents(
			new TextInputComponent()
			.setCustomId('temps')
			.setLabel('Pour quand le voulez-vous ?')
			.setStyle('SHORT') 
			.setRequired(true) 
		)

		showModal(modal, {
			client: client, 
			interaction: interaction 
		})

	}

	if (interaction.customId == "web"){
	
		const modal = new Modal() 
		.setCustomId('web')
		.setTitle('Commande de site web :')
		.addComponents(
			new TextInputComponent()
			.setCustomId('budget')
			.setLabel('Veuillez indiquer votre budget.')
			.setStyle('SHORT') 
			.setRequired(true) 
		)
		.addComponents(
			new TextInputComponent()
			.setCustomId('detail')
			.setLabel('Décrivez votre demande précisément')
			.setStyle('LONG') 
			.setRequired(true) 
		)

		showModal(modal, {
			client: client, 
			interaction: interaction 
		})

	}

	if (interaction.customId == "kyoline"){
	
		const modal = new Modal() 
		.setCustomId('kyoline')
		.setTitle('Commande graphisme :')
		.addComponents(
			new TextInputComponent()
			.setCustomId('type')
			.setLabel('Que voulez vous commander ?')
			.setStyle('SHORT') 
			.setPlaceholder('Logo, Bannière, Overlay, ...')
			.setRequired(true) 
		)
		.addComponents(
			new TextInputComponent()
			.setCustomId('detail')
			.setLabel('Décrivez votre demande précisément')
			.setStyle('LONG') 
			.setRequired(true) 
		)

		showModal(modal, {
			client: client, 
			interaction: interaction 
		})

	}

	if (interaction.customId == "soon"){
	
		const modal = new Modal() 
		.setCustomId('soon')
		.setTitle('Commande graphisme :')
		.addComponents(
			new TextInputComponent()
			.setCustomId('type')
			.setLabel('Que voulez vous commander ?')
			.setStyle('SHORT') 
			.setPlaceholder('Logo, Bannière, Overlay, ...')
			.setRequired(true) 
		)
		.addComponents(
			new TextInputComponent()
			.setCustomId('detail')
			.setLabel('Décrivez votre demande précisément')
			.setStyle('LONG') 
			.setRequired(true) 
		)

		showModal(modal, {
			client: client, 
			interaction: interaction 
		})

	}

	if (interaction.customId == "serveur"){
	
		const modal = new Modal() 
		.setCustomId('serveur')
		.setTitle('Commande serveur discord :')
		.addComponents(
			new TextInputComponent()
			.setCustomId('detail')
			.setLabel('Décrivez votre demande précisément')
			.setStyle('LONG') 
			.setRequired(true) 
		)

		showModal(modal, {
			client: client, 
			interaction: interaction 
		})

	}

})

