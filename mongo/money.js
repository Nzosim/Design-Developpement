const UserDB = require('./schema/userDB.js');

/*
* Permet d'ajouter de l'argent à un utilisateur
* @param id identifiant du membre
* @param number somme à ajouter
* @return argent après ajout
*/
async function addMoney(id, number){
    const moneyNow = await UserDB.findOneAndUpdate({
            userId: id
        },{
            $inc: {
                money: number
            }
        })
	return moneyNow.money + number
}

/*
* Permet de retirer de l'argent à un utilisateur
* @param id identifiant du membre
* @param number somme à ajouter
* @return argent après retrait
*/
async function removeMoney(id, number){
	// let moneyNow = sto.money - number >= 0 ? sto.money - number : 0
    const moneyNow = await UserDB.findOneAndUpdate({
            userId: id
        },{
			$inc: {
				money: -number
			}
        })
	if(moneyNow.money - number < 0){
		await UserDB.findOneAndUpdate({
            userId: id
        },{
			money: 0
        })
	}
	return moneyNow.money - number > 0 ? moneyNow.money - number : 0 
}

/*
* Permet de voir l'argent d'un utilisateur
* @param id identifiant du membre
* @return argent de l'utilisateur
*/
async function seeMoney(id){
	const result = await UserDB.find({
		userId: id
	})
	return result[0].money
} 

module.exports = { addMoney, removeMoney, seeMoney };