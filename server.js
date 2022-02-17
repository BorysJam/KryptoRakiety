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
const {userJoin, getCurrentUser, disconnectUser, userCheckRoom, findUserPriv, returnUsers} = require('./utils/users');
const CoinGecko = require('coingecko-api');
const bodyParser = require('body-parser');
const nodemailer = require("nodemailer");
const app = express()
const dotenvRes = dotenv.config()
const server = http.createServer(app)
const io = socketio(server, {
    maxHttpBufferSize: 1e8,
    pingTimeout: 100000,
    pingInterval: 5000,
    cookie: false,
});


app.use('/send', bodyParser.urlencoded({extended:false}))
app.use('/send',bodyParser.json())

const hbs = require('hbs');

app.set('view engine', 'hbs')    

const viewsPath = path.join(__dirname + '/views')
const partialsPath = path.join(__dirname + '/partials')
app.set('views', viewsPath)
hbs.registerPartials(partialsPath)

//1. Import coingecko-api
app.use(express.static("/views/img"))

moment.locale('pl')

const admin = 'Admin'


const mongoDB = `mongodb+srv://borysj:${process.env.mongoURI}@cluster0.x1i4d.mongodb.net/message-chat-collection?retryWrites=true&w=majority`

mongoose.connect(mongoDB, {useNewUrlParser: true, useUnifiedTopology: true}).then(()=>{
    console.log('connected to database')
}).catch(err => console.log(err))


// Set static folder
app.use(express.static(path.join(__dirname, 'public')))



//run when client connects
io.on('connection', socket =>{
    Msg.find().then(result => {
        socket.emit('output-message', result)
       
    })
    socket.on('checkDuplicate', (data) => {
        const userExist = returnUsers(data)
        socket.emit('usernameTaken', userExist)
        
      })
    //socket.emit('usercheck',    )
    socket.on('joinRoom', ({username, room}) =>{
        const user = userJoin(socket.id, username, room)
        socket.join(user.room)
        
        setTimeout(()=>{
            socket.emit('message', formatMessage(admin, `Witamy w KryptoRakiety <b>${user.username}</b>`))
        },400)
    
        //Broadcast when a user connects 
        socket.broadcast.to(user.room).emit('message',formatMessage(admin,  `<b>${user.username}</b> dołączył/dołączyła do czatu`))
        

       
        io.to(user.room).emit('usersList', {
           room: user.room,
           users: userCheckRoom(user.room)
        })
        socket.on('changeROOM', privName =>{
            socket.emit('changeURL', privName)
        
        })
       
    });
    //send image file
    socket.on('submitImage', src => {
        const user = getCurrentUser(socket.id)
        if(user !== undefined){
            io.to(user.room).emit('sentImg', formatFileMessage(user.username, src))
        }else{
            console.log('unable to send the image bc user is undefined, this is user: ' + user)
        }
        //Client submit an image
       
   
    })

    socket.on('sendPriv', privName =>{
        let user = getCurrentUser(socket.id);
        let userp = findUserPriv(privName)
        if(user && userp !== undefined){
            
            const username = user.username;
            //let userp = userx.find(({username}) => username === privName)
            const wysylka = user.username + user.id;
            const userID = userp.id
            socket.emit('wysylka', {usernamex: privName ,id: wysylka, time: moment().format('MMMM Do HH:mm'), user: username})
            if(userID !== undefined){
                socket.to(userID).emit('privateNot', {usernamex: username, id: wysylka, time: moment().format('MMMM Do HH:mm')})
                user = undefined
                userp = undefined
            }
            else{
                console.log('check sendPriv it can be undefined')
            }
        }else{
            console.log('unable to send priv')
        }
    })


    //listen for chatMessage
    socket.on('chatMessage', msg => {
        const user = getCurrentUser(socket.id);
        if(user !== undefined){
            const socketid = socket.id;
            const username = user.username;
            const room = user.room;
            const czas = moment().format('MMMM Do HH:mm')
            const text = msg;
            //mongoose zapisywanie wiaodmości 
            const message = new Msg({socketid, username, text, room, czas})
            message.save()
            //mongoose
            io.to(user.room).emit('message',formatMessage(user.username, msg))
        }else{
            console.log('Something went wrong or user is undefined, this is user: ' + user)
        }
    });

    //user is typing
    socket.on("typing", (data) =>{
        const user = getCurrentUser(socket.id)
        if(user !== undefined){
            socket.to(user.room).emit("userIsTyping", data)
        }
    })

    
    const CoinGeckoClient = new CoinGecko({
        timeout: 10000
    });
   
    async function coin(){
        let waluta = "usd"
       
        try{
            
            let data = await CoinGeckoClient.coins.markets({vs_currency: waluta, per_page: 200, price_change_percentage: '1h,24h,7d'})
            if(data){
                dataUpdate()
                setInterval(()=>{
                    dataUpdate()
                },10000)
              
                function dataUpdate(){
                    socket.emit('coingeckoDATA', data)
                    socket.emit('secondData', data)
                }
                
            }
        }catch(error){
            console.log(error)
        }
       
        
        
       
    }
    
    coin()
       
        
        
    
        
    
    socket.on('disconnect', () => {
        const user = disconnectUser(socket.id)
        
        if (user){
            io.to(user.room).emit('message',formatMessage(admin, `<b>${user.username}</b> Użytkownik opuścil czat`))
            io.to(user.room).emit('usersList', {
                room: user.room,
                users: userCheckRoom(user.room)
            })
            
        }
        
        
    
    });
});



