const warnDB = require('./schema/warnDB.js'),
    moment = require('moment');

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

    async function numberWarn(userId){
        const result = await warnDB.find({
        	userId: userId
        }).count();
        return result;
    }

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