const moment = require('moment')
function formatFileMessage(username, file){
    return{
        username,
        file,
        czas: moment().format('HH:mm')
    }
}
module.exports = formatFileMessage;