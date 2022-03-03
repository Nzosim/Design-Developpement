const warnDB = require('./schema/warnDB.js');

    async function warn(nbr, userId, raison, date, modoId){
        const user = {
            number: nbr,
        	userId: userId,
            reason: raison,
            date: date,
            modo: modoId
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


    module.exports = { warn, numberWarn, unwarn };