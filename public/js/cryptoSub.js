let size;
const ctx = document.getElementById('myChart').getContext('2d');
//Chart.defaults.font.size =size;
function screenSizeMatters(){
    if(window.innerWidth < 600){
        smallScreen()
        Chart.defaults.font.size = size;
    }else{
        bigScreen()
        Chart.defaults.font.size = size;
    }
}
screenSizeMatters()

function smallScreen(){
    size = 10
    return size
}
function bigScreen(){
    size = 14
   
    return size
}
let myChart;
const selectOtption = document.querySelector('select')
const cryptoSubImageDiv = document.querySelector('.cryptoSubImageDiv')
const cryptoSubImg = document.querySelector('.cryptoSubImg')
const cryptoSubProcent = document.querySelector('.cryptoSubProcent')
const cryptoSubID = document.querySelector('.cryptoSubID')
const cryptoSubPRICE = document.querySelector('.cryptoSubPRICE')
const cryptoSub1h = document.querySelector('.cryptoSubMARKETCAP')
const marketCapRank = document.querySelector('.marketCapRank')
const CirculatingSupply = document.querySelector('.CirculatingSupply')
const cryptoSub24highlow = document.querySelector('.cryptoSub24highlow')
const cryptoSubMaxSupply = document.querySelector('.cryptoSubMaxSupply')
const crypoMarketDominance = document.querySelector('.crypoMarketDominance')
const priceChangePercentage_24h = document.querySelector('.priceChangePercentage_24h')
const priceChangePercentage7d = document.querySelector('.priceChangePercentage_7d')
const priceChangePercentage14d = document.querySelector('.priceChangePercentage_14d')
const priceChangePercentage30d = document.querySelector('.priceChangePercentage_30d')
const priceChangePercentage_1y = document.querySelector('.priceChangePercentage_1y')
const cryptoHomePage = document.querySelector('.cryptoHomePage')
var arr= []

const charter = document.getElementById('myChart')

function odpal(){
    
    start()
}

const info = document.querySelector('.tresc').innerHTML;
async function fetchJSON(){ 
    screenSizeMatters()
    const res = await fetch(`https://api.coingecko.com/api/v3/coins/${info}`)
   
   
   
    const data = await res.json()
   
    
    return data;
}
fetchJSON().then((data =>{
    cryptoSubID.innerHTML = data.id + ` (${data.symbol})`;
    cryptoSubProcent.innerHTML = (data.market_data.price_change_percentage_24h).toPrecision(3) + "%";
    cryptoSubPRICE.innerHTML = "Cena: " + `<span>` + " $" +  data.market_data.current_price.usd +`</span>`;
    cryptoSub1h.innerHTML = "Wartość rynku: " + `<span>` +" $"+((data.market_data.market_cap.usd).toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.')) +  `</span>`;
    cryptoSubImg.src = data.image.small;
    cryptoSub24highlow.innerHTML = "24h Wysoki / Niski: " + '<span>' +"$" + data.market_data.high_24h.usd + " / "  + '$' + data.market_data.low_24h.usd + '</span>'
    marketCapRank.innerHTML = '<span>' + "#" + data.market_data.market_cap_rank + '</span>';
    CirculatingSupply.innerHTML = "Ilość w obiegu:" + "<span>" + ((data.market_data.circulating_supply).toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.')) + "</span>"
    if(data.links.homepage[0].length > 0){
        cryptoHomePage.href = data.links.homepage[0];
        cryptoHomePage.innerHTML = data.links.homepage[0];
    }
    if(data.market_data.max_supply !== null){
        cryptoSubMaxSupply.innerHTML = "Ilość maksymalna: " + "<span>" + ((data.market_data.max_supply).toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.')) + "</span>";
    }else{
        cryptoSubMaxSupply.innerHTML = "Ilość maksymalna: " + "<span>" + "Brak Danych" + "</span>";
    }
    priceChangePercentage_24h.innerHTML = "Zmiana 24h:" + "<span class='span24'>" + (data.market_data.price_change_percentage_24h).toPrecision(3) + "%" +"</span>";
    priceChangePercentage7d.innerHTML = "Zmiana 7d:" + "<span class='span7'>" + (data.market_data.price_change_percentage_7d).toPrecision(3) + "%" +"</span>";
    priceChangePercentage14d.innerHTML = "Zmiana 14d:" + "<span class='span14'>" + (data.market_data.price_change_percentage_14d).toPrecision(3) + "%" + "</span>";
    priceChangePercentage30d.innerHTML = "Zmiana 30d:" + "<span class='span30'>" + (data.market_data.price_change_percentage_30d).toPrecision(3) + "%" +"</span>";
    priceChangePercentage_1y.innerHTML = "Zmiana 1r:" + "<span class='span1y'>" + (data.market_data.price_change_percentage_1y).toFixed(1) + "%" +"</span>";

    if(Math.sign((data.market_data.price_change_percentage_24h)) === -1){
        cryptoSubProcent.style.color = "red";
        document.querySelector('.span24').style.color = "red";
    }else{
        cryptoSubProcent.style.color = "green"
        document.querySelector('.span24').style.color = "green";
    }
    if(Math.sign(data.market_data.price_change_percentage_7d) === -1){
        document.querySelector('.span7').style.color = "red"
    }else{
        document.querySelector('.span7').style.color = "green"
    }
    if(Math.sign(data.market_data.price_change_percentage_14d) === -1){
        document.querySelector('.span14').style.color = "red"
    }else{
        document.querySelector('.span14').style.color = "green"
    }
    if(Math.sign(data.market_data.price_change_percentage_30d) === -1){
        document.querySelector('.span30').style.color = "red"
    }else{
        document.querySelector('.span30').style.color = "green"
    }
  
    if(Math.sign(data.market_data.price_change_percentage_1y) === -1){
    document.querySelector('.span1y').style.color = "red"
    }else{
        document.querySelector('.span1y').style.color = "green"
    }

    
}))
function start(){
async function fetchChartData(){
    let res = await fetch(`https://api.coingecko.com/api/v3/coins/${info}/market_chart?vs_currency=usd&days=${selectOtption.value}`)

    const data = await res.json()

    return data
}
fetchChartData().then((data=>{
    if(myChart !== undefined){
        myChart.destroy()
    }
    createChart(data)
    
}))
function createChart(data){
   
    let arrCena = []
    let arrCzas = []
    arr = []
    arr.push(data.prices)

    arr[0].forEach(e => {
        
        let nowyCzas = new Date(e[0])
        let ddMMrrrr = nowyCzas.getFullYear() + "-" + (nowyCzas.getMonth()+1) + "-" + nowyCzas.getDate()
        
        arrCzas.push(ddMMrrrr)
        arrCena.push(e[1])
        
    })

    const options = {
        type: 'line',
        data: {
            labels: arrCzas,
            datasets: [{
                label: '$ cena w dolarach',
                data: arrCena,
                fill:1,
                backgroundColor: [
                    '#432c72',
                    
                ],
                borderColor: [
                    '#432c72',
                    
                ],
                
                borderWidth: 2,
                pointRadius: 0.4
            }]
        },
        options: {
            plugins: {
                legend: {
                    labels: {
                        // This more specific font property overrides the global property
                        font: {
                            size: 16
                        }
                    
                }
            }
        },
            scales: {
                y: {
                    beginAtZero: false,
                    
                }
                
                
            }
        }
}

    myChart = new Chart(ctx, options);
   
    return myChart  
}
}

const fullScreenBtn = document.querySelector('.fullScreen')
fullScreenBtn.addEventListener('click', ()=>{
    charter.requestFullscreen()
})
   



start()
