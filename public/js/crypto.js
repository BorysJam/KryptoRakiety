const socket = io()
    
    
const container = document.querySelector('.crypto_container')
const table = document.querySelector('.table')
const btnUp = document.querySelector('#btnUp')
const loading = document.querySelector('.loading-box')

var i = 2;


socket.on('coingeckoDATA', (data) =>{   
    if(data !== undefined){ 
       
        for(let c = 0; c< data.data.length; c++){
                if(table.childElementCount === 201){

                    var oldTh1 = document.querySelectorAll('.cryptoID')
                    var oldTh2 = document.querySelectorAll('.rankN')
                    var oldTh3 = document.querySelectorAll('.cena')
                    var oldTh4 = document.querySelectorAll('.hour24s')
                    var oldTh5 = document.querySelectorAll('.wysoka')
                    var oldTh6 = document.querySelectorAll('.niska')
                    var oldTh7 = document.querySelectorAll('.sevendays')
                    var oldTh8 = document.querySelectorAll('.symbol')
                    var oldTh9 = document.querySelectorAll('.godzina1')
                    
                    oldTh1[c].innerHTML = data.data[c].id;
                   
                    
                    oldTh2[c].innerHTML = data.data[c].market_cap_rank;
                    oldTh8[c].innerHTML = data.data[c].symbol
                    oldTh3[c].innerHTML = '$'+ parseFloat(data.data[c].current_price).toFixed(2);
                    oldTh9[c].innerHTML = parseFloat(data.data[c].price_change_percentage_1h_in_currency).toFixed(2) + '%'
                    oldTh4[c].innerHTML = parseFloat(data.data[c].price_change_percentage_24h).toFixed(2) + "%";
                    oldTh7[c].innerHTML = parseFloat(data.data[c].price_change_percentage_7d_in_currency).toFixed(1) + "%"
                    oldTh5[c].innerHTML = "$" + parseFloat(data.data[c].high_24h).toFixed(1);
                    oldTh6[c].innerHTML = "$" + parseFloat(data.data[c].low_24h).toFixed(1);

                }else{
                    
                  
                    const tr = document.createElement('TR')
                    const iconContainer = document.createElement('div')
                    const imag = document.createElement('img')
                    imag.className = ".imago"
                    const tdICon = document.createElement('TD')
                    const th1 = document.createElement(`TD`) 
                    th1.className = "cryptoID"
                    const th2 = document.createElement(`TD`)
                    th2.className = "rankN"
                    const th3 = document.createElement('TD')
                    th3.className = "cena"
                    const th4 = document.createElement('TD')
                    th4.className = "hour24s"
                    const th5 = document.createElement('TD')
                    th5.className = "wysoka"
                    const th6 = document.createElement('TD')
                    th6.className = "niska"
                    const th7 = document.createElement('TD')
                    th7.className = 'sevendays'
                    const th8 = document.createElement('TD')
                    th8.className = 'symbol'
                    const th9 = document.createElement('TD')
                    th9.className = 'godzina1'
                    tr.className = `tr${c}`
                    iconContainer.className = `icon`
                    
                
                    tr.appendChild(tdICon)
                    table.appendChild(tr)
                    
                    iconContainer.appendChild(imag)
                    
                    tdICon.appendChild(iconContainer)
                    
                    
               
                    th1.innerHTML = data.data[c].id;
                    th2.innerHTML = data.data[c].market_cap_rank;
                    th8.innerHTML = data.data[c].symbol
                    th3.innerHTML = '$'+ (data.data[c].current_price).toFixed(2);
                    th9.innerHTML = parseFloat(data.data[c].price_change_percentage_1h_in_currency).toFixed(2) + '%'
                    th4.innerHTML = parseFloat(data.data[c].price_change_percentage_24h).toFixed(2) + "%";
                    th7.innerHTML = parseFloat(data.data[c].price_change_percentage_7d_in_currency).toFixed(1) + "%"
                    th5.innerHTML = "$" + parseFloat(data.data[c].high_24h).toFixed(1);
                    th6.innerHTML = "$" + parseFloat(data.data[c].low_24h).toFixed(1);
                    imag.src = data.data[c].image
    
                    if(Math.sign(data.data[c].market_cap_change_percentage_24h) === -1){
                        th4.style.color = '#FF2626'
                    }else{
                        th4.style.color = '#6ECB63'
                    }
                
                    //document.querySelector(`.icon${c}`).appendChild(imag)
                    const trc =  document.querySelector(`.tr${c}`)
                    trc.appendChild(th2)
                    trc.appendChild(th8)
                    trc.appendChild(th1)
                    trc.appendChild(th3)
                    trc.appendChild(th9)
                    trc.appendChild(th4)
                    trc.appendChild(th7)
                    trc.appendChild(th5)
                    trc.appendChild(th6)
                    
                    
                    loadingFunction()
    
                    if(Math.sign(data.data[c].price_change_percentage_7d_in_currency) === -1){
                        th7.style.color = '#FF2626'
                    }else{
                        th7.style.color = '#6ECB63'
                    }

                    if(Math.sign(data.data[c].price_change_percentage_1h_in_currency) === -1){
                        th9.style.color = '#FF2626'
                    }else{
                        th9.style.color = '#6ECB63'
                    }
                    
                    trc.addEventListener('click', ()=>{
                        const getToCoin = th1.innerHTML
                        window.location.href = '/crypto/nazwa-waluty=' + getToCoin
                        
                    })
                          
                }       
            }            
    }
}) 

function scrollingPage(){
    const yPosition = window.scrollY
    if(yPosition >= 800){
        btnUp.className = "btnUp btnShow"
    }else{
        btnUp.className = ""
    }
}

window.addEventListener('scroll', scrollingPage)

function goUp(){
    window.scrollTo({top: 0, behavior: 'smooth'})
}

function loadingFunction(){
    loading.style.display = 'none'
    table.style.display = 'table'
}