const chatForm = document.getElementById('chat-form');
const chatMessages = document.querySelector('.chat-messages');
const content = document.querySelector('.user_list') 
const inputText = document.querySelector('#msg')
const fileMsgInput = document.querySelector('#fileMsg')
const fileInputBtn = document.querySelector('.inputFileBtn')

//hide sidebar 
const sideBar = document.querySelector('.chat-sidebar')
const hideSideBar = document.querySelector('.fa-bars')
const rightArrow = document.querySelector('.fa-arrow-right')
const formContainer = document.querySelector('.chat-form-container form');
//messagebox
const quit_message_box = document.getElementById('exit_box')
const messagebox = document.querySelector('.message_box')
const message_icon = document.querySelector('.fa-inbox')
const message_icon_text = document.querySelector('.inbox_iconTxt')

const messagesReceivedBox = document.querySelector('#messagesReceived')
const messagesSentBox = document.querySelector('#messagesSent')
const sentMsgDivBox = document.querySelector('.sentMsgDiv')
const receivedMsgDivBox = document.querySelector('.receivedDiv')


// Get username and rooms from url with help of qs (script is in the chat.html)
const {username, room} = Qs.parse(location.search, {
    ignoreQueryPrefix: true
});


if(username.length < 4 || room === undefined){
    window.location.href = "index"
}
fileInputBtn.addEventListener('click', function(){
    fileMsgInput.click()
})
//socket.io is on
const socket = io();

function changeRoom(roomName){
    location.search = `username=` + username + '&room=' + roomName;
}

//Join chatroom
socket.emit('joinRoom', {username, room});

socket.on('output-message', data =>{
    if(data.length){
        data.forEach((msg) => {
            if(msg.room == room){
                if(msg.text && msg.czas){
                    outputMessage(msg)
                    chatMessages.scrollTop = chatMessages.scrollHeight;
                } 
            }
        })
    }
})


//message from server   
socket.on('message', message => {
    outputMessage(message);
   
    //scroll down everytime you get a message
    chatMessages.scrollTop = chatMessages.scrollHeight;
});

//checks if user is typing
inputText.addEventListener("keypress", ()=>{
    socket.emit('typing', username)
})

//listening for the user is typing data from the server
socket.on('userIsTyping', data =>{
    console.log(data)
    document.querySelector('.userTyping').innerHTML = "Użytkownik " + data + " pisze..."
    setTimeout(()=>{
        document.querySelector('.userTyping').innerHTML = ""
    },3000)
})


//array obiektów zawierających dane do prywatnych wiadomosci
var userArrayMSG = [];
var sentuserArrayMSG = [];
//prywatne wiadomosci powiadomienie
socket.on('privateNot', ({usernamex, id, time}) => {
    outputPrivateNotification(usernamex)
    savetoBox(usernamex, id, time)
    
    if(document.querySelector('.messageNotification')){
        document.querySelector('.fa-envelope').addEventListener('click', ()=>{
            
            location.search = 'username='+username+'&room='+ id;
            //tutaj mam dodac wiadomosci do wyslanych 
         })
        document.querySelector('.fa-trash').addEventListener('click',()=>{
            sideBar.removeChild(document.querySelector('.messageNotification'))
        })
        
    }
    
    
})

function outputPrivateNotification(usernamex){
    const not = document.createElement('div');
    not.classList.add('messageNotification');
    not.innerHTML = 'PM od ' + usernamex + `<i class="fas fa-envelope"></i><i class="fas fa-trash"></i>`;
    not.style.width = '100%';
    not.style.height = '50px';
    not.style.marginTop = '2rem';
    sideBar.appendChild(not);
}



function savetoBox(usernamex, id, time){
    var link = 'username='+username+'&room='+ id;
   
    userArrayMSG.push({link, usernamex, username, time})
   
    sessionStorage.setItem('link', JSON.stringify(userArrayMSG))
}


// save to inbox
function sentsavetoBox(usernamex, id, time, user){
    var link = 'username='+username+'&room='+ id;
  
    sentuserArrayMSG.push({link, usernamex, time, user})
   
    sessionStorage.setItem('sentlink', JSON.stringify(sentuserArrayMSG))
    
}
if(sessionStorage.getItem('link')){
    userArrayMSG = JSON.parse(sessionStorage.getItem('link'))
    messageLink()
}else{
    userArrayMSG = []
}



