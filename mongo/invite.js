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
	// if(invit.money - number < 0){
	// 	await UserDB.findOneAndUpdate({
    //         userId: id
    //     },{
	// 		money: 0
    //     })
	// }
	return result.invite - number > 0 ? result.invite - number : 0 
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
	return result[0].invite
} 

module.exports = { addInvite, removeInvite, seeInvite };