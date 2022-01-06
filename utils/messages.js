const moment = require('moment');
moment().locale('pl')
function formatMessage(username, text){
    return{
        username,
        text,
        czas: moment().format('MMMM Do HH:mm')
    }
}


module.exports = formatMessage;