const path = require('path');
const http = require('http');
const express = require('express');
const socketio = require('socket.io');
const formatMessage = require('./utils/messages');
const {userJoin, getCurrentUser, disconnectUser} = require('./utils/users');

const admin = 'Admin kryptorakiet';

const app = express();
const server = http.createServer(app);
const io = socketio(server);

const countUsers = io.engine.clientsCount;

// Set static folder
app.use(express.static(path.join(__dirname, 'public')));


//run when client connects

io.on('connection', socket =>{
    socket.on('joinRoom', ({username, room}) =>{

        const user = userJoin(socket.id, username, room);
        
        
        socket.join(user.room);
        
        socket.emit('message', formatMessage(admin, `Witamy w KryptoRakiety <b>${user.username}</b>`));
    
        //Broadcast when a user connects 
        socket.broadcast.to(user.room).emit('message',formatMessage(admin,  `<b>${user.username}</b> dołączył/dołączyła do czatu`));
       
    });

  

    //listen for chatMessage
    socket.on('chatMessage', msg => {
        const user = getCurrentUser(socket.id);
        io.to(user.room).emit('message',formatMessage(user.username, msg));
    });
    
    
    socket.on('disconnect', () => {
        const user = disconnectUser(socket.id)
        if (user){
            io.emit('message',formatMessage(admin, `<b>${user.username}</b> Użytkownik opuscil czat`));
            
        }

    
    });
});




server.listen(process.env.PORT || 3000, ()=> console.log(`Server running on port: 3000`));

 
//const PORT = 3000 || process.env.PORT;

//server.listen(PORT, ()=> console.log(`Server running on port: ${PORT}`));


