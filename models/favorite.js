const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// require('mongoose-currency').loadType(mongoose);
// const Currency = mongoose.Types.Currency;

const favoriteSchema = new Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    campsites: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Campsite'
    }]
});


//create model named campsite using this schema
//constructor function
const Favorite = mongoose.model('Favorite', favoriteSchema);

module.exports = Favorite;