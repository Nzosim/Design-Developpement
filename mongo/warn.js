const warnDB = require('./schema/warnDB.js'),
    moment = require('moment');

/*
* Permet d'ajouter un avertissement à un utilisateur
* @param nbr numéro du warn
* @param userId identifiant de l'utilisateur
* @param raison raison de l'avertissement
* @param date date précise de l'avertissement
* @param modo modérateur 
*/
async function warn(nbr, userId, raison, date, modo){
    const user = {
        number: nbr,
    	userId: userId,
        reason: raison,
        date: date,
        modo: modo
    }
    await new warnDB(user).save()
}

/*
* Permet de connaître le nombre d'avertissement d'un utilisateur
* @param userId identifiant du membre
* @return nombre d'avertissement
*/
async function numberWarn(userId){
    const result = await warnDB.find({
    	userId: userId
    }).count();
    return result;
}

/*
* Permet de retirer un avertissement à un utilisateur
* @param userId identifiant de l'utilisateur
* @param number numéro du warn à retirer
*/
async function unwarn(userId, number){
    const numberWarn = await this.numberWarn(userId)
    if(numberWarn < number) return 1
    await warnDB.deleteOne({
        userId: userId,
        number: number
    })
    for(let i = number+1 ; i <= numberWarn ; i++){
        await warnDB.findOneAndUpdate({
        	userId: userId,
            number: i
        },{
        	$inc: {
        		number: -1
        	}
        }) 
    }
}

/*
* Permet de voir tout les avertissement d'un utilisateur
* @param userId identifiant de l'utilisateur
* @return description de ces avertissement et le nombre d'avertissement
*/
async function checkwarn(userId){
    const result = await warnDB.find({
		userId: userId
	})
    let res = "";
    for(let i = 0 ; i < result.length ; i++){
        res += "**"+result[i].number+". Raison :**\n"+result[i].reason+"\n**Date :**\n"+moment(result[i].date).fromNow()+"\n**Modérateur :**\n"+result[i].modo+"\n\n";
    }
    return res;
}

module.exports = { warn, numberWarn, unwarn, checkwarn };