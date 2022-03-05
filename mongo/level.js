const UserDB = require('./schema/userDB.js');

const getNeededXP = (level) => level * level * 100

/*
* Permet d'ajouter de l'xp à un membre
* @param memberId id du membre concerné
* @param xpToAdd xp à ajouter
* @param message dernier message envoyé par la personne
*/
async function addXp(memberId, xpToAdd, message){

    await UserDB.findOneAndUpdate({
          userId: memberId
        },{
          $inc: {
            xp: xpToAdd,
          },
        })

    const result = await UserDB.findOne({ userId: memberId })

    let xp = result.xp, level = result.level
    const needed = getNeededXP(level)
        
    if (xp >= needed) {
        level++
        xp -= needed
        message.reply(`**Félicitation !**\nVous venez de passer au level **${level}** !`)
    }

    await UserDB.updateOne({
          userId: memberId
        },
        {
          xp: xp,
          level: level,
        })

}

async function getLevel(userId){
    return await UserDB.findOne({ userId: userId })
}

async function getTop(userId){
  const result = await UserDB.find({}).sort({
    xp: -1 
  })
  let place;
  for(let i = 0 ; i < result.length ; i++){
    if(result[i].userId == userId){
      place = i+1;
      break;
    }
  }
  return place
}

module.exports = { getNeededXP, addXp, getLevel, getTop };

        