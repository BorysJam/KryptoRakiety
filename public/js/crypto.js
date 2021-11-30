const socket = io()
    
    
const container = document.querySelector('.crypto_container')
const table = document.querySelector('.table')



var i = 2;


socket.on('coingeckoDATA', (data) =>{   
    if(data !== undefined){ 
        var c = 0;
        for(c; c< data.data.length; c++){
                if(table.childElementCount === 201){

                    const oldTh1 = document.querySelectorAll('.cryptoID')
                    const oldTh2 = document.querySelectorAll('.rankN')
                    const oldTh3 = document.querySelectorAll('.cena')
                    const oldTh4 = document.querySelectorAll('.hour24s')
                    const oldTh5 = document.querySelectorAll('.wysoka')
                    const oldTh6 = document.querySelectorAll('.niska')
                    const oldTh7 = document.querySelectorAll('.sevendays')
                    const oldTh8 = document.querySelectorAll('.symbol')
                    console.log("update dom")
                    
                    oldTh1.innerHTML = data.data[c].id;
                    oldTh2.innerHTML = data.data[c].market_cap_rank;
                    oldTh8.innerHTML = data.data[c].symbol
                    oldTh3.innerHTML = '$'+ (data.data[c].current_price).toFixed(2);
                    oldTh4.innerHTML = (data.data[c].price_change_percentage_24h).toFixed(1) + "%";
                    oldTh7.innerHTML = (data.data[c].price_change_percentage_7d_in_currency).toFixed(1) + "%"
                    oldTh5.innerHTML = "$" + (data.data[c].high_24h).toFixed(1);
                    oldTh6.innerHTML = "$" + (data.data[c].low_24h).toFixed(1);
                    
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
                    th4.innerHTML = (data.data[c].price_change_percentage_24h).toFixed(1) + "%";
                    th7.innerHTML = (data.data[c].price_change_percentage_7d_in_currency).toFixed(1) + "%"
                    th5.innerHTML = "$" + (data.data[c].high_24h).toFixed(1);
                    th6.innerHTML = "$" + (data.data[c].low_24h).toFixed(1);
                    imag.src = data.data[c].image
    
                    if(Math.sign(data.data[c].market_cap_change_percentage_24h) === -1){
                        th4.style.color = 'red'
                    }else{
                        th4.style.color = 'green'
                    }
                
                    //document.querySelector(`.icon${c}`).appendChild(imag)
                    const trc =  document.querySelector(`.tr${c}`)
                    trc.appendChild(th2)
                    trc.appendChild(th8)
                    trc.appendChild(th1)
                    trc.appendChild(th3)
                    trc.appendChild(th4)
                    trc.appendChild(th7)
                    trc.appendChild(th5)
                    trc.appendChild(th6)
                    
    
                    
    
                    if(Math.sign(data.data[c].price_change_percentage_7d_in_currency) === -1){
                        th7.style.color = '#FF2626'
                    }else{
                        th7.style.color = '#6ECB63'
                    }
                    
                    trc.addEventListener('click', ()=>{
                        const getToCoin = th1.innerHTML
                        window.location.href = '/crypto/coinName=' + getToCoin
                        
                    })
                          
                }       
            }            
    }
}) 


