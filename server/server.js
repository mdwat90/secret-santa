const mongoose = require('mongoose');
const express = require('express');
var cors = require('cors');
const bodyParser = require('body-parser');
const logger = require('morgan');
const ItemSchema = require('./Models/ItemSchema/schema');
const UserSchema = require('./Models/UserSchema/schema');
const GroupSchema = require('./Models/GroupSchema/schema');

require('dotenv').config();

// Setup port and express
const API_PORT = process.env.PORT || 3001;
const app = express();
app.use(cors());

// MongoDB database route
const dbRoute = process.env.MONGO;

console.log('DB:', dbRoute)

// Mongoose boilerplate
mongoose.connect(dbRoute, { useNewUrlParser: true });
let db = mongoose.connection;
db.once('open', () => console.log('connected to the database'));
db.on('error', console.error.bind(console, 'MongoDB connection error:'));


// bodyParser boilerplate
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(logger('dev'));

// USER ROUTES

app.post('/api/newUser', function(req, response) {
    let user = req.body.data;

    // console.log('NEW USER DATA:', user)

    UserSchema.exists({name: user.name}, function (err, res) {
        console.log('USER EXISTS:', res)
        if(res === false) {
            new UserSchema({name: user.name, password: user.password }).save((err, res) => {
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


// ITEM ROUTES

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

app.get('/api/getSelectedUsersItems', function(req, response) {
    console.log('GET SELECTED USER ITEMS REQUEST:', req.query)
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

    new ItemSchema({user_id: item.user_id, description: item.description, link: item.link, notes: item.notes }).save((err, res) => {
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

    // console.log('ITEM TO UPDATE SERVER:', itemId)
    // console.log('UPDATE TO APPLY SERVER:', update)

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



// GROUP ROUTES

app.post('/api/newGroup', function(req, response) {
    let group = req.body.data;

    console.log('GROUP:', group)

    GroupSchema.exists({name: group.name}, function (err, res) {
        console.log('GROUP ALREADY EXISTS:', res)
        if(res === false) {
            new GroupSchema({
                admin: group.admin, 
                name: group.name, 
                password: group.password, 
                memberCount: group.memberCount - 1, 
                members: [{uid: group.admin, name: group.adminName, selected: false, selectedBy: null, uidSelected: null }]}).save((err, res) => {
                if(err) {
                    console.log('ERROR CREATING GROUP:', err)
                    response.send(err)
                }
                else {
                    console.log('SUCCESS!! GROUP CREATED', res)
                    response.send(res)
                }
            })
        }
        else {
            response.send('group exists')
        }
    })
})

app.post('/api/joinGroup', function(req, response) {
    let request = req.body.data;

    console.log('REQUEST :', request)

    GroupSchema.findOneAndUpdate(
        {
            name: request.group, 
            password: request.password, 
            memberCount: {$gte: 1 }, 
            'members.uid' : {$ne: request.uid} 
        }, 
        {
            $inc: { memberCount: -1 },
            $push: {members: {uid: request.uid, name: request.name, selected: false, selectedBy: null, uidSelected: null } }
        }
        , function (err, res) {
            console.log('RESPONSE:', res)
            console.log('ERROR:', err)
            if(res === null) {
                console.log('ERROR ADDING USER')
                response.send(err)
            }
            else {
                console.log('USER ADDED TO GROUP', res)
                response.send(res)
            }
        })
})

app.delete('/api/deleteGroup', function(req, response) {
    let groupId = req.body._id;

    console.log('GROUP:', groupId)

    GroupSchema.findOneAndDelete({_id: groupId}, function (err, res) {
        if(err) {
            console.log('ERROR DELETING GROUP:', err)
            response.send(err)
        }
        else {
            console.log('SUCCESS DELETING GROUP', res)
            response.send(res)
        }
    })
})

app.post('/api/selectUser', function(req, response) {
    let groupId = req.body.group_id;
    let userId = req.body.user_id;

    console.log(groupId)
    console.log(userId)

    let update = {
        $set: {'members.$.selected': true, 'members.$.selectedBy': userId}
    }

    GroupSchema.findOneAndUpdate({
        _id: groupId,
        members: {
            $elemMatch: {
                uid: {$ne: userId },
                selected: {$eq: false},
                selectedBy: {$ne: userId}
            }}
        }, update, {new: true}, function (err, res) {
        if(err) {
            console.log('ERROR SELECTING USER:', err)
            response.send(err)
        }
        else if (res === null ) {
            console.log('ERROR SELECTING USER:', res)
            response.send(res)
        }
        else {
            console.log('SUCCESS SELECTING USER:', res)
            response.send(res)

            res.members.map((member, index) => {
                if(member.selectedBy === userId) {
                    let userUpdate = {
                        $set: {'members.$.uidSelected': member.uid }
                    }
        
                    GroupSchema.findOneAndUpdate({
                        _id: groupId,
                        members: {
                            $elemMatch: {
                                uid: userId
                            }}
                    }, userUpdate, {new: true}, function (error, resp) {
                        if(res) {
                            console.log('UPDATE USER RESPONSE:',res)
                        }
                        else {
                            console.log('UPDATE USER ERROR:',error)
                        }
                    })
                }
            })
        }
    })
})

app.delete('/api/removeMember', function(req, response) {
    let groupId = req.body.group_id;
    let userId = req.body.uid;

    console.log('GROUP ID:', groupId)
    console.log('USER ID:', userId)

    GroupSchema.findOneAndUpdate(
        {
            _id: groupId,
            'members.uid' : {$in: userId}
        }, 
        {
            $inc: { memberCount: 1 },
            $pull: {members: {uid: userId } }
        }
        , {new: true}, function (err, res) {
            if(res) {
                console.log('RESPONSE:', res)

                response.send(res);

                res.members.map((member, idx) => {
                    if(member.selectedBy === userId) {
                        let update = {
                            $set: {'members.$.selected': false, 'members.$.selectedBy': null}
                        }

                        GroupSchema.findOneAndUpdate({
                            _id: groupId,
                            members: {
                                $elemMatch: {
                                    selected: {$eq: true},
                                    selectedBy:{$eq: userId}
                                }}
                        }, update, {new: true}, function (error, resp) {
                            if(res) {
                                console.log('UPDATE MEMBER RESPONSE:',res)
                            }
                            else {
                                console.log('UPDATE MEMBER ERROR:',error)
                            }
                        })
                    }
                    if(member.uidSelected === userId) {
                        let update = {
                            $set: {'members.$.uidSelected': null }
                        }

                        GroupSchema.findOneAndUpdate({
                            _id: groupId,
                            members: {
                                $elemMatch: {
                                    uidSelected: {$eq: userId}
                                }}
                        }, update, {new: true}, function (error, resp) {
                            if(res) {
                                console.log('UPDATE MEMBER RESPONSE TWO:',res)
                            }
                            else {
                                console.log('UPDATE MEMBER ERROR TWO:',error)
                            }
                        })
                    }
                })
                
            }
            else {
                console.log('ERROR:', err)
            }
    })
})

app.post('/api/clearSelections', function(req, response) {
    let groupId = req.body.data.group_id;

    console.log('GROUP ID:', groupId)
    let update = {
        $set: {'members.$[].uidSelected': null, 'members.$[].selectedBy': null, 'members.$[].selected': false }
    }

    GroupSchema.findOneAndUpdate({
        _id: groupId
    }, update, {new: true}, function (error, resp) {
        if(resp) {
            console.log('UPDATE MEMBERS RESPONSE:',resp)
            response.send(resp);
        }
        else {
            console.log('UPDATE MEMBERS ERROR:',error);
            response.send(error);
        }
    })
})


app.get('/api/getUserGroups', function(req, response) {
    console.log('GET USER GROUPS REQUEST:', req.query)
    let user_id = req.query.user_id;

   GroupSchema.find( {$or: [ {admin: user_id} ,{ 'members.uid' : {$eq: user_id} }] }, function (err, res) {
        if(res === null) {
            console.log('ERROR FINDING GROUPS')
            response.send(err)
        }
        else {
            console.log('GROUPS FOUND', res)
            response.send(res)
        }
    })
})



app.listen(API_PORT, () => console.log(`LISTENING ON PORT ${API_PORT}`));