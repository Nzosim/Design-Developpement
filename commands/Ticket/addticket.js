const { SlashCommandBuilder } = require('@discordjs/builders');
const Discord = require('discord.js')

 module.exports = {
    data: new SlashCommandBuilder()
      .setName('addticket')
      .setDescription('Ajoute quelqu\'un dans un ticket')
      .addUserOption(option => option.setName('user').setDescription('Membre à ajouter au ticket').setRequired(true)),
    async execute(interaction) {

        if(!interaction.member.permissions.has(Discord.Permissions.FLAGS.ADMINISTRATOR)) return interaction.reply("Vous n'avez pas la permission pour effectuer cette commande !")

      const user = interaction.options.getUser('user');
      
      if(user.bot) return interaction.reply('Vous ne pouvez pas ajouter d\'argent à un bot');

      if (interaction.channel.name.includes('ticket')) {
        interaction.channel.edit({
          permissionOverwrites: [{
            id: user,
            allow: ['SEND_MESSAGES', 'VIEW_CHANNEL'],
          },
          {
            id: interaction.guild.roles.everyone,
            deny: ['VIEW_CHANNEL'],
          }
        ],
        }).then(async () => {
          interaction.reply({
            content: `<@${user.id}> a été ajouté au ticket !`
          });
        });
      } else {
        interaction.reply({
          content: 'Vous devez effectuer cette command dans un ticket !',
          ephemeral: true
        });
      };
    },
  };