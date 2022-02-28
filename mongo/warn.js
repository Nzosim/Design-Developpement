const warnDB = require('./schema/warnDB.js');
const warnDB = require('./schema/warnDB.js');

    async function warn(userId, raison, date, modoId){
        const user = {
        	userId: userId,
            reason: raison,
            date: date,
            modo: modoId
        }
        await new warnDB(user).save()
    }