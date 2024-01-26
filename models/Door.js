const mongoose = require('mongoose');

const dataSchema = new mongoose.Schema({
    id_door: {
        type: Number, required: true
    },
    enter: { 
        type: Boolean, required: true 
    },
    date: {
        type: String, required: true
    }

});

const Door = mongoose.model('Door', dataSchema);

module.exports = Door;