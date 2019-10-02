const mongoose = require('mongoose');
const express = require('express');
var cors = require('cors');
const bodyParser = require('body-parser');
const logger = require('morgan');
const ItemSchema = require('./Models/ItemSchema/schema');
const UserSchema = require('./Models/UserSchema/schema');

// Setup port and express
const API_PORT = process.env.PORT || 3001;
const app = express();
app.use(cors());

// MongoDB database route
const dbRoute =
  'mongodb+srv://mdwat90:david101490@cluster0-weq4s.mongodb.net/test?retryWrites=true&w=majority';

// Mongoose boilerplate
mongoose.connect(dbRoute, { useNewUrlParser: true });
let db = mongoose.connection;
db.once('open', () => console.log('connected to the database'));
db.on('error', console.error.bind(console, 'MongoDB connection error:'));


// bodyParser boilerplate
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(logger('dev'));


app.post('/api/newUser', function(req, response) {
    let user = req.body.data;

    UserSchema.exists({name: user.name}, function (err, res) {
        console.log('USER EXISTS:', res)
        if(res === false) {
            new UserSchema({name: user.name, password: user.password}).save((err, res) => {
                if(err) {
                    console.log('ERROR SAVING USER:', err)
                    response.send(err)
                }
                else {
                    console.log('SUCCESS!!', res)
                    response.send(res)
                }
            })
        }
        else {
            response.send('user exists')
        }
    })
})

app.get('/api/user', function(req, response) {
    console.log('GET USER REQUEST:', req.query)
    let user = req.query;

   UserSchema.findOne({name: user.name, password: user.password}, function (err, res) {
        if(res === null) {
            console.log('ERROR FINDING USER')
            response.send(err)
        }
        else {
            console.log('USER LOGGED IN', res)
            response.send(res)
        }
    })
})

app.get('/api/getItems', function(req, response) {
    console.log('GET USER ITEMS REQUEST:', req.query)
    let user_id = req.query.user_id;

   ItemSchema.find({user_id: user_id}, function (err, res) {
        if(res === null) {
            console.log('ERROR FINDING USER')
            response.send(err)
        }
        else {
            console.log('USER LOGGED IN', res)
            response.send(res)
        }
    })
})

app.post('/api/newItem', function(req, response) {
    let item = req.body;

    console.log('NEW ITEM SERVER:', item)

    new ItemSchema({user_id: item.user_id, link: item.link }).save((err, res) => {
        if(err) {
            console.log('ERROR SAVING ITEM:', err)
            response.send(err)
        }
        else {
            console.log('SUCCESS SAVING ITEM!', res)
            response.send(res)
        }
    })
})

app.post('/api/updateItem', function(req, response) {
    let itemId = req.body._id;
    let update = req.body.update;


    ItemSchema.findOneAndUpdate({_id: itemId}, update, function (err, res) {
        if(err) {
            console.log('ERROR UPDATING ITEM:', err)
            response.send(err)
        }
        else {
            console.log('SUCCESS UPDATING ITEM', res)
            response.send(res)
        }
    })


})

app.delete('/api/deleteItem', function(req, response) {
    let itemId = req.body._id;

    console.log('ITEM TO DELETE:', itemId)

    ItemSchema.findOneAndDelete({_id: itemId}, function (err, res) {
        if(err) {
            console.log('ERROR DELETING ITEM:', err)
            response.send(err)
        }
        else {
            console.log('SUCCESS DELETING ITEM', res)
            response.send(res)
        }
    })

})


app.listen(API_PORT, () => console.log(`LISTENING ON PORT ${API_PORT}`));