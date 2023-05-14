const mongoose = require('mongoose')

const Data = new mongoose.Schema({
    allCoins: {
        type: mongoose.Schema.Types.Mixed, 
        default: {},
    },
    
    bitcoin: {
        type: mongoose.Schema.Types.Mixed, 
        default: {},
    },
    ethereum: {
        type: mongoose.Schema.Types.Mixed, 
        default: {},
    },
    topCoins: {
        type: mongoose.Schema.Types.Mixed, 
        default: {},
        // time: {
        //     type: Number,
        //     default: 0
        // },
        // coins: {
        //     type: [mongoose.Schema.Types.Mixed],
        //     default: []
        // }
    }
}, {
    timestamps: {
        createdAt: false,
        updatedAt: true
    }
})

module.exports = mongoose.model("Data", Data)