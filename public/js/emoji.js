//emoji 
function emojer(){
const emojidiv = document.querySelector('.emoji')
const smiley = document.querySelector('#smiley')
smiley.addEventListener('click', ()=>{
    if (emojidiv.style.display == 'none'){
    emojidiv.style.display ='block';
}else{
    emojidiv.style.display ='none';
}

})


    document.querySelector('.icon').addEventListener('click', ()=>{
        document.querySelector('#msg').value = document.querySelector('#msg').value + "😀";
    })
}