if(sessionStorage.getItem('sentlink')){
    sentuserArrayMSG = JSON.parse(sessionStorage.getItem('sentlink'))
    sentMessageLink()
}else{
    sentuserArrayMSG = []
}
function messageLink(){
    if(userArrayMSG.length > 0){
        userArrayMSG.forEach((e)=>{
            if(e.username === username){
                const n = document.createElement('div');
                n.className = 'messageboxmsglink';
                const link = e.link;
                n.innerHTML = "<h3>" + e.usernamex + "</h3>" +  "<p>"+ '<b> Otwórz rozmowe </b>' + e.link + "</p>" + "<span id='timeNotification'>" + e.time + "</span>"
                n.style.width = '100%';
                n.style.height = '50px';
                receivedMsgDivBox.appendChild(n)
                document.querySelectorAll('.numberReceived').forEach(e => {
                    e.innerHTML  = " (" + userArrayMSG.length + ") ";
                })
                
                n.addEventListener('click',(e)=>{
                    location.search = link;
                })
            }else{
                userArrayMSG = [];
                e.innerHTML  = " (" + userArrayMSG.length + ") ";
            } 
            
        })
    }
}



function sentMessageLink(){
    if(sentuserArrayMSG.length > 0){
        sentuserArrayMSG.forEach((e)=>{
            if(e.user === username){
                const n = document.createElement('div');
                n.className = 'messageboxmsglink';
                const link = e.link;
                n.innerHTML = "<h3>" + e.usernamex + "</h3>" +  "<p>"+ '<b> Otwórz rozmowe </b>' + e.link + "</p>" + "<span id='timeNotification'>" + e.time + "</span>"
                n.style.width = '100%';
                n.style.height = '50px';
                sentMsgDivBox.appendChild(n)
                document.querySelector('.numberSent').innerHTML = " (" + sentuserArrayMSG.length + ") ";
                
                n.addEventListener('click',(e)=>{
                    location.search = link;
                })
            }else{
                sentuserArrayMSG = [];
                e.innerHTML  = " (" + sentuserArrayMSG.length + ") ";
            } 
            
        })
    }else{
        console.log(sentuserArrayMSG)
        document.querySelector('.numberSent').innerHTML = " (" + sentuserArrayMSG.length + ") ";
    }
}
//lista uzytkowników
socket.on('usersList',({room, users}) =>{
    viewUsers(users)
    nameRoom(room, users)

    content.scrollTop = content.scrollHeight
})




socket.on('sentImg', Imgsrc => {
    // Create Img...
    
    fileMessageSend(Imgsrc);
  
    chatMessages.scrollTop = chatMessages.scrollHeight;
    
})

var src

const setImgSrc = (e)=>{
    const fileReader = new FileReader()
    fileReader.onload = () => (src = fileReader.result)
    document.querySelector('#fa-images').style.color = 'grey'
    fileReader.readAsArrayBuffer(e.files[0])
    
}
const submitImage = ()=> {socket.emit('submitImage', src)
}


function ignoreInput(){
    inputText.removeAttribute("required")
}
//message submit 
chatForm.addEventListener('submit', (e) =>{
    
    e.preventDefault();
    if(src !== undefined){
        ignoreInput()
        submitImage()
        src = undefined;
        document.querySelector('#fa-images').style.color = ''
        chatForm.reset()
    
    
    
}
    else if(inputText.value !== ''){
    
  
    //get message text
    const msg = e.target.elements.msg.value;

    //emit messsage to the server
    socket.emit('chatMessage', msg);
    
    //clear input after submitting message
    e.target.elements.msg.value = '';
    e.target.elements.msg.focus();
}
});

function chatCommands(e){
    if((e.target.elements.msg.value).includes("--bitcoin")){
        (e.target.elements.msg.value).replace("--bitcoin", "Bitcoin data: 1000")
    }
}


//output message to DOM
function outputMessage(message){
    const div = document.createElement('div');
    
    div.classList.add('message');
    div.innerHTML = `<p class="meta" >${message.username}<span>${message.czas}</span></p><p class="text">${message.text}</p>`;
    
    if(message.username === username){
        div.style.float = 'right'
        div.style.clear = 'both'
        //div.style.marginLeft = '60%';
        div.style.textAlign = 'right';
        div.style.color = 'white';
        div.style.backgroundColor = 'var(--right-msg)';
        //const audio = new Audio(audioRight);
        //audio.play();
        
       
    }else{
        div.style.backgroundColor = 'var(--left-msg)';
        //const audio = new Audio(audioLeft);
       // audio.play();
    }
    document.querySelector('.chat-messages').appendChild(div);



}

//Light mode/Dark mode
let lightMode = localStorage.getItem('lightMode');
const lightModeToggle = document.querySelector('#checklight');

const enableLightMode = ()=>{
    document.body.classList.add('lightMode');
    localStorage.setItem('lightMode', 'enabled');
    
}

const disableLightMode = ()=>{
    document.body.classList.remove('lightMode');
    localStorage.setItem('lightMode', null);
  

}

