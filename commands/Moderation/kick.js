const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed } = require('discord.js');
const Discord = require('discord.js')
const config = require('../../config.json')

module.exports = {
  data: new SlashCommandBuilder()
    .setName('kick')
    .setDescription('Exclure une personne')
        .addUserOption(option => option.setName('user').setDescription('personne à exclure').setRequired(true))
        .addStringOption(option => option.setName('raison').setDescription('raison de l\'exclusion').setRequired(true)),
  async execute(interaction) {

    if(!interaction.member.permissions.has(Discord.Permissions.FLAGS.ADMINISTRATOR)) return interaction.reply("Vous n'avez pas la permission pour effectuer cette commande !")

    const user = interaction.options.getUser('user')
    const raison = interaction.options.getString('raison')
        
    if (user == interaction.user.id) {
      return interaction.reply({ content: `Vous ne pouvez pas vous exclure vous même`, ephemeral: true })
    }
    if (user == interaction.guild.ownerId) {
      return interaction.reply({ content: `Vous ne pouvez pas exclure le fondateur du serveur`, ephemeral: true })
    }

    let embed = new MessageEmbed()
      .setTitle(`[KICK] ${user.tag}`)
      .addField('Modérateur', interaction.user.username, true)
      .addField('Raison', raison, true)
      .setThumbnail(user.displayAvatarURL());
    
    let embedUser = new MessageEmbed()
      .setTitle(`Vous avez été [KICK] du serveur Design & Developpement`)
      .addField('Modérateur', interaction.user.username, true)
      .addField('Raison', raison, true)
      .setDescription("Si vous pensez que cette sanction est une erreur veuillez répondre à ce message")
    
    await user.send({ embeds: [embedUser]}).catch(() => {})
    await user.kick(raison)
    return interaction.guild.channels.cache.get(config.log.sanctions).send({ embeds: [embed]})
  },
}