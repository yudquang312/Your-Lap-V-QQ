const mongoose = require('mongoose');
const nsxSChema = new mongoose.Schema({
    name: {
        type: String,
        min: 10,
        require: true
    },
    nation: {
        type: String,
        require: true
    },
    deleteAt: {
        type: Date
    }   
}, { timestamps: true });

const NSX = mongoose.model('NSX', nsxSChema);
module.exports = NSX;