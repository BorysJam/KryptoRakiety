const moment = require('moment')
function formatMessage(username, text){
    return{
        username,
        text,
        czas: moment().format('MMMM Do h:mm')
    }
}


module.exports = formatMessage;