const UserDB = require('./schema/userDB.js');

/*
* Permet d'ajouter un utilisateur à la base de données
* @param id identifiant du membre
*/
async function createUser(id, name){
    const user = {
    	userId: id,
		name: name
    }
    await new UserDB(user).save()
}

/*
* Permet de voir si un utilisateur fait partie de la base de données
* @param id identifiant du membre
* @return si oui ou non il existe
*/
async function exist(id, name){
    const count = await UserDB.find({
        userId: id
    }).count()
	let res = false
    if(count == 0) {
        createUser(id, name)
        res = true
    }
	return res
}

/*
* Permet de retirer un utilisateur de la base de données
* @param id identifiant du membre
*/
async function remove(id){
	await UserDB.deleteOne({
		userId: id
	})
}

module.exports = { createUser, exist, remove };


    // const schema = new mongoose.Schema({
    //     userId: String,
    //     money: Number,
    //     xp: Number,
    //     daily: Date,
    //     roulette: Date
    // })



	//add
	// const user = {
	// 	userId: '567890790',
    //     money: 3,
    //     xp: 54
	// }
	// await new schema(user).save()

	// find all
	// const result = await schema.find({})

	// find by id
	// const result = await schema.find({
	// 	userId: '8907zd90'
	// })

	// delete 1 
	// await schema.deleteOne({
	// 	userId: '567890790'
	// })

	// update
	// await schema.findOneAndUpdate({
	// 	userId: '890678790'
	// },{
	// 	money: 5679
	// })

	//ajout 
	// await schema.findOneAndUpdate({
	// 	userId: '890678790'
	// },{
	// 	$inc: {
	// 		xp: 1000
	// 	}
	// })

	//moins 
	// await schema.findOneAndUpdate({
	// 	userId: '890678790'
	// },{
	// 	$inc: {
	// 		xp: -200
	// 	}
	// })

	//trier
	// const result = await schema.find({}).sort({
	// 	money: -1 // plus grand au plus petit, 1 = l'inverse
	// }).limit(1) // 1 personne
	// console.log(result)

	//recherche plus de 1000 money
	// const result = await schema.find({
	// 	money: {
	// 		$gt: 5679 // gte pour sup ou equals , e pour equals, lte pour lower , exist true
	// 	}
	// })
	// console.log(result)

	//verif existe
	// const result = await schema.find({
	// 	userId: '89078790'
	// }).count()
	// if(result == 0) console.log("ya po")