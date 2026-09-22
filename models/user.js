const {ObjectId} = require('mongodb');
const getDb = require('../util/database').getDb;

class User {
  constructor(name,email,cart,id){
    this.name = name,
    this.email = email,
    this.cart = cart, // {items : []}
    this._id = id

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

  addToCart(product){
    
    const db = getDb();
    const cart = this.cart || {items : []};
    const existingItemIndex = cart.items.findIndex((item) => {
      return item.productId.toString() === product._id.toString()
    });

    if(existingItemIndex >= 0){
      cart.items[existingItemIndex].quantity += 1;
    }
    else{
      cart.items.push({
        productId: new ObjectId(product._id),
        quantity: 1
      });
    }

    return db.collection('users').updateOne(
      {_id : new ObjectId(this._id)}, 
      {$set : {cart : cart}}
    );
  } 

  getCart(){

    const db = getDb();
    const productIds = this.cart.items.map((i) => {
      return i.productId;
    })

    return db.collection('products')
    .find({_id : {$in : productIds}})
    .toArray()
    .then((products) => {
      return products.map((p) => {
        return {
          ...p,
          quantity: this.cart.items.find((i) => {
            return i.productId.toString() === p._id.toString();
          }).quantity
        }
      })
    })
  }

  deleteCartItem(prodId){

    const db = getDb();
    const cart = this.cart;
    const updatedCart = cart.items.filter((i) => {
      return i.productId.toString() !== prodId.toString()
    })

    return db.collection('users').updateOne(
      {_id : new ObjectId(this._id)},
      {$set : {cart : {items : updatedCart}}}
    )
  }

  addOrder(){
    const db = getDb();
    return this.getCart().then((products) => {
      const order = {
        items: products,
        user: {
          _id: this._id,
          name: this.name
        }
      };
      return db.collection('orders').insertOne(order)
    })
    .then((result) => {
      this.cart = {items: []};
      return db.collection('users').updateOne(
        {_id : new ObjectId(this._id)},
        {$set : {cart : {items : []}}}
      );
    });
  }

  getOrders(){
    const db = getDb();
    return db.collection('orders')
    .find({'user._id': new ObjectId(this._id)})
    .toArray()
  }

  static findById(userId){
     
    const db = getDb();
    return db.collection('users').find({_id : new ObjectId(userId)}).next()
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
