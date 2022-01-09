
const CheckDuplicateusername = document.querySelector('#username')
const btn = document.querySelector('#btnjoin')
const xTriangle = document.querySelector('#exclamationTriangle')
const duplicateText = document.querySelector('.duplicateP')

const socket = io();

var userVal;



CheckDuplicateusername.addEventListener('keyup', (e)=>{
    console.log(e.target.value)
    let = username = e.target.value
    socket.emit('checkDuplicate', username)

    
    }
)
    
socket.on('usernameTaken', (data)=>{
    console.log(data)
    if(data == false){
        duplicateText.innerHTML = 'Pseudonim ' + '<span style="font-weight: bold;">" '+ CheckDuplicateusername.value + ' "</span>'+' jest już żajęty'
    }
    else{
        duplicateText.innerHTML = ''
    }
})