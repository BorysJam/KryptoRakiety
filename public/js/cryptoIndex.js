const kursy = document.querySelector('.kursy')
const createDiv = document.querySelectorAll('.kurs')
const hotCoin = document.querySelectorAll('.hotCoin')
const createImage = document.querySelectorAll('.kursImg')
const createSpanName = document.querySelectorAll('.createSpanName')
const createSpanPrice = document.querySelectorAll('.createSpanPrice')
const createSpan1hChange = document.querySelectorAll('.createSpan1hChange')
const createRankSymbol = document.querySelectorAll('.createRankSymbol')
const hotCoinId = document.querySelector('.hotCoinId')
const hotCoinImg = document.querySelector('.hotCoinImg')
const hotCoin24Change = document.querySelector('.hotCoin24Change')
const hotCoinId7 = document.querySelector('.hotCoinId7')
const hotCoinImg7 = document.querySelector('.hotCoinImg7')
const hotCoin7Change = document.querySelector('.hotCoin24Change7')
const hotCoin24Price = document.querySelector('.hotCoin24Price')
const hotCoin7Price = document.querySelector('.hotCoin7Price')
const hotCoinRank = document.querySelector('.hotCoinRank')
const hotCoinRank7 = document.querySelector('.hotCoinRank7')
const loadingbar = document.querySelectorAll('.loadingbar')
const spinningContainer = document.querySelector('.spinningContainer')
const cryptoSpinName = document.querySelectorAll('.cryptoSpinName')
const cryptoSpinPrice = document.querySelectorAll('.cryptoSpinPrice')
const cryptoSpinChange = document.querySelectorAll('.cryptoSpinChange')
      

socket = io()

createDiv.forEach((e)=>{
    e.addEventListener('click',()=>{
        const getToCoin = e.childNodes[2].innerHTML.substring(1)
        const number = parseFloat(getToCoin) - 1;
        const link = (createSpanName[number].outerText).toLowerCase()
        window.location.href = '/crypto/coinName=' + link
    })
})
hotCoin.forEach((e)=>{
    e.addEventListener('click',()=>{
        const getToCoin = e.childNodes[5].innerHTML
        window.location.href = '/crypto/coinName=' + getToCoin
    })
})

socket.on('secondData', (data) => {
    ifImgEmt()
    hotToday(data)
    hotThisWeek(data)
    for(x = 0; x < 10; x++){       
            createImage[x].src = data.data[x].image;
            createRankSymbol[x].innerHTML = "#"+data.data[x].market_cap_rank
            createSpanName[x].innerHTML = data.data[x].id;
            createSpanPrice[x].innerHTML = "$" + (data.data[x].current_price).toFixed(2)
            createSpan1hChange[x].innerHTML = (data.data[x].price_change_percentage_1h_in_currency).toFixed(2) + "<span>%</span>"
//nowe funkcje do spiner 06.01.2022
            cryptoSpinName[x].innerHTML = data.data[x].id
            cryptoSpinPrice[x].innerHTML =  "$" + (data.data[x].current_price).toFixed(2)
            cryptoSpinChange[x].innerHTML = (data.data[x].price_change_percentage_1h_in_currency).toFixed(2) + "<span>%</span>"
//spinner          
            
            if(Math.sign(data.data[x].price_change_percentage_1h_in_currency) === -1){
                createSpan1hChange[x].style.color = "#FF2626";
                cryptoSpinChange[x].style.color =  "#FF2626";   
            }else{
                createSpan1hChange[x].style.color = "#6ECB63";
                cryptoSpinChange[x].style.color = "#6ECB63";
            }
            
            }
            
        }
        
        
    
    )
function ifImgEmt(){
    loadingbar.forEach(element => {
        element.style.display = 'none'
    });
    createImage.forEach(element => {
        element.style.display = 'block'
    });
}

function hotToday(data){
    let arga = data.data
    let maxArga = arga.reduce((max, data) => max.price_change_percentage_24h > data.price_change_percentage_24h ? max : data);
    hotCoinRank.innerHTML = "#" + maxArga.market_cap_rank;
    hotCoinId.innerHTML = maxArga.id;
    hotCoinImg.src = maxArga.image;
    hotCoin24Change.innerHTML = (maxArga.price_change_percentage_24h).toFixed(2)+"%";
    hotCoin24Price.innerHTML = "$"+ maxArga.current_price;
    
    if(Math.sign(maxArga.price_change_percentage_24h) === -1){
        hotCoin24Change.style.color = "#FF2626"
    }
    else{
        hotCoin24Change.style.color = "#6ECB63"
    }
}      

function hotThisWeek(data){
    let arga = data.data
    let maxArga = arga.reduce((max, data) => max.price_change_percentage_7d_in_currency > data.price_change_percentage_7d_in_currency ? max : data);
    hotCoinRank7.innerHTML = "#" + maxArga.market_cap_rank;
    hotCoinId7.innerHTML = maxArga.id;
    hotCoinImg7.src = maxArga.image;
    hotCoin7Change.innerHTML = (maxArga.price_change_percentage_7d_in_currency).toFixed(2)+"%";
    hotCoin7Price.innerHTML = "$"+ maxArga.current_price;
    
    if(Math.sign(maxArga.price_change_percentage_7d_in_currency) === -1){
        hotCoin7Change.style.color = "#FF2626"
    }
    else{
        hotCoin7Change.style.color = "#6ECB63"
    }
    
}

function spinner(){
    console.log(spinningContainer.childNodes)
}
    
