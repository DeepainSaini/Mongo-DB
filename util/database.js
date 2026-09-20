const mongodb = require('mongodb');
const mongoClient = mongodb.MongoClient;

let _db;

const mongoConnect  = (callback) => {
   
  mongoClient.connect(
  'mongodb+srv://Ajay:Ajay1234@cluster0.xghddon.mongodb.net/shop?appName=Cluster0'
  )
  .then((client)=>{
    console.log("Connected!");
    _db = client.db()
    callback();
  })
  .catch((err)=>{
    console.log(err);
  })
};

const getDb = () => {

  if(_db){
    return _db;
  }

  throw "No database found!";
}

exports.mongoConnect = mongoConnect;
exports.getDb = getDb;