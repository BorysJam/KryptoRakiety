const mongoose = require('mongoose');


const msgSchema = new mongoose.Schema({
    username:{
        type:String,
        required: true
    },
    text:{
        type:String
    },
    socketid: {
        type:String,
        required:true
    },
    room:{
        type:String,
        required:true
    },
    czas:{
        type:String
    }
  })


const Msg = mongoose.model('msg', msgSchema);

module.exports = Msg;