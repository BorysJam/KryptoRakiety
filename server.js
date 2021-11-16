const path = require('path');
const moment = require('moment');
const dotenv = require('dotenv');
const http = require('http');
const mongoose = require('mongoose');
const Msg = require('./utils/messagemodel');
const express = require('express');
const socketio = require('socket.io');
const formatMessage = require('./utils/messages');
const formatFileMessage = require('./utils/filemessages');
const {userJoin, getCurrentUser, disconnectUser, userCheckRoom, userx} = require('./utils/users');
moment.locale("pl")
const app = express();
const dotenvRes = dotenv.config();
const server = http.createServer(app);
const io = socketio(server, {
    maxHttpBufferSize: 1e8
});


// Set static folder
app.use(express.static(path.join(__dirname, 'public')));

const admin = 'Admin KryptoRakiety';


const mongoDB = `mongodb+srv://borysj:${process.env.mongoURI}@cluster0.x1i4d.mongodb.net/message-chat-collection?retryWrites=true&w=majority`

mongoose.connect(mongoDB, {useNewUrlParser: true, useUnifiedTopology: true}).then(()=>{
    console.log('connected to database')
}).catch(err => console.log(err))




//run when client connects
io.on('connection', socket =>{
    
    Msg.find().then(result => {
        socket.emit('output-message', result)
       
    })
    socket.emit('usercheck', userx)
    socket.on('joinRoom', ({username, room}) =>{

        const user = userJoin(socket.id, username, room);
        socket.join(user.room);
        
        setTimeout(()=>{
            socket.emit('message', formatMessage(admin, `Witamy w KryptoRakiety <b>${user.username}</b>`));
        },600)

        socket.on('sendPriv', privName =>{
            if(privName){
            var userp = userx.find(({username}) => username === privName)
            var wysylka = username + socket.id;
            
            var userID = userp.id;
            socket.emit('wysylka', {usernamex: privName ,id: wysylka, time: moment().format('MMMM Do, h:mm'), user: username})
            if(userID !== undefined){
                socket.to(userID).emit('privateNot', {usernamex: username, id: wysylka, time: moment().format('MMMM Do, h:mm')})
            }else{
                return
            }
            
        }    
        })
        
        

    
        //Broadcast when a user connects 
        socket.broadcast.to(user.room).emit('message',formatMessage(admin,  `<b>${user.username}</b> dołączył/dołączyła do czatu`));
        

       
       io.to(user.room).emit('usersList', {
           room: user.room,
           users: userCheckRoom(user.room)
       })
       socket.on('changeROOM', (privName)=>{
        socket.emit('changeURL', privName)
        
    })
       
    });
  //send image file
    socket.on('submitImage', src => {
        
        const user = getCurrentUser(socket.id);
        //Client submit an image
        io.to(user.room).emit('sentImg', formatFileMessage(user.username, src)); //the server send the image src to all clients
   
    })



    //listen for chatMessage
    socket.on('chatMessage', msg => {
        const user = getCurrentUser(socket.id)
        const socketid = socket.id;
        const username = user.username
        const room = user.room
        moment.locale('pl')
        const czas = moment().format('MMMM Do, h:mm')
        const text = msg;
        const message = new Msg({socketid, username, text, room, czas})
        message.save()
        io.to(user.room).emit('message',formatMessage(user.username, msg))
        
        
        
       
    });
  
    
    
    socket.on('disconnect', () => {
        const user = disconnectUser(socket.id)
        
        if (user){
            io.to(user.room).emit('message',formatMessage(admin, `<b>${user.username}</b> Użytkownik opuścil czat`));
            io.to(user.room).emit('usersList', {
                room: user.room,
                users: userCheckRoom(user.room)
            })
            
        }
        
    
    });
});

app.get('*', (req, res)=>{
    res.send('Error 404')
})


server.listen(process.env.PORT || 3000, ()=> console.log(`Server running on port: 3000`));