app.get('', (req,res)=>{
    res.setHeader('set-cookie', [
        'cookie1=value1; SameSite=Lax',
        'cookie2=value2; SameSite=None; Secure',
      ]);
    res.render('index', {
    title: 'Krypto Rakiety - Chat, Waluty, O nas',
    text: 'Witaj w KryptoRakiety, Odkrywaj z nami nowe rakiety!'
    })

})


app.get('/o-nas', (req,res)=>{
    res.render('onas', {
        title: 'Krypto Rakiety - O nas',
        text: 'O nas '
        
    })
})
app.get('/join-chat', (req,res)=>{
    res.sendFile(__dirname +'/public/join-chat.html')
})
app.get('/chat', (req,res)=>{
    res.sendFile(__dirname +'/public/chat.html')
})
app.get('/faq', (req,res)=>{
    res.render('faq', {
        title: 'FAQ',
        text: 'FAQ'
    })
})

app.get('/crypto', (req, res)=>{
    res.render('crypto', {
        title: 'Krypto Rakiety - Crypto',
        text: 'Aktualne kursy kryptowalut 💸'
    })
})
app.get("/crypto/nazwa-waluty=:CryptoName", (req,res)=>{
    res.render('cryptoSub', {
        title: 'Krypto Rakiety - Waluta: ' + req.params.CryptoName,
        text: req.params.CryptoName
        
    })
    
   
})

app.get('/kontakt', (req,res)=>{
    res.render('kontakt', {
        title: 'Krypto Rakiety - Kontakt',
        text: 'Skontaktuj się z nami!'
    })
})
app.post('/send', (req, res)=>{
    const output = `
        <p>Nowa prośba o kontakt</p>
        <h3>Dane kontaktowe</h3>
        <ul>
            <li>E-mail: ${req.body.email}</li>
            <li>Temat: ${req.body.subject}</li>    
        </ul>
        <h3>Wiadomość</h3>
        <p>Treść: ${req.body.text}</p>
    `
    let transporter = nodemailer.createTransport({
        service: "hotmail",
        auth: {
          user: "kryptorakiety@outlook.com", // generated ethereal user
          pass: "Bydlak123", // generated ethereal password
        },
        tls:{
          rejectUnauthorized: false
        }
      });
    
      // send mail with defined transport object
     let mailOptions = {
        from: `kryptorakiety@outlook.com`, // sender address
        to: "kryptorakiety@outlook.com", // list of receivers
        subject: `KryptoRakiety kontakt ${req.body.email}`, // Subject line
        text: "hello world", // plain text body
        html: output, // html body    
      }

      transporter.sendMail(mailOptions, (error, info)=>{
          if(error){
              return console.log(error)
          }
          console.log("Message sent: %s", info.messageId);

          console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
         
          res.render('kontakt', {text:"Wiadomość została wysłana"})
      })
    
     
     
})



app.get("/*", (req,res)=>{
    res.render('404', {
        title: 'Krypto Rakiety - 404',
        text: '404'
    })
})


server.listen(process.env.PORT || 3000, ()=> console.log(`Server running on port: 3000`));