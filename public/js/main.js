const chatForm = document.getElementById('chat-form');
const chatMessages = document.querySelector('.chat-messages');
const content = document.querySelector('.user_list') 
const inputText = document.querySelector('#msg')
const fileMsgInput = document.querySelector('#fileMsg')
const fileInputBtn = document.querySelector('.inputFileBtn')
// Get username and rooms from url with help of qs (script is in the chat.html)
const {username, room} = Qs.parse(location.search, {
    ignoreQueryPrefix: true
});
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

//message from server   
socket.on('message', message => {
    console.log(message);
    outputMessage(message);
   
    //scroll down everytime you get a message
    chatMessages.scrollTop = chatMessages.scrollHeight;
});

//prywatne wiadomosci powiadomienie
socket.on('privateNot', ({usernamex, id}) => {
    
    const not = document.createElement('div')
    not.classList.add('messageNotification')
    not.innerHTML = 'nowa wiadomosc od ' + usernamex;
    not.style.width = '100%'
    not.style.height = '100px'
    not.style.marginTop = '2rem'
    sideBar.appendChild(not)
    
    document.querySelector('.messageNotification').addEventListener('click', ()=>{
        
        location.search = 'username='+username+'&room='+ id;
    })
})

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

//audio files 
const audioLeft = '/soundE/receiveSound.mp3';
const audioRight = '/soundE/sound.mp3'

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





//emoji 

    const emojidiv = document.querySelector('.emoji')
    const smiley = document.querySelector('#smiley')
    smiley.addEventListener('click', ()=>{
        if (emojidiv.style.display == 'none'){
        emojidiv.style.display ='block';
        smiley.style.color = '#d0e3ffbb';
    }
    else{
        emojidiv.style.display ='none';
        smiley.style.color = 'white';
    }})

    //click outside the emoji div to close it
    window.addEventListener('mouseup',(event)=>{
        if(event.target != emojidiv && event.target.parentNode != emojidiv){
            emojidiv.style.display = 'none';
            smiley.style.color = 'white';
        }
  });  




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
    Userli.innerHTML = `${users.map(user => `<li class="userzz">${user.username}</li>`).join('')}`  
   

    Userli.addEventListener('click', (e)=>{
        e.preventDefault()
    
        var privName = e.target.innerText;
        socket.emit('sendPriv', privName)
        socket.on('wysylka', wysylka => location.search = `username=` + username + '&room=' + wysylka)
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
       // div.style.marginLeft = '50%';
        div.style.textAlign = 'right';
        div.style.color = 'white';
        div.style.backgroundColor = 'var(--right-msg)';
      //  const audio = new Audio(audioRight);
       // audio.play();
   
    }
    else{

    div.style.backgroundColor = 'var(--left-msg)';
   // const audio = new Audio(audioLeft);
     //   audio.play();

    }
    img.addEventListener('click', ()=>{
    img.requestFullscreen()})

    document.querySelector('.chat-messages').appendChild(div) 
}

//hide sidebar 
const sideBar = document.querySelector('.chat-sidebar')
const hideSideBar = document.querySelector('.fa-bars')
const rightArrow = document.querySelector('.fa-arrow-right')
const formContainer = document.querySelector('.chat-form-container form');


hideSideBar.addEventListener('click', ()=>{
    document.body.classList.add('showHideSidebar')
    sideBar.style.display = 'none'
    formContainer.style.marginLeft = '0px';
    document.querySelector('.chat-main').style.display = 'grid';
    document.querySelector('.chat-main').style.gridTemplateColumns = '100% 100% 100%'
    rightArrow.style.display = 'block'
    

    
})

//show sidebar
rightArrow.addEventListener('click', ()=>{
    sideBar.style.display = ""
    document.querySelector('.chat-main').style.gridTemplateColumns = ''
     rightArrow.style.display = ''
     formContainer.style.marginLeft = ''
})

//hover over title or logo 
const hjedynka = document.querySelector('.hjedynka')
const logo = document.querySelector('.logo')

hjedynka.addEventListener('mouseover', ()=>{
    logo.style.opacity = '0.9'
    hjedynka.style.opacity = '0.9'
})
hjedynka.addEventListener('mouseout', ()=>{
    logo.style.opacity = ''
    hjedynka.style.opacity = ''
})  

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