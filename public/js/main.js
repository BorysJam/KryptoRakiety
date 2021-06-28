const chatForm = document.getElementById('chat-form');
const chatMessages = document.querySelector('.chat-messages');


// Get username and rooms from url with help of qs (script is in the chat.html)
const {username, room} = Qs.parse(location.search, {
    ignoreQueryPrefix: true
});

console.log(username, room);

const socket = io();

//Join chatroom
socket.emit('joinRoom', {username, room});

//message from server   
socket.on('message', message => {
    console.log(message);
    outputMessage(message);
   
    //scroll down everytime you get a message
    chatMessages.scrollTop = chatMessages.scrollHeight;
});


//message submit 
chatForm.addEventListener('submit', (event) =>{
    event.preventDefault();

    //get message text
    const msg = event.target.elements.msg.value;

    //emit messsage to the server
    socket.emit('chatMessage', msg);

    //clear input after submitting message
    event.target.elements.msg.value = '';
    event.target.elements.msg.focus();
});


//output message to DOM
function outputMessage(message){
    const div = document.createElement('div');
    div.classList.add('message');
    div.innerHTML = `<p class="meta" >${message.username}<span>${message.czas}</span></p><p class="text">${message.text}</p>`;
    
    if(message.username === username){
        div.style.marginLeft = '50%';
        div.style.textAlign = 'right';
        div.style.color = 'white';
        div.style.backgroundColor = 'var(--right-msg)';
       
    }else{
        div.style.backgroundColor = 'var(--left-msg)';
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


//pick emoji from div
const emoji = ()=>{
   document.querySelector('#smile').addEventListener('click', ()=>{
    document.querySelector('#msg').value = document.querySelector('#msg').value + "😀";
        })
    document.querySelector('#smilebig').addEventListener('click', ()=>{
    document.querySelector('#msg').value = document.querySelector('#msg').value + "😃";
        })
    document.querySelector('#smileclosedeye').addEventListener('click', ()=>{
    document.querySelector('#msg').value = document.querySelector('#msg').value + "😄";
        })
    document.querySelector('#bigsmile').addEventListener('click', ()=>{
    document.querySelector('#msg').value = document.querySelector('#msg').value + "😁";
        })
    document.querySelector('#xsmile').addEventListener('click', ()=>{
    document.querySelector('#msg').value = document.querySelector('#msg').value + "😆";
        })
    document.querySelector('#smile1').addEventListener('click', ()=>{
    document.querySelector('#msg').value = document.querySelector('#msg').value + "😅";
        })
    document.querySelector('#smile2').addEventListener('click', ()=>{
    document.querySelector('#msg').value = document.querySelector('#msg').value + "🤣";
        })
    document.querySelector('#smile3').addEventListener('click', ()=>{
    document.querySelector('#msg').value = document.querySelector('#msg').value + "😂";
        })
    document.querySelector('#smile4').addEventListener('click', ()=>{
    document.querySelector('#msg').value = document.querySelector('#msg').value + "🙂";
        })
    document.querySelector('#smile5').addEventListener('click', ()=>{
    document.querySelector('#msg').value = document.querySelector('#msg').value + "🙃";
        })
    document.querySelector('#smile6').addEventListener('click', ()=>{
    document.querySelector('#msg').value = document.querySelector('#msg').value + "😉";
        })
    document.querySelector('#smile7').addEventListener('click', ()=>{
    document.querySelector('#msg').value = document.querySelector('#msg').value + "😊";
        })
    document.querySelector('#smile8').addEventListener('click', ()=>{
    document.querySelector('#msg').value = document.querySelector('#msg').value + "😇";
        })
    document.querySelector('#smile9').addEventListener('click', ()=>{
    document.querySelector('#msg').value = document.querySelector('#msg').value + "🥰";
        })
    document.querySelector('#smile10').addEventListener('click', ()=>{
    document.querySelector('#msg').value = document.querySelector('#msg').value + "😍";
        })
    document.querySelector('#smile11').addEventListener('click', ()=>{
    document.querySelector('#msg').value = document.querySelector('#msg').value + "😋";
        })
    document.querySelector('#smile12').addEventListener('click', ()=>{
    document.querySelector('#msg').value = document.querySelector('#msg').value + "😛";
        })
    document.querySelector('#smile13').addEventListener('click', ()=>{
    document.querySelector('#msg').value = document.querySelector('#msg').value + "😜";
        })
    document.querySelector('#smile14').addEventListener('click', ()=>{
    document.querySelector('#msg').value = document.querySelector('#msg').value + "🤪";
        })
    document.querySelector('#smile15').addEventListener('click', ()=>{
    document.querySelector('#msg').value = document.querySelector('#msg').value + "😝";
        })
    document.querySelector('#smile16').addEventListener('click', ()=>{
    document.querySelector('#msg').value = document.querySelector('#msg').value + "🤑";
        })
    document.querySelector('#smile17').addEventListener('click', ()=>{
    document.querySelector('#msg').value = document.querySelector('#msg').value + "💸";
        })
    document.querySelector('#smile18').addEventListener('click', ()=>{
    document.querySelector('#msg').value = document.querySelector('#msg').value + "💰";
        })
    document.querySelector('#smile19').addEventListener('click', ()=>{
    document.querySelector('#msg').value = document.querySelector('#msg').value + "👻";
        })
    document.querySelector('#smile20').addEventListener('click', ()=>{
    document.querySelector('#msg').value = document.querySelector('#msg').value + "💩";
        })
    document.querySelector('#smile21').addEventListener('click', ()=>{
    document.querySelector('#msg').value = document.querySelector('#msg').value + "😤";
        })
    document.querySelector('#smile22').addEventListener('click', ()=>{
    document.querySelector('#msg').value = document.querySelector('#msg').value + "🤮";
        })
    document.querySelector('#smile23').addEventListener('click', ()=>{
    document.querySelector('#msg').value = document.querySelector('#msg').value + "🥳";
        })
    document.querySelector('#smile24').addEventListener('click', ()=>{
    document.querySelector('#msg').value = document.querySelector('#msg').value + "💵";
        })
    }
    emoji()
       

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
const nameRoom = ()=>{
    document.querySelector('#name-room').innerText = room;

} 
nameRoom()

// pokaz uzytkownika

const nameUserList = ()=>{
    document.querySelector('#users').innerText = username;
    
}
nameUserList()