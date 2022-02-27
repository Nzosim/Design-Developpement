const { SlashCommandBuilder } = require('@discordjs/builders'),
    { MessageEmbed } = require('discord.js'),
    Discord = require('Discord.js'),
    config = require('../../config.json'),
    parseDuration = require('parse-duration'),
    humanizeDuration = require('humanize-duration')

module.exports = {
  data: new SlashCommandBuilder()
    .setName('tempban')
    .setDescription('Ban une personne pendant un certain temps')
        .addUserOption(option => option.setName('user').setDescription('personne à bannir').setRequired(true))
        .addStringOption(option => option.setName('time').setDescription('temps du bannissement').setRequired(true))
        .addStringOption(option => option.setName('raison').setDescription('raison du bannissement').setRequired(true)),
  async execute(interaction) {

    if(!interaction.member.permissions.has(Discord.Permissions.FLAGS.ADMINISTRATOR)) return interaction.reply("Vous n'avez pas la permission pour effectuer cette commande !")

    const user = interaction.options.getUser('user')
    const temps = parseDuration(interaction.options.getString('time'))
    const raison = interaction.options.getString('raison')
        
    if (user == interaction.user.id) {
      return interaction.reply({ content: `Vous ne pouvez pas vous ban vous même`, ephemeral: true })
    }
    if (user == interaction.guild.ownerId) {
      return interaction.reply({ content: `Vous ne pouvez pas ban le fondateur du serveur`, ephemeral: true })
    }
    if (!temps) return interaction.reply({content: "Veuillez indiquer une durée valide", ephemeral: true })

    let embed = new MessageEmbed()
      .setTitle(`[BAN] ${user.tag}`)
      .addField('Modérateur', interaction.user.username, true)
      .addField('Raison', raison, true)
      .addField('Durée', humanizeDuration(temps, {language: 'fr'}), true)
      .setThumbnail(user.displayAvatarURL());
    
    let embedUser = new MessageEmbed()
      .setTitle(`Vous avez été [BAN] du serveur Design & Developpement`)
      .addField('Modérateur', interaction.user.username, true)
      .addField('Raison', raison, true)
      .addField('Durée', (humanizeDuration(temps, {language: 'fr'})), true)
      .setDescription("Si vous pensez que cette sanction est une erreur veuillez répondre à ce message");
    
    await user.send({ embeds: [embedUser]}).catch(() => {})
    await interaction.guild.bans.create(user, {reason: raison}).then(() => {interaction.reply({ embeds: [embed], ephemeral: true  })});
    return interaction.guild.channels.cache.get(config.log.sanctions).send({ embeds: [embed]})
  },
}