if(lightMode === 'enabled'){
    enableLightMode();
}

lightModeToggle.addEventListener('click', ()=>{
    lightMode = localStorage.getItem('lightMode')
   
    if(lightMode !== 'enabled'){
        enableLightMode();
        console.log(lightMode)
    }
    else{
        disableLightMode();
        console.log(lightMode)
    }
})
    

//pokaz nazwe pokoju
const nameRoom = (room, users)=>{
    document.querySelector('#name-room').innerText = room;
    document.querySelector('.onlineUsersNumber').innerHTML = users.length;
}

function viewUsers(users){
    const userz = []
    userz.push(users.map(user => user.username))
    const Userli = document.querySelector('#users')    
    Userli.innerHTML = `${users.map(user => `<li class="userzz">${user.username}<i class="far fa-edit"></i></li>`).join('')}`  
   

    Userli.addEventListener('click', (e)=>{
        e.preventDefault()
    
        var privName = e.target.innerText;
        socket.emit('sendPriv', privName)
        socket.on('wysylka', ({usernamex, id, time, user}) => {
            location.search = `username=` + username + '&room=' + id;
            sentsavetoBox(usernamex, id, time, user)
        })
        
    })
    
}




function fileMessageSend(src){
    const div = document.createElement('div');
    div.classList.add('message');
    const img = document.createElement('img')
    img.classList.add('image')
    img.src = (window.URL || window.webkitURL).createObjectURL(
    new Blob([src.file], {
    type: 'image/png/jpg'
    }))

    div.innerHTML = `<p class="meta" >${src.username}<span>${src.czas}</span></p>`;
    div.appendChild(img)   
    img.style.maxWidth = '100%';
    if(src.username === username){
        div.style.float = 'right'
        div.style.display = 'inline'
        div.style.textAlign = 'right';
        div.style.color = 'white';
        div.style.backgroundColor = 'var(--right-msg)';  
    }
    else{
    div.style.backgroundColor = 'var(--left-msg)';
    }
    img.addEventListener('click', ()=>{
    img.requestFullscreen()})

    document.querySelector('.chat-messages').appendChild(div) 
}

//checking screen max width 
const checkMobile = window.matchMedia("(max-width: 600px)")

//if under 600 showhidemobile else pc
if(checkMobile.matches){
    showHideMobile()
}else{
    showHideSidePc()
}
//show sidebar over 600px
function showHideSidePc(){
    rightArrow.addEventListener('click', ()=>{
        sideBar.style.display = ""
        document.querySelector('.chat-main').style.gridTemplateColumns = ''
         rightArrow.style.display = ''
         formContainer.style.marginLeft = ''
    })
    
    hideSideBar.addEventListener('click', ()=>{
       
        sideBar.style.display = 'none'
        formContainer.style.marginLeft = '0px';
        document.querySelector('.chat-main').style.gridTemplateColumns = '100% 100% 100%'
        rightArrow.style.display = 'block'  
    })
}
//show hide sidebar under 600px
function showHideMobile(){
    rightArrow.addEventListener('click', ()=>{
        sideBar.style.display = "grid"
        
         rightArrow.style.display = 'none'
    })
    
    hideSideBar.addEventListener('click', ()=>{
       
        sideBar.style.display = ''
        rightArrow.style.display = 'block'  
    })
}


const hiddenLinks = document.querySelectorAll('.hidden_links')
const hiddenContainer = document.querySelector('.hidden_container')
    

//Zmiana stałych pokoi
for(var i = 0; i < hiddenLinks.length; i++){
    hiddenLinks[i].addEventListener('click', (e)=>{
           e.preventDefault()
           var roomName = e.target.innerText;
           
           changeRoom(roomName)
       })
   
}
  

const downArrowUsers = document.querySelector('.fa-chevron-down')
const nameUsers = document.querySelector('#name-room')

downArrowUsers.addEventListener('click', ()=>{
    if(hiddenContainer.style.display === 'block'){
        hiddenContainer.style.display = 'none'
    }else{
    hiddenContainer.style.display = 'block'
    }
})

//open message box 



message_icon && message_icon_text.addEventListener("click", ()=>{
    messagebox.style.display = "flex";
    window.addEventListener("keydown", (e)=>{
        if(e.code === "Escape"){
            niepokaz()
        }
        
    })
})

function niepokaz(){
    messagebox.style.display = "none";
}


messagesSentBox.addEventListener("click", ()=>{
    receivedMsgDivBox.style.display = 'none';
    sentMsgDivBox.style.display = 'block';
})
messagesReceivedBox.addEventListener("click", ()=>{
    sentMsgDivBox.style.display = "none";
    receivedMsgDivBox.style.display = "block";
})

