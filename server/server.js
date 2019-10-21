const mongoose = require('mongoose');
const express = require('express');
var cors = require('cors');
const bodyParser = require('body-parser');
const logger = require('morgan');
const bcrypt = require('bcrypt');
const sgMail = require('@sendgrid/mail');
const path = require('path');
const saltRounds = 10;
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

// console.log('DB ROUTE:', dbRoute);

// console.log('SEND GRID API KEY:', process.env.SEND_GRID_API_KEY)
// SendGrid Setup
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

// Mongoose boilerplate
mongoose.connect(dbRoute);
mongoose.set( { useNewUrlParser: true });
mongoose.set('useNewUrlParser', true);
mongoose.set('useFindAndModify', false);
mongoose.set('useCreateIndex', true);
mongoose.set('useUnifiedTopology', true);
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

    let hash = bcrypt.hashSync(user.password, saltRounds);

    // console.log('HASH PASSWORD:', hash)

    // console.log('NEW USER DATA:', user)

    UserSchema.exists({email: user.email}, function (err, res) {
        // console.log('USER EXISTS:', res)
        if(res === false) {
            new UserSchema({name: user.name, email: user.email, password: hash }).save((err, res) => {
                if(err) {
                    // console.log('ERROR SAVING USER:', err)
                    response.send(err)
                }
                else {
                    // console.log('SUCCESS!!', res)
                    response.send(res)
                    console.log('SEND WELCOME EMAIL TO:', user.email)
                    // const msg = {
                    //     // TODO: send to user.email
                    //     to: user.email,
                    //     from: 'secret-santa-app@secretsanta.com',
                    //     subject: 'Welcome!',
                    //     text: 'Welcome to the secret santa app!',
                    //     html: `<strong>Welcome to the secret santa app!</strong>
                    //             <p>You can login with this email address and join a group, 
                    //             add items to your wishlist, 
                    //             and draw a name for secret santa.</p>
                    //             <p>Merry Christmas and Happy Holidays!</p>
                    //     `,
                    // };
                    // sgMail.send(msg);
                }
            })
        }
        else {
            response.send('user exists')
        }
    })
})

app.get('/api/user', function(req, response) {
    // console.log('GET USER REQUEST:', req.query)
    let user = req.query;

    UserSchema.findOne({email: user.email }, function (err, res) {
        if(res === null) {
            // console.log('ERROR FINDING USER')
            response.send('EMAIL ERROR')
        }
        else {
            // console.log('USER LOGIN RESULT', res)
            let compare = bcrypt.compareSync(user.password, res.password)

            if(compare) {
                response.send(res)
            }
            else {
                response.send('INVALID PASSWORD')
            }
        }
    })

})


// ITEM ROUTES

app.get('/api/getItems', function(req, response) {
    // console.log('GET USER ITEMS REQUEST:', req.query)
    let user_id = req.query.user_id;

   ItemSchema.find({user_id: user_id}, function (err, res) {
        if(res === null) {
            // console.log('ERROR FINDING USER')
            response.send(err)
        }
        else {
            // console.log('USER LOGGED IN', res)
            response.send(res)
        }
    })
})

app.get('/api/getSelectedUsersItems', function(req, response) {
    // console.log('GET SELECTED USER ITEMS REQUEST:', req.query)
    let user_id = req.query.user_id;

   ItemSchema.find({user_id: user_id}, function (err, res) {
        if(res === null) {
            // console.log('ERROR FINDING USER')
            response.send(err)
        }
        else {
            // console.log('USER LOGGED IN', res)
            response.send(res)
        }
    })
})

