const UserDB = require('./schema/userDB.js');

    async function createUser(id){
        const user = {
        	userId: id,
            money: 0,
            xp: 0
        }
        await new UserDB(user).save()
    }

    async function exist(id){

        const count = await UserDB.find({
            userId: id
        }).count()

        if(count == 0) {
            createUser(id)
            return true
        }else{
            return false
        }

    }

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

	async function seeMoney(id){
		const result = await UserDB.find({
			userId: id
		})
		return result[0].money
	} 

module.exports = { createUser, exist, addMoney, removeMoney, seeMoney };


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