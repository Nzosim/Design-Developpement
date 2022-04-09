const db = require('../mongo/level.js'),
        dbU = require('../mongo/user.js'),
        { MessageEmbed, MessageButton, MessageActionRow } = require('discord.js'),
        config = require('../config.json'),
        AntiSpam = require("discord-anti-spam"),
        Discord = require('discord.js');

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


/*
* Permet d'indiquer à messageDelete que le bot a supprimé le message et que ce n'est pas un utilisateur
*/
let delBot = false;
function del(){
        return delBot
}

module.exports = {
        name: 'messageCreate',
	async execute(message) {

                if(message.author.bot) return
                        
                /*
                * Ajoute à la base de données les personnes qui n'y sont pas 
                */
                dbU.exist(message.author.id, message.author.username)

                /*
                * Anti-lien
                */
                for(let i = 0 ; i < config.antiLien.length ; i++){
                        if(message.content.includes(config.antiLien[i]) && message.author.id != message.guild.ownerId){
                                if(message.channel.name.includes("ticket-")) return
                                delBot = true
                                message.channel.send('Les liens sont interdit !')
                                message.guild.channels.cache.get(config.log.logevents).send({embeds: [new MessageEmbed()
                                        .setTitle('**Anti Lien**')
                                        .setDescription(`${message.author} à envoyé : \n\n> ${message.content}`)]})
                                return message.delete()
                        }
                }

                /*
                * Système de level
                */
                await db.addXp(message.author.id, 23, message)

                /*
                * Système de sugestion
                */
                if(message.channel.id == config.sugestion){
                        delBot = true
                        const mess = message.content
                        const author = message.author

                        const embed = new MessageEmbed()
                                .setColor(config.embedColor)
                                .setAuthor(
                                {
                                        name: `Suggestion de ${author.tag}`, 
                                        iconURL: author.displayAvatarURL()
                                })
                                .setDescription(mess)
                        message.channel.send({embeds: [embed]})
                                .then(msg => {
                                        msg.react('✅')
                                        msg.react('❌')
                                        message.delete()
                                })
                }

                /*
                * Système anti-spam
                */ 
                antiSpam.message(message)

                /*
                * Explication système recrutement serveur
                */ 
                if(message.content === `${config.prefix}recrutement`){
                        if(message.author.id != message.guild.ownerId) return message.reply("Vous n'avez pas la permission pour effectuer cette commande !")
                        delBot = true;
                        const embed = new MessageEmbed()
                                .setTitle("**Explication fonctionnement du serveur :**")
                                .setColor(config.embedColor)
                                .setDescription("Pour chaque catégorie de services proposé sur le serveur (graphismes, developpement, ...)"
                                        +" il peut y avoir plusieurs personnes qui les proposent, vous aurez chacun votre channel avec vos tarifs et des exemples de vos créations"
                                        +"**\n\nRémunération :**\nComme c'est nous qui nous occupons de trouver vos clients et d'obtenir des commandes sur le serveur\n"
                                        +"- Nous prenons 20% de ce que vous rapportes chaque commande passé sur le serveur\n- Sauf si vous avez un nombre d'invitation supérieur\n"
                                        +" à 10, nous considérons que vous ramenez de potentiels clients donc vous gardez 100% de vos revenus")

                        message.channel.send({embeds: [embed]});
                        message.delete();
                }

                /*
                * Creation message et ticket recrutement
                */
                if(message.content === `${config.prefix}recrutement-create`){
                        if(message.author.id != message.guild.ownerId) return message.reply("Vous n'avez pas la permission pour effectuer cette commande !")
                        const embed = new MessageEmbed()
                                .setTitle("**__Recrutement :__**")
                                .setColor(config.embedColor)
                                .setDescription("**Design & Developpement recrute :**\n\n- 1 graphistes\n- 1 développeur de plugins et mods minecraft\n- 1 développeur web\n"
                                        +"- 1 développeur FIVEM\n- 1 monteur\n\n**Si vous êtes intéressé par un des postes ci-dessus ou si vous pensez que vous pouvez être utile pour le serveur, "
                                        +"veuillez ouvrir un ticket en cliquant sur le bouton ci-dessous**")
                        const row = new MessageActionRow()
                                .addComponents(new MessageButton()
                                        .setCustomId('recrutement')
                                        .setLabel('POSTULER')
                                        .setEmoji('✉️')
                                        .setStyle('PRIMARY'),
                                )

                        message.channel.send({
                                embeds: [embed],
                                components: [row]
                        })
                        message.delete()
                }

                /*
                * Creation message et ticket support
                */
                if(message.content === `${config.prefix}support-create`){
                        if(message.author.id != message.guild.ownerId) return message.reply("Vous n'avez pas la permission pour effectuer cette commande !")
                        const embed = new MessageEmbed()
                                .setTitle("**Ticket Support**")
                                .setColor(config.embedColor)
                                .setDescription("Cliquez sur le bouton ci-dessous pour ouvrir un ticket\nLes abus seront sanctionnés")
                        const row = new MessageActionRow()
                                .addComponents(new MessageButton()
                                        .setCustomId('support')
                                        .setLabel('Ouvrir un ticket')
                                        .setEmoji('✉️')
                                        .setStyle('PRIMARY'),
                                )

                        message.channel.send({
                                embeds: [embed],
                                components: [row]
                        })
                        message.delete()
                }

                /*
                * Creation message et ticket commande bot discord
                */
                if(message.content === `${config.prefix}bot-create`){
                        if(message.author.id != message.guild.ownerId) return message.reply("Vous n'avez pas la permission pour effectuer cette commande !")
                        const embed = new MessageEmbed()
                                .setTitle("**Création de bot discord personnalisé**")
                                .setColor(config.embedColor)
                                .setDescription("**Langage :** JavaScript\n\n**Tarifs :**\nIl y a deux façon de payer un bot discord :\n- Via un nombre d'invitations à effectuer sur le serveur\n- Via PayPal"+
                                        "\n\n**Mes competences :**\nJe suis capable de faire presque n'importe quel bot avec discordjs en v12 ou v13 :\n- Moderation\n- Anti-Raid\n- Anti-Spam\n- Système de niveau\n"+
                                        "- Système d'economie\n- Système de musique\n- Ticket\n- Message de bienvenue\n- AutoRole\n- ...\n\nJe maitrise également les derniers ajouts de la v13 comme les Boutons,"+
                                        " les SlashCommandes, les selectMenus, les formulaires, ...\n\n**Je ne m'occupe pas de l'hébergement des bots discord**")
                        const row = new MessageActionRow()
                                .addComponents(new MessageButton()
                                        .setCustomId('bot')
                                        .setLabel('Ouvrir un ticket')
                                        .setEmoji('✉️')
                                        .setStyle('PRIMARY'),
                                )

                        message.channel.send({
                                embeds: [embed],
                                components: [row]
                        })
                        message.delete()
                }

                /*
                * Creation message nous-soutenir
                */
                if(message.content === `${config.prefix}soutien-create`){
                        if(message.author.id != message.guild.ownerId) return message.reply("Vous n'avez pas la permission pour effectuer cette commande !")
                        const embed = new MessageEmbed()
                                .setTitle("**La meilleure façon de nous soutenir est de faire de la pub pour notre serveur**")
                                .setColor(config.embedColor)
                                .setDescription("```⚀⚁⚂⚃⚄⚅ **Design & Développement** ⚅⚄⚃⚂⚁⚀\n\n🪙 **__Nos services :__**\n    - Graphisme -> `(logo, overlay, emoji, ...)`\n    - Bot discord -> `(JavaScript)`\n    - Serveur discord\n    - Site web -> \n    - Mod et plugin Minecraft -> `(prochainement)`\n    - Plugin FiveM -> `(prochainement)`\n\n📝 **__Recrutements :__**\n    - Createur serveur discord\n    - Developpeur FiveM\n    - Developpeur Minecraft\n    - Graphiste\n    - Monteur\n\n**Nous sommes actuellement à la recherche de partenaire**\n\nInvitation : https://discord.gg/UfUAFdJ2WH\nBannière : https://imgur.com/a/EXQieTa```")

                        message.channel.send({
                                embeds: [embed]
                        })
                        message.delete()
                }

                /*
                * Creation message et ticket commande site web
                */
                if(message.content === `${config.prefix}web-create`){
                        if(message.author.id != message.guild.ownerId) return message.reply("Vous n'avez pas la permission pour effectuer cette commande !")
                        const embed = new MessageEmbed()
                                .setTitle("🖥️ **Création de site web**")
                                .setColor(config.embedColor)
                                .setDescription("Je met à disposition mes compétences en développement web pour la réalisation de sites web entiers responsive, plus ou moins complexes."+
                                        "Veuillez noter que je ne m'occupe pas de la partie backend (côté serveur), cela signifie donc que les sites que je propose sont des sites dits \"vitrines\""+
                                        " sans système de comptes, forums, ou je ne sais quoi, impliquant donc que la majorité du contenu est statique.\n\n🪙 **Technologies utilisées**\n- HTML5 (HTML, CSS et JS)\n"+
                                        "- VueJS (dont Vue Router et VueX)\n- Vuetify\n- Cloudflare (dont la totalité des outils webmaster, ainsi que Cloudflare Pages et Cloudflare Workers)\n\nVeuillez noter que j'ai eu l'occasion de travailler sur beaucoup plus"+
                                        " de projets, mais que ces derniers sont désormais pour la plupart hors ligne.\n\n💰 **Tarifs**\nIl est impossible de donner un prix avant de connaître votre projet, mes tarifs sont donc par conséquent"+
                                        " variables, mais restent dans des tranches « bon marché ».\nQuoiqu'il en soit, le règlement se fera via PayPal, et les modalités (paiement instantané, en plusieurs fois, etc...) sont à discuter.\n\n"+
                                        "⚠️ **ATTENTION**\n- Je ne m'occupe pas de l'hébergement de votre site\n- Pour un tarif fixe de 5€, je peux mettre en place un hébergement gratuit sur votre compte Cloudflare via Cloudflare Pages"+
                                        ", incluant l'entière configuration de Cloudflare pour le bon fonctionnement de votre site\n- Je ne m'occupe pas de la maintenance de votre site, ni de votre hébergement. Si un problème survient suite"+
                                        " à des modifications, vous en êtes responsable.\n- Si vous souhaitez effectuer des modifications sur le site après sa livraison, il est totalement possible de me confier à nouveau votre projet.")
                        const row = new MessageActionRow()
                                .addComponents(new MessageButton()
                                        .setCustomId('web')
                                        .setLabel('Ouvrir un ticket')
                                        .setEmoji('✉️')
                                        .setStyle('PRIMARY'),
                                )

                        message.channel.send({
                                embeds: [embed],
                                components: [row]
                        })
                        message.delete()
                }

                /*
                * Creation message et ticket commande kyolin
                */
                 if(message.content === `${config.prefix}kyoline-create`){
                        if(message.author.id != message.guild.ownerId) return message.reply("Vous n'avez pas la permission pour effectuer cette commande !")

                        const embed = new MessageEmbed()
                                .setImage("https://cdn.discordapp.com/attachments/955464773397544961/955528165713903616/fond_YT.jpg")
                                .setColor(config.embedColor)
                        const embed2 = new MessageEmbed()
                                .setImage("https://cdn.discordapp.com/attachments/955464773397544961/955528165416124446/banniereTJ.jpg")
                                .setColor(config.embedColor)
                        const embed3 = new MessageEmbed()
                                .setImage("https://cdn.discordapp.com/attachments/955464773397544961/955528166015926352/POV-1.jpg")
                                .setColor(config.embedColor)
                        const embed4 = new MessageEmbed()
                                .setTitle("**Kyoline graphisme**")
                                .setColor(config.embedColor)
                                .setDescription("**__Tarifs :__**\n\nLogo -> 5€\nBannière (site, twitch, discord) -> 7€\nBouton personnalisés -> 7€\nOverlay -> 7€\nPack Twitch (bouton, overlay, bannière) -> 19€ (logo non compris)\n\n**Toutes créations possible, il suffit d'en faire la demande !**")
                        const row = new MessageActionRow()
                                .addComponents(new MessageButton()
                                        .setCustomId('kyoline')
                                        .setLabel('Ouvrir un ticket')
                                        .setEmoji('✉️')
                                        .setStyle('PRIMARY'),
                                )

                        message.channel.send({
                                embeds: [embed, embed2, embed3, embed4],
                                components: [row]
                        })
                        message.delete()
                }

                /*
                * Creation message et ticket commande soon
                */
                if(message.content === `${config.prefix}soon-create`){
                        if(message.author.id != message.guild.ownerId) return message.reply("Vous n'avez pas la permission pour effectuer cette commande !")

                        const embed = new MessageEmbed()
                                .setImage("https://cdn.discordapp.com/attachments/688806403539992660/955198400360497153/Antivol3.png")
                                .setColor(config.embedColor)
                        const embed2 = new MessageEmbed()
                                .setImage("https://cdn.discordapp.com/attachments/688806403539992660/955198314092036096/Antivol.jpg")
                                .setColor(config.embedColor)
                        const embed3 = new MessageEmbed()
                                .setImage("https://cdn.discordapp.com/attachments/688806403539992660/955198448976674856/Antivol2.jpg")
                                .setColor(config.embedColor)
                        const embed4 = new MessageEmbed()
                                .setTitle("**Soon art**")
                                .setColor(config.embedColor)
                                .setDescription("**__Tarifs :__**\n\nLogo -> 1€\nBannière de profil -> 3€\nBannière serveur discord -> 4€\nEmojis discord -> 1€\n\n**__Prochainement :__**\nPanels twitch -> 7€ le tout")
                        const row = new MessageActionRow()
                                .addComponents(new MessageButton()
                                        .setCustomId('soon')
                                        .setLabel('Ouvrir un ticket')
                                        .setEmoji('✉️')
                                        .setStyle('PRIMARY'),
                                )

                        message.channel.send({
                                embeds: [embed, embed2, embed3, embed4],
                                components: [row]
                        })
                        message.delete()
                }

                /*
                * Creation message et ticket commande serveur
                */
                if(message.content === `${config.prefix}serveur-create`){
                        if(message.author.id != message.guild.ownerId) return message.reply("Vous n'avez pas la permission pour effectuer cette commande !")

                        const embed = new MessageEmbed()
                                .setTitle("**Kayfox**")
                                .setColor(config.embedColor)
                                .setDescription("**__Tarifs :__**\n\nServeur discord simple, sans bot -> Gratuit\nServeur discord simple, + configuration de bot -> 1€\nServeur discord communautaire -> 3€\nServeur discord personnalisé, sur demande -> 5€")
                        const row = new MessageActionRow()
                                .addComponents(new MessageButton()
                                        .setCustomId('serveur')
                                        .setLabel('Ouvrir un ticket')
                                        .setEmoji('✉️')
                                        .setStyle('PRIMARY'),
                                )

                        message.channel.send({
                                embeds: [embed],
                                components: [row]
                        })
                        message.delete()
                }


	}, del
}