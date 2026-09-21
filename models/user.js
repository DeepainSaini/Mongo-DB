const {ObjectId} = rewuire('mongodb');
const getDb = require('../util/database').getDb;

class User {
  constructor(name,email){
    this.name = name;
    this.email = email;
  }
  
  save(){

    const db = getDb();
    return db.collection('users').insertOne(this)
    .then((result)=>{
      console.log(result);
      this._id = result.insertedId;
      return this;
    })
    .catch((err)=>{
      console.log(err);
    })
  }

  static findById(userId){
     
    const db = getDB();
    return db.collection('users').find({_id : ObjectId(userId)}).next()
    .then((user)=>{
      console.log(user);
      return user;
    })
    .catch((err)=>{
      console.log(err);
    })

  }
}
module.exports = User;
