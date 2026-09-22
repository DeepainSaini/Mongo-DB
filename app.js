const path = require('path');

const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const errorController = require('./controllers/error');
const User = require('./models/user');

const app = express();

app.set('view engine', 'ejs');
app.set('views', 'views');

const adminRoutes = require('./routes/admin');
const shopRoutes = require('./routes/shop');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

app.use((req, res, next) => {
  User.findById("6ab2e5a8f3eff27620f465bc")
    .then(user => {
      req.user = user;
      next();
    })
    .catch(err => console.log(err));
  
});

app.use('/admin', adminRoutes);
app.use(shopRoutes);

app.use(errorController.get404);

mongoose.connect('mongodb+srv://Ajay:Ajay1234@cluster0.xghddon.mongodb.net/shop?appName=Cluster0')
.then((result) =>{

  User.findOne().then((user) => {
    if(!user){
      const user = new User({
        name: "John Doe",
        email: "john@gmail.com",
        cart: {
          items: []
        }
      })

      user.save();
    }

    app.listen(3000);
    console.log("Connected!");
  })
 
})
.catch((err) => {
  console.log(err);
})