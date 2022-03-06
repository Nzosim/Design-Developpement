const { SlashCommandBuilder } = require('@discordjs/builders'),
    { MessageEmbed } = require('discord.js'),
    db = require('../../mongo/level.js')

module.exports = {
    data: new SlashCommandBuilder()
        .setName('top')
        .setDescription('permet de voir son level'),
    async execute(interaction) {
    
        const topLevel = await db.getLeader();
        let topMessage =""
        // console.log(topLevel)
        for(let i = 0 ; i < topLevel.length ; i++){
          topMessage += i+1+". "+topLevel[i].name+"  level : "+topLevel[i].level+"  xp : "+topLevel[i].xp+"/"+db.getNeededXP(topLevel[i].level)+"\n"
        }

        console.log(topMessage)

	},
}