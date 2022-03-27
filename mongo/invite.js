const UserDB = require('./schema/userDB.js');

/*
* Permet d'ajouter des invitations à un utilisateur
* @param id identifiant du membre
* @param number somme à ajouter
* @return invitations après ajout
*/
async function addInvite(id, number){
    const result = await UserDB.findOneAndUpdate({
            userId: id
        },{
            $inc: {
                invite: number
            }
        })
	return result.invite + number
}

/*
* Permet de retirer des invitations à un utilisateur
* @param id identifiant du membre
* @param number somme à ajouter
* @return invitations après retrait
*/
async function removeInvite(id, number){
    const result = await UserDB.findOneAndUpdate({
        userId: id
    },{
        $inc: {
            invite: -number
        }
    })
	// return result[0].invite - number
}

/*
* Permet de voir les invitations d'un utilisateur
* @param id identifiant du membre
* @return invitations de l'utilisateur
*/ 
async function seeInvite(id){
	const result = await UserDB.find({
		userId: id
	})
	return result[0]
} 

async function addInviter(inviteID, memberID){
    const result = await UserDB.findOneAndUpdate({
        userId: memberID
    },{
        inviter: inviteID
    })
}

async function seeInviter(id){
	const result = await UserDB.find({
		userId: id
	})
    // console.log()
    return result[0].inviter
} 

module.exports = { addInvite, removeInvite, seeInvite, addInviter, seeInviter };