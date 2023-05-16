const mongoose = require('mongoose')

const Data = new mongoose.Schema({
    allCoins: {
        // time and coins with an s and coins is []
        time: {
            type: Number,
            default: 0
        },
        coins: {
            type: [mongoose.Schema.Types.Mixed],
            default: []
        }
    },
    topCoins: {
        // type: mongoose.Schema.Types.Mixed, 
        // default: {},
        time: {
            type: Number,
            default: 0
        },
        coins: {
            type: [mongoose.Schema.Types.Mixed],
            default: []
        }
    },
    bitcoin: {
        time: {
            type: Number,
            default: 0
        },
        coin: {
            dailyChart: {
                type: [mongoose.Schema.Types.Mixed],
                default: []
            },
            info: {
                type: {},
                default: {}
            },
            monthlyChart: {
                type: [mongoose.Schema.Types.Mixed],
                default: []
            },
            yearlyChart: {
                type: [mongoose.Schema.Types.Mixed],
                default: []
            },
            yearlyRaw: {
                type: [mongoose.Schema.Types.Array],
                default: []
            }
        }
    },
    ethereum: {
        time: {
            type: Number,
            default: 0
        },
        coin: {
            dailyChart: {
                type: [mongoose.Schema.Types.Mixed],
                default: []
            },
            info: {
                type: {},
                default: {}
            },
            monthlyChart: {
                type: [mongoose.Schema.Types.Mixed],
                default: []
            },
            yearlyChart: {
                type: [mongoose.Schema.Types.Mixed],
                default: []
            },
            yearlyRaw: {
                type: [mongoose.Schema.Types.Array],
                default: []
            }
        }
    }}, 
    {
    timestamps: {
        createdAt: false,
        updatedAt: true
    }}
)

module.exports = mongoose.model("Data", Data)