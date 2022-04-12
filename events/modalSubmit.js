const { MessageEmbed, MessageActionRow, MessageButton } = require('discord.js'),
    config = require('../config.json')

module.exports = {
    name: 'modalSubmit',
    async execute(modal) {

        /*
        * Ticket recrutement
        */
        if(modal.customId === 'recrutement'){
            const firstResponse = modal.getTextInputValue('age')
            const second = modal.getTextInputValue('poste')
            const third = modal.getTextInputValue('experience')
            const fourth = modal.getTextInputValue('time')

            modal.guild.channels.create(`ticket-${modal.member.user.username}`, {
                parent: config.ticket.categorieTicket,
                topic: modal.member.user.id,
                permissionOverwrites: [{
                    id: modal.member.user.id,
                    allow: ['SEND_MESSAGES', 'VIEW_CHANNEL'],
                },
                {
                    id: modal.guild.roles.everyone,
                    deny: ['VIEW_CHANNEL'],
                },
                ],
                type: 'text',
            }).then(async c => {
                await modal.deferReply({ ephemeral: true })
                modal.followUp({content: `Voici votre ticket : <#${c.id}>`})
                const embed = new MessageEmbed()
                    .setTitle("Candidature de : "+ modal.member.user.username)
                    .addField("Age", firstResponse, true)
                    .addField("Poste", second, true)
                    .addField("Experience", third)
                    .addField("Disponibilités", fourth)
                    .setColor(config.embedColor)
                    .setDescription("**Merci d'envoyer des exemples de vos créations !**")

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

                modal.guild.channels.cache.get(config.log.logevents).send(`${modal.member.user.username} a ouvert un ticket : <#${c.id}>`)
            })
        }

        if(modal.customId === 'support'){
            const firstResponse = modal.getTextInputValue('prb')

            modal.guild.channels.create(`ticket-${modal.member.user.username}`, {
                parent: config.ticket.categorieTicket,
                topic: modal.member.user.id,
                permissionOverwrites: [{
                    id: modal.member.user.id,
                    allow: ['SEND_MESSAGES', 'VIEW_CHANNEL'],
                },
                {
                    id: modal.guild.roles.everyone,
                    deny: ['VIEW_CHANNEL'],
                },
                ],
                type: 'text',
            }).then(async c => {
                await modal.deferReply({ ephemeral: true })
                modal.followUp({content: `Voici votre ticket : <#${c.id}>`})
                const embed = new MessageEmbed()
                    .setTitle("Candidature de : "+ modal.member.user.username)
                    .addField("Problème", firstResponse, true)

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

                modal.guild.channels.cache.get(config.log.logevents).send(`${modal.member.user.username} a ouvert un ticket : <#${c.id}>`)
            })


        }

        /*
        * Ticket recrutement
        */
        if(modal.customId === 'bot'){
            const firstResponse = modal.getTextInputValue('paie')
            const second = modal.getTextInputValue('detail')
            const third = modal.getTextInputValue('temps')

            modal.guild.channels.create(`ticket-${modal.member.user.username}`, {
                parent: config.ticket.categorieTicket,
                topic: modal.member.user.id,
                permissionOverwrites: [{
                    id: modal.member.user.id,
                    allow: ['SEND_MESSAGES', 'VIEW_CHANNEL'],
                },
                {
                    id: modal.guild.roles.everyone,
                    deny: ['VIEW_CHANNEL'],
                },
                ],
                type: 'text',
            }).then(async c => {
                await modal.deferReply({ ephemeral: true })
                modal.followUp({content: `Voici votre ticket : <#${c.id}>`})
                const embed = new MessageEmbed()
                    .setTitle("Commande pour un bot de : "+ modal.member.user.username)
                    .addField("Paiement", firstResponse,true)
                    .addField("Temps", third,true)
                    .addField("Fonctionnalités", second)
                    
                    .setColor(config.embedColor)

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

                modal.guild.channels.cache.get(config.log.logevents).send(`${modal.member.user.username} a ouvert un ticket : <#${c.id}>`)
            })
        }

        /*
        * Ticket web
        */
        if(modal.customId === 'web'){
            const firstResponse = modal.getTextInputValue('detail')
            const second = modal.getTextInputValue('budget')

            modal.guild.channels.create(`ticket-${modal.member.user.username}`, {
                parent: config.ticket.categorieTicket,
                topic: modal.member.user.id,
                permissionOverwrites: [{
                    id: modal.member.user.id,
                    allow: ['SEND_MESSAGES', 'VIEW_CHANNEL'],
                },
                {
                    id: modal.guild.roles.everyone,
                    deny: ['VIEW_CHANNEL'],
                },
                ],
                type: 'text',
            }).then(async c => {
                await modal.deferReply({ ephemeral: true })
                modal.followUp({content: `Voici votre ticket : <#${c.id}>`})
                const embed = new MessageEmbed()
                    .setTitle("Ticket web de : "+ modal.member.user.username)
                    .addField("Detail", firstResponse)
                    .addField("Budget", second)
                    .setColor(config.embedColor)

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

                modal.guild.channels.cache.get(config.log.logevents).send(`${modal.member.user.username} a ouvert un ticket : <#${c.id}>`)
            })
        }


        /*
        * Ticket kyoline
        */
        if(modal.customId === 'kyoline'){
            const firstResponse = modal.getTextInputValue('type')
            const second = modal.getTextInputValue('detail')

            modal.guild.channels.create(`ticket-${modal.member.user.username}`, {
                parent: config.ticket.categorieTicket,
                topic: modal.member.user.id,
                permissionOverwrites: [{
                    id: modal.member.user.id,
                    allow: ['SEND_MESSAGES', 'VIEW_CHANNEL'],
                },
                {
                    id: modal.guild.roles.everyone,
                    deny: ['VIEW_CHANNEL'],
                },
                ],
                type: 'text',
            }).then(async c => {
                await modal.deferReply({ ephemeral: true })
                modal.followUp({content: `Voici votre ticket : <#${c.id}>`})
                const embed = new MessageEmbed()
                    .setTitle("Ticket Kyoline graphisme de : "+ modal.member.user.username)
                    .addField("Type", firstResponse)
                    .addField("Detail", second)
                    .setColor(config.embedColor)

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

                modal.guild.channels.cache.get(config.log.logevents).send(`${modal.member.user.username} a ouvert un ticket : <#${c.id}>`)
            })
        }

        /*
        * Ticket soon
        */
        if(modal.customId === 'soon'){
            const firstResponse = modal.getTextInputValue('type')
            const second = modal.getTextInputValue('detail')

            modal.guild.channels.create(`ticket-${modal.member.user.username}`, {
                parent: config.ticket.categorieTicket,
                topic: modal.member.user.id,
                permissionOverwrites: [{
                    id: modal.member.user.id,
                    allow: ['SEND_MESSAGES', 'VIEW_CHANNEL'],
                },
                {
                    id: modal.guild.roles.everyone,
                    deny: ['VIEW_CHANNEL'],
                },
                ],
                type: 'text',
            }).then(async c => {
                await modal.deferReply({ ephemeral: true })
                modal.followUp({content: `Voici votre ticket : <#${c.id}>`})
                const embed = new MessageEmbed()
                    .setTitle("Ticket Soon art de : "+ modal.member.user.username)
                    .addField("Type", firstResponse)
                    .addField("Detail", second)
                    .setColor(config.embedColor)

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

                modal.guild.channels.cache.get(config.log.logevents).send(`${modal.member.user.username} a ouvert un ticket : <#${c.id}>`)
            })
        }

        
        /*
        * Ticket serveur
        */
        if(modal.customId === 'serveur'){
            const firstResponse = modal.getTextInputValue('detail')

            modal.guild.channels.create(`ticket-${modal.member.user.username}`, {
                parent: config.ticket.categorieTicket,
                topic: modal.member.user.id,
                permissionOverwrites: [{
                    id: modal.member.user.id,
                    allow: ['SEND_MESSAGES', 'VIEW_CHANNEL'],
                },
                {
                    id: modal.guild.roles.everyone,
                    deny: ['VIEW_CHANNEL'],
                },
                ],
                type: 'text',
            }).then(async c => {
                await modal.deferReply({ ephemeral: true })
                modal.followUp({content: `Voici votre ticket : <#${c.id}>`})
                const embed = new MessageEmbed()
                    .setTitle("Ticket création serveur de : "+ modal.member.user.username)
                    .addField("Detail", firstResponse)
                    .setColor(config.embedColor)

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

                modal.guild.channels.cache.get(config.log.logevents).send(`${modal.member.user.username} a ouvert un ticket : <#${c.id}>`)
            })
        }

    }   
}