app.post('/api/newItem', function(req, response) {
    let item = req.body;

    // console.log('NEW ITEM SERVER:', item)

    new ItemSchema({user_id: item.user_id, description: item.description, link: item.link, notes: item.notes }).save((err, res) => {
        if(err) {
            // console.log('ERROR SAVING ITEM:', err)
            response.send(err)
        }
        else {
            // console.log('SUCCESS SAVING ITEM!', res)
            response.send(res)

            GroupSchema.find(
                {
                    'members.uidSelected' : {$eq: item.user_id }
                }, function (errs, resp) {
                    console.log('ADD USER RESPONSE:', resp)
                    console.log('ADD USER ERROR:', errs)
                    if(resp.length === 0) {
                        console.log('COULDNT FIND GROUPS WHERE USER IS SELECTED')
                        // response.send(errs)
                    }
                    else {
                        // console.log('USER ADDED TO GROUP', resp)
                        console.log('FOUND GROUPS WHERE USER WAS SELECTED')
                        // response.send(resp)
                        let userName;
                        let upperCaseName;
                        resp.map((group, index) => {
                            group.members.map((member, index) => {
                                if(member.uid === item.user_id) {
                                    userName = member.name;
                                    upperCaseName = userName.replace(/^\w/, c => c.toUpperCase());
                                }
                            })
                            group.members.map((member, index) => {
                                if(member.uidSelected === item.user_id) {
                                    // console.log('MEMBER ' + member.name + ' has selected ' + userName + ' IN GROUP ' + group.name)
                                    console.log('SEND NEW ITEM EMAIL TO:', member.email)
                                    // const msg = {
                                    //     // TODO: send to member.email
                                    //     to: member.email,
                                    //     from: 'secret-santa-app@secretsanta.com',
                                    //     subject: `New Item on ${upperCaseName}'s wishlist`,
                                    //     text: `${upperCaseName} added a new item to their wishlist.`,
                                    //     html: `<strong>${upperCaseName} added the following item to their wishlist:</strong>
                                    //               <br>
                                    //             <p>Description: ${res.description}</p>
                                    //             ${res.link !== null ? `<p>Link: ${res.link} </p>` : `<p/>`}
                                    //             <p>Notes: ${res.notes} </p>`,
                                    // };
                                    // sgMail.send(msg);
                                }
                            })
                        })
                    }
                })
        }
    })
})

app.post('/api/updateItem', function(req, response) {
    let itemId = req.body._id;
    let userId = req.body.user_id;
    let update = req.body.update;

    // console.log('ITEM TO UPDATE SERVER:', itemId)
    // console.log('UPDATE TO APPLY SERVER:', update)

    ItemSchema.findOneAndUpdate({_id: itemId}, update, function (err, res) {
        if(err) {
            // console.log('ERROR UPDATING ITEM:', err)
            response.send(err)
        }
        else {
            // console.log('SUCCESS UPDATING ITEM', res)
            response.send(res)

            GroupSchema.find(
                {
                    'members.uidSelected' : {$eq: userId }
                }, function (errs, resp) {
                    // console.log('ADD USER RESPONSE:', resp)
                    // console.log('ADD USER ERROR:', errs)
                    if(resp.length === 0) {
                        console.log('COULDNT FIND GROUPS WHERE USER IS SELECTED')
                        // response.send(errs)
                    }
                    else {
                        // console.log('USER ADDED TO GROUP', resp)
                        console.log('FOUND GROUPS WHERE USER WAS SELECTED')
                        // response.send(resp)
                        let userName;
                        let upperCaseName;
                        resp.map((group, index) => {
                            group.members.map((member, index) => {
                                if(member.uid === userId) {
                                    userName = member.name;
                                    upperCaseName = userName.replace(/^\w/, c => c.toUpperCase());
                                }
                            })
                            group.members.map((member, index) => {
                                if(member.uidSelected === userId) {
                                    // console.log('MEMBER ' + member.name + ' has selected ' + userName + ' IN GROUP ' + group.name)
                                    console.log('SEND UPDATED ITEM EMAIL TO:', member.email)
                                    
                                    // const msg = {
                                    //     // TODO: send to member.email
                                    //     to: member.email,
                                    //     from: 'secret-santa-app@secretsanta.com',
                                    //     subject: `Update to ${upperCaseName}'s wishlist`,
                                    //     text: `${upperCaseName} updated an item on their wishlist.`,
                                    //     html: `<strong>${upperCaseName} updated the following item on their wishlist:</strong>
                                    //              <br>
                                    //            <p>Description: ${update.description}</p>
                                    //            ${update.link !== null ? `<p>Link: ${update.link} </p>` : `<p/>`}
                                    //            <p>Notes: ${update.notes} </p>`,
                                    // };
                                    // sgMail.send(msg).then(() => {
                                    //     console.log('EMAIL SENT SUCCESSFULLY')
                                    // }).catch((error) => {
                                    //     console.log('ERROR SENDING EMAIL:', error)
                                    // });
                                }
                            })
                        })
                    }
                })
        }
    })
})

