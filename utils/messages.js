const moment = require('moment')
function formatMessage(username, text){
    return{
        username,
        text,
        czas: moment().format('HH:mm')
    }
}


module.exports = formatMessage;