const UserDB = require('./schema/userDB.js');

/*
* Permet de connaitre l'xp nécessaire pour chaque niveau
* @param level niveau pour lequel rechercher l'xp nécessaire
* @return xp nécessaire
*/
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

/*
* Permet de connaitre le niveau d'un membre
* @param userId id du membre
* @return son niveau
*/
async function getLevel(userId){
    return await UserDB.findOne({ userId: userId })
}

/*
* Permet de connaitre le rank d'un membre
* @param membre à rechercher
* @return rank du membre
*/
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

/*
* Permet de connaitre le top 10 des membres du serveur
* @return le top 10
*/
async function getLeader(){
  return result = await UserDB.find({}).sort({
    xp: -1
  }).limit(10)
}

module.exports = { getNeededXP, addXp, getLevel, getTop, getLeader };

        