app.delete('/api/deleteItem', function(req, response) {
    let itemId = req.body._id;
    let userId = req.body.user_id;

    // console.log('ITEM TO DELETE:', itemId)

    ItemSchema.findOneAndDelete({_id: itemId}, function (err, res) {
        if(err) {
            // console.log('ERROR DELETING ITEM:', err)
            response.send(err)
        }
        else {
            // console.log('SUCCESS DELETING ITEM', res)
            response.send(res)

            GroupSchema.find(
                {
                    'members.uidSelected' : {$eq: userId }
                }, function (errs, resp) {
                    // console.log('ADD USER RESPONSE:', resp)
                    // console.log('ADD USER ERROR:', errs)
                    if(resp.length === 0) {
                        console.log('COULDNT FIND GROUPS WHERE USER IS SELECTED')
                        // response.send(errs)
                    }
                    else {
                        // console.log('USER ADDED TO GROUP', resp)
                        console.log('FOUND GROUPS WHERE USER WAS SELECTED')
                        // response.send(resp)
                        let userName;
                        let upperCaseName;
                        resp.map((group, index) => {
                            group.members.map((member, index) => {
                                if(member.uid === userId) {
                                    userName = member.name;
                                    upperCaseName = userName.replace(/^\w/, c => c.toUpperCase());
                                }
                            })
                            group.members.map((member, index) => {
                                if(member.uidSelected === userId) {
                                    // console.log('MEMBER ' + member.name + ' has selected ' + userName + ' IN GROUP ' + group.name)
                                    console.log('SEND DELETED ITEM EMAIL TO:', member.email)
                                    // const msg = {
                                    //     // TODO: send to member.email
                                    //     to: member.email,
                                    //     from: 'secret-santa-app@secretsanta.com',
                                    //     subject: `${upperCaseName}'s deleted an item from their wishlist`,
                                    //     text: `${upperCaseName} deleted an item from their wishlist.`,
                                    //     html: `<strong>${upperCaseName} deleted the following item from their wishlist:</strong>
                                    //              <br>
                                    //            <p>Description: ${res.description}</p>
                                    //            ${res.link !== null ? `<p>Link: ${res.link} </p>` : `<p/>`}
                                    //            <p>Notes: ${res.notes} </p>`,
                                    // };
                                    // sgMail.send(msg);
                                }
                            })
                        })
                    }
                })
        }
    })

})



// GROUP ROUTES

app.post('/api/newGroup', function(req, response) {
    let group = req.body.data;

    console.log('GROUP:', group)

    let hash = bcrypt.hashSync(group.password, saltRounds);

    GroupSchema.exists({name: group.name}, function (err, res) {
        // console.log('GROUP ALREADY EXISTS:', res)
        if(res === false) {
            new GroupSchema({
                admin: group.admin, 
                name: group.name, 
                password: hash, 
                memberCount: group.memberCount - 1, 
                members: [{uid: group.admin, name: group.adminName, email: group.adminEmail, selected: false, selectedBy: null, uidSelected: null }]}).save((err, res) => {
                if(err) {
                    // console.log('ERROR CREATING GROUP:', err)
                    response.send(err)
                }
                else {
                    // console.log('SUCCESS!! GROUP CREATED', res)
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

    // console.log('REQUEST :', request)

    GroupSchema.findOne({ name: request.group }, function (err, res) {
            // console.log('FIND GROUP RESPONSE:', res)
            // console.log('FIND GROUP ERROR:', err)
            if(res === null) {
                // console.log('ERROR FINDING GROUP')
                response.send('ERROR FINDING GROUP')
            }
            else if(res.members.some(e => e.uid === request.uid)) {
                response.send("YOU'VE ALREADY JOINED THIS GROUP")
            }
            else if (res.memberCount === 0) {
                response.send('GROUP IS FULL')
            }
            else {
                let compare = bcrypt.compareSync(request.password, res.password)

                if(compare) {
                    // console.log('PASSWORDS MATCH')
                    GroupSchema.findOneAndUpdate(
                        {
                            name: request.group, 
                            password: res.password, 
                            memberCount: {$gte: 1 }, 
                            'members.uid' : {$ne: request.uid} 
                        }, 
                        {
                            $inc: { memberCount: -1 },
                            $push: {members: {uid: request.uid, name: request.name, email: request.email, selected: false, selectedBy: null, uidSelected: null } }
                        },
                        { new: true}
                        , function (errs, resp) {
                            // console.log('ADD USER RESPONSE:', resp)
                            // console.log('ADD USER ERROR:', errs)
                            if(resp === null) {
                                // console.log('ERROR ADDING USER')
                                response.send(errs)
                            }
                            else {
                                console.log('USER ADDED TO GROUP', resp)
                                response.send(resp)

                                let userName;
                                let upperCaseGroup = resp.name.replace(/^\w/, c => c.toUpperCase());
                                let upperCaseName = request.name.replace(/^\w/, c => c.toUpperCase());;

                                resp.members.map((member, index) => {
                                    if(member.uid === resp.admin) {
                                        console.log('SEND MEMBER JOINED EMAIL TO:', member.email)
                                        // const msg = {
                                        //     // TODO: send to member.email
                                        //     to: member.email,
                                        //     from: 'secret-santa-app@secretsanta.com',
                                        //     subject: `${upperCaseName} has joined the ${upperCaseGroup} group.`,
                                        //     text: `${upperCaseName} has joined the ${upperCaseGroup} group.`,
                                        //     html: `<strong>${upperCaseName} has joined the ${upperCaseGroup} group.</strong>`,
                                        // };
                                        // sgMail.send(msg);
                                    }
                                })

                                if(resp.memberCount === 0) {
                                    resp.members.map((member, index) => {
                                        console.log('SEND DRAWING READY EMAIL TO:', member.email)
                                        // const msg = {
                                        //     // TODO: send to member.email
                                        //     to: member.email,
                                        //     from: 'secret-santa-app@secretsanta.com',
                                        //     subject: `Name drawing for ${upperCaseGroup} group.`,
                                        //     text: `The ${upperCaseGroup} group is now full.`,
                                        //     html: `<strong>The ${upperCaseGroup} group is now full and ready for you to draw a name!</strong>`,
                                        // };
                                        // sgMail.send(msg);
                                })
                                }
                            }
                        })
                }
                else {
                    // console.log('INVALID PASSWORD')  
                    response.send('INVALID PASSWORD')
                }
            }
        })
})

app.delete('/api/deleteGroup', function(req, response) {
    let groupId = req.body._id;

    // console.log('GROUP:', groupId)

    GroupSchema.findOneAndDelete({_id: groupId}, function (err, res) {
        if(err) {
            // console.log('ERROR DELETING GROUP:', err)
            response.send(err)
        }
        else {
            // console.log('SUCCESS DELETING GROUP', res)
            response.send(res)

            let groupAdmin;
            let upperCaseGroup = res.name.replace(/^\w/, c => c.toUpperCase());
            let upperCaseName;

            res.members.map((member, index) => {
                if(member.uid === res.admin) {
                    groupAdmin = member.name;
                    upperCaseName = groupAdmin.replace(/^\w/, c => c.toUpperCase());
                }
            })
            res.members.map((member, index) => {
                console.log('SEND GROUP DELETED EMAIL TO:', member.email)
                // const msg = {
                //     // TODO: send to member.email
                //     to: member.email,
                //     from: 'secret-santa-app@secretsanta.com',
                //     subject: `The ${upperCaseGroup} group was deleted`,
                //     text: `The ${upperCaseGroup} group was deleted`,
                //     html: `<strong>The ${upperCaseGroup} group was deleted. Contact ${upperCaseName} for details.</strong>`,
                // };
                // sgMail.send(msg);
            })
        }
    })
})

app.post('/api/selectUser', function(req, response) {
    let groupId = req.body.group_id;
    let userId = req.body.user_id;

    // console.log(groupId)
    // console.log(userId)

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
            // console.log('ERROR SELECTING USER:', err)
            response.send(err)
        }
        else if (res === null ) {
            // console.log('ERROR SELECTING USER:', res)
            response.send(res)
        }
        else {
            // console.log('SUCCESS SELECTING USER:', res)
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
                            // console.log('UPDATE USER RESPONSE:',res)
                        }
                        else {
                            // console.log('UPDATE USER ERROR:',error)
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

    // console.log('GROUP ID:', groupId)
    // console.log('USER ID:', userId)

    let userName;
    let upperCaseName;
    let upperCaseGroup;
    let groupAdmin;

    GroupSchema.findOne(
        {
            _id: groupId,
            'members.uid' : {$in: userId}
        }, function (error, resp) {
            console.log('RESPONSE:', resp)
            upperCaseGroup = resp.name.replace(/^\w/, c => c.toUpperCase());

            if(resp) {
                resp.members.map((member, index) => {
                    if(member.uid === resp.admin) {
                        groupAdmin = member.name;
                    }
                    if(member.uid === userId) {
                        userName = member.name;
                        upperCaseName = userName.replace(/^\w/, c => c.toUpperCase());
                        console.log('SEND 1st DELETED MEMBER EMAIL TO:', member.email)
                        // const msg = {
                        //     // TODO: send to member.email
                        //     to: member.email,
                        //     from: 'secret-santa-app@secretsanta.com',
                        //     subject: `${upperCaseName} removed from ${upperCaseGroup} group`,
                        //     text: `You were removed from the ${upperCaseGroup} group.`,
                        //     html: `<strong>You were removed from the ${upperCaseGroup} group. Contact ${groupAdmin}, the group admin, for details.</strong>`,
                        // };
                        // sgMail.send(msg);
                    }
                })

                GroupSchema.findOneAndUpdate(
                    {
                        _id: groupId,
                        'members.uid' : {$in: userId }
                    }, 
                    {
                        $inc: { memberCount: 1 },
                        $pull: {members: {uid: userId } }
                    }
                    , {new: true}, function (err, res) {
                        if(res) {
                            // console.log('RESPONSE:', res)
                            // response.send(res);

                            res.members.map((member, idx) => {
                                console.log('SEND 2nd DELETED MEMBER EMAIL TO:', member.email)
                                // const msg = {
                                //     // TODO: send to member.email
                                //     to: member.email,
                                //     from: 'secret-santa-app@secretsanta.com',
                                //     subject: `${upperCaseName} removed from ${upperCaseGroup} group`,
                                //     text: `${upperCaseName} was removed from the ${upperCaseGroup} group.`,
                                //     html: `<strong>${upperCaseName} was removed from the ${upperCaseGroup} group. 
                                //         You will have to login and redraw a name for this group once all members have joined.</strong>`,
                                // };
                                // sgMail.send(msg);

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
                                            // console.log('UPDATE MEMBER RESPONSE:',res)
                                        }
                                        else {
                                            // console.log('UPDATE MEMBER ERROR:',error)
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
                                            // console.log('UPDATE MEMBER RESPONSE TWO:',res)
                                        }
                                        else {
                                            // console.log('UPDATE MEMBER ERROR TWO:',error)
                                        }
                                    })
                                }
                            })
                            response.send(res)
                        }
                        else {
                            // console.log('ERROR:', err)
                            response.send(err)
                        }
                })
            }
            if(error) {
                console.log('DELETE MEMBER ERROR')
            }

        })

    
})

app.post('/api/clearSelections', function(req, response) {
    let groupId = req.body.data.group_id;

    // console.log('GROUP ID:', groupId)
    let update = {
        $set: {'members.$[].uidSelected': null, 'members.$[].selectedBy': null, 'members.$[].selected': false }
    }

    GroupSchema.findOneAndUpdate({
        _id: groupId
    }, update, {new: true}, function (error, resp) {
        if(resp) {
            // console.log('UPDATE MEMBERS RESPONSE:',resp)
            response.send(resp);

            // if clearing selections from menu, send email to group members
            if(!req.body.data.removingMember) {
                let groupAdmin;
                let upperCaseGroup = resp.name.replace(/^\w/, c => c.toUpperCase());
    
    
                resp.members.map((member, idx) => {
                    if(member.uid === resp.admin) {
                        groupAdmin = member.name.replace(/^\w/, c => c.toUpperCase());
                    }
                })
                resp.members.map((member, idx) => {
                    console.log('SEND RESET DRAWING EMAIL TO:', member.email)
                    // const msg = {
                    //     // TODO: send to member.email
                    //     to: member.email,
                    //     from: 'secret-santa-app@secretsanta.com',
                    //     subject: `Name drawing reset for the ${upperCaseGroup} group`,
                    //     text: `${groupAdmin} has reset the name drawing for the ${upperCaseGroup} group`,
                    //     html: `<strong>${groupAdmin} has reset the name drawing for the ${upperCaseGroup} group. 
                    //     You will have to login and redraw a name for this group once all members have joined.</strong>`,
                    // };
                    // sgMail.send(msg);
                })
            }
        }
        else {
            // console.log('UPDATE MEMBERS ERROR:',error);
            response.send(error);
        }
    })
})


app.get('/api/getUserGroups', function(req, response) {
    // console.log('GET USER GROUPS REQUEST:', req.query)
    let user_id = req.query.user_id;

   GroupSchema.find( {$or: [ {admin: user_id} ,{ 'members.uid' : {$eq: user_id} }] }, function (err, res) {
        if(res === null) {
            // console.log('ERROR FINDING GROUPS')
            response.send(err)
        }
        else {
            // console.log('GROUPS FOUND', res)
            response.send(res)
        }
    })
})

app.use(express.static(path.join(__dirname, '../build')));

app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname + "../build/index.html"));
})


app.listen(API_PORT, () => console.log(`LISTENING ON PORT ${API_PORT}`));