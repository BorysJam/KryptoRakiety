const path = require('path');
const http = require('http');
const express = require('express');
const socketio = require('socket.io');
const formatMessage = require('./utils/messages');
const formatFileMessage = require('./utils/filemessages')
const {userJoin, getCurrentUser, disconnectUser, userCheckRoom, userx} = require('./utils/users');
const app = express();
const server = http.createServer(app);
const io = socketio(server, {
    maxHttpBufferSize: 1e8
});
const admin = 'Admin KryptoRakiety';

// Set static folder
app.use(express.static(path.join(__dirname, 'public')));


//run when client connects
io.on('connection', socket =>{
    socket.emit('usercheck', userx)
    socket.on('joinRoom', ({username, room}) =>{

        const user = userJoin(socket.id, username, room);
        
        socket.join(user.room);

        socket.on('sendPriv', privName =>{
            if(privName){
            const userp = userx.find(({username}) => username === privName)
            const wysylka = username + socket.id;
            socket.emit('wysylka', wysylka)
            socket.to(userp.id).emit('privateNot', {usernamex: username, id: wysylka})
        }    
        })
        
        socket.emit('message', formatMessage(admin, `Witamy w KryptoRakiety <b>${user.username}</b>`));

    
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
        const user = getCurrentUser(socket.id);
        io.to(user.room).emit('message',formatMessage(user.username, msg));
    });
  
    
    
    socket.on('disconnect', () => {
        const user = disconnectUser(socket.id)
        
        if (user){
            io.emit('message',formatMessage(admin, `<b>${user.username}</b> Użytkownik opuścil czat`));
            io.to(user.room).emit('usersList', {
                room: user.room,
                users: userCheckRoom(user.room)
            })
            //usersList.splice(user.username)
            //io.to(user.room).emit('usersList', usersList)
           // console.log(usersList)
            
        }
        
    
    });
});

app.get('*', (req, res)=>{
    res.send('Error 404')
})


server.listen(process.env.PORT || 3000, ()=> console.log(`Server running on port: 3000`));

 
//const PORT = 3000 || process.env.PORT;

//server.listen(PORT, ()=> console.log(`Server running on port: ${PORT}`));


