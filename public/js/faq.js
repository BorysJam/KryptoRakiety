const faqItems = document.querySelectorAll('.faqItem')
const faqItem = document.querySelector('.faqItem')
const faqItemText = document.querySelectorAll('.faqItemText')


faqItems.forEach(e => {
    let x = 0
    e.addEventListener('click', e => {
        const minusSquare = e.srcElement.children[1]
        const plusSquare = e.srcElement.children[0]
        var nextEl = e.srcElement.nextElementSibling
        if(x == 1){
            nextEl.style.display = 'none'
            plusSquare.style.display = 'block'
            minusSquare.style.display = 'none'
            x = 0;
            return x
        }else{
            nextEl.style.display = 'flex'
            plusSquare.style.display = 'none'
            minusSquare.style.display = 'block'
            x= 1;
            return x 
        }
  
    
})})



