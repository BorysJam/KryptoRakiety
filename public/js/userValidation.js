const socket = io();

var userVal;

socket.on('usercheck', userx=>{
    console.log(userx)
    userVal = userx
    return userVal
 })
const CheckDuplicateusername = document.querySelector('#username')
const btn = document.querySelector('#btnjoin')
const xTriangle = document.querySelector('#exclamationTriangle')
const duplicateText = document.querySelector('.duplicateP')
CheckDuplicateusername.addEventListener('keyup', ()=>{
   const uservalue = CheckDuplicateusername.value;

    const duplicate = userVal.find((user)=>{
           if(uservalue == user.username){
               return true;
           }
       })
    if(!duplicate){
        btn.disabled = false;
        xTriangle.style.display = ''
        duplicateText.innerHTML = ''
    }   
    if(duplicate){
        console.log(duplicate)
        btn.disabled = true;
        xTriangle.style.display = 'inline'
        duplicateText.innerHTML = 'Pseudonim ' + '<span style="font-weight: bold;">" '+ duplicate.username + ' "</span>'+' jest już żajęty'
    }
	})
    
