const { MessageEmbed, MessageActionRow, MessageButton } = require('discord.js');
const config = require('../config.json')

module.exports = {
  name: 'interactionCreate',
  async execute(interaction, client) {

    /*
    * Réponse après un clique sur un bouton
    */ 
    if (!interaction.isButton()) return;
    // ouverture de ticket
    if (interaction.customId == "ticket-support" || interaction.customId == "ticket-bot" || interaction.customId == "ticket-serveur" || interaction.customId == "ticket-graphiste") {
        if (interaction.guild.channels.cache.find(c => c.topic == interaction.user.id)) {
            interaction.guild.channels.cache.get(config.log.logevents).send(`${interaction.user.username} a essayé d'ouvrir un deuxième ticket`)
            return interaction.reply({content: 'Vous avez déjà un ticket ouvert !',ephemeral: true});
        }

        interaction.guild.channels.create(`ticket-${interaction.user.username}`, {
            parent: config.ticket.categorieTicket,
            topic: interaction.user.id,
            permissionOverwrites: [{
                id: interaction.user.id,
                allow: ['SEND_MESSAGES', 'VIEW_CHANNEL'],
            },
            {
                id: interaction.guild.roles.everyone,
                deny: ['VIEW_CHANNEL'],
            },
            ],
            type: 'text',
        }).then(async c => {
            interaction.reply({
            content: `Voici votre ticket : <#${c.id}>`,
            ephemeral: true
            });
            const embed = new MessageEmbed()
                .setTitle('Ticket de :')
                .setDescription(`<@!${interaction.user.id}>`)
                .setFooter({text: 'Bot made by Nzosim#0379', iconURL: 'https://cdn.discordapp.com/avatars/942865850602487838/45794545655611f2f2f65532d548417b.webp'})
                .setTimestamp()

            const row = new MessageActionRow()
                .addComponents(new MessageButton()
                    .setCustomId('close-ticket')
                    .setLabel('Fermer le ticket')
                    .setStyle('DANGER'),
                )

            await c.send({
                embeds: [embed],
                components: [row]
            })

            interaction.guild.channels.cache.get(config.log.logevents).send(`${interaction.user.username} a ouvert un ticket : <#${c.id}>`)
        })
    }
    // fermeture de ticket
    if (interaction.customId == "close-ticket") {
      const chan = interaction.guild.channels.cache.get(interaction.channelId);
      const row = new MessageActionRow()
        .addComponents(
          new MessageButton()
          .setCustomId('confirm-close')
          .setLabel('Fermer le ticket')
          .setStyle('DANGER'),
          new MessageButton()
          .setCustomId('no')
          .setLabel('Annuler la fermeture')
          .setStyle('SECONDARY'),
        );

        await interaction.reply({
        content: 'Êtes vous sûr de vouloir fermer le ticket ?',
        components: [row]
      });

      const collector = interaction.channel.createMessageComponentCollector({
        componentType: 'BUTTON',
        time: 10000
      });

      collector.on('collect', i => {
        if (i.customId == 'confirm-close') {

          interaction.editReply({
            content: `Ticket fermé par <@!${interaction.user.id}>`,
            components: []
          });

          chan.edit({
              name: `closed-${chan.name}`,
              topic: 'close',
              permissionOverwrites: [
                {
                  id: interaction.guild.roles.everyone,
                  deny: ['VIEW_CHANNEL'],
                },
              ],
            })
        
          interaction.guild.channels.cache.get(config.log.logevents).send(`Le ticket : ${chan.name} a été fermé par ${interaction.user.id}`)

          collector.stop();
        };
        if (i.customId == 'no') {
          interaction.editReply({
            content: 'Fermeture du ticket annulé !',
            components: []
          });
          collector.stop();
        };
      });
    };
  
  }
}