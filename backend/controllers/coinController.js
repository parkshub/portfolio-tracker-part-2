// right now, what I need to do is...
// make data save to mongoose, when api is called (WIP)
// if error get data from mongoose and use that as response

const CoinModel = require('../models/Coin')
const UserModel = require('../models/User')
const axios = require('axios')

const DataModel = require('../models/Data')

const { convertDate } = require('../utils/convertDate')



exports.testCoin = async(req, res) => {
    console.log('testCion controller')
    console.log(req.body)
    const {id} = req.params
    // console.log(typeof(req.body.date))
    let yearlyRaw = (await axios.get(`https://api.coingecko.com/api/v3/coins/${id}/market_chart?vs_currency=usd&days=365`)).data.prices
    // console.log(yearlyRaw.forEach(x => console.log(typeof(x[0]))))
    let test = yearlyRaw.filter(x => x.includes(req.body.date))[0][1]
    console.log('this is the price', test)
    res.json("yearlyRaw")
}

exports.test = async(req, res) => {
    const test = await TestModel.findById('641e702e07bc1476ea028ab4').populate('users')
    console.log(test)
    res.json(test)
}

exports.getCoin = async(req, res) => {

    console.log('get coin controller ran')

    const { id, getAll } = req.params

    const truth = getAll === "true"

    if (truth) {
        try {
            console.log("get coin controller api ran")

            const info = (await axios.get(`https://api.coingecko.com/api/v3/coins/${id}`)).data

            let daily = (await axios.get(`https://api.coingecko.com/api/v3/coins/${id}/market_chart?vs_currency=usd&days=1`)).data.prices
            daily = daily.reverse().filter((x, i) => i % 12 === 0).reverse()
            console.log('this is daily', daily)
            const dailyChart = 
            [{
                "id": "daily",
                "color": "hsl(155, 70%, 50%)",
                "data": []
            }]
            // daily.forEach(x => dailyChart[0].data.push({"x": new Date(x[0]).toUTCString().split(' ').slice(4,6).join(' '), "y": Number(x[1].toFixed(2))}))
            daily.forEach(x => dailyChart[0].data.push({"x": new Date(x[0]).toUTCString().split(' ').slice(4,6).join(' ').split(':').slice(0,2).join(':') + ' GMT', "y": Number(x[1].toFixed(2))}))

            
            

            let monthly = (await axios.get(`https://api.coingecko.com/api/v3/coins/${id}/market_chart?vs_currency=usd&days=91`)).data.prices
            monthly = monthly.reverse().filter((x, i) => i % 4 === 0).reverse()
            console.log('this is monthly', monthly)
            const monthlyChart = 
            [{
                "id": "monthly",
                "color": "hsl(155, 70%, 50%)",
                "data": []
            }]
            // monthly.forEach(x => monthlyChart[0].data.push({"x": new Date(x[0]).toUTCString().split(' ').slice(1,4).join(' '), "y": Number(x[1].toFixed(2))}))
            monthly.forEach(x => {
                const temp = new Date(x[0]).toDateString().split(' ')
                const year = "'" + String(temp.slice(3)).split('').slice(2).join('')
                const condensedDate = temp.slice(1,3).join(' ') + ' ' + year
                monthlyChart[0].data.push({"x": condensedDate, "y": Number(x[1].toFixed(2))})
            }) 

            let yearlyRaw = (await axios.get(`https://api.coingecko.com/api/v3/coins/${id}/market_chart?vs_currency=usd&days=365`)).data.prices
            // console.log(yearly)
            let yearly = yearlyRaw.reverse().filter((x, i) => i % 16 === 0).reverse()
            console.log('this is yearly', yearly)
            const yearlyChart = 
            [{
                "id": "yearly",
                "color": "hsl(155, 70%, 50%)",
                "data": []
            }]
            // yearly.forEach(x => yearlyChart[0].data.push({"x": new Date(x[0]).toUTCString().split(' ').slice(1,4).join(' '), "y": Number(x[1].toFixed(2))}))
            yearly.forEach(x => {
                const temp = new Date(x[0]).toDateString().split(' ')
                const year = "'" + String(temp.slice(3)).split('').slice(2).join('')
                const condensedDate = temp.slice(1,3).join(' ') + ' ' + year
                yearlyChart[0].data.push({"x": condensedDate, "y": Number(x[1].toFixed(2))})
            })

            // this should work, but test when available.

            // const data = await DataModel.findOne()
            // data.[id].time = convertDate(new Date())
            // data.[id].coin.info = info
            // data.[id].coin.dailyChart = dailyChart
            // data.[id].coin.monthlyChart = monthlyChart
            // data.[id].coin.yearlyChart = yearlyChart
            // data.[id].coin.yearlyRaw = yearlyRaw


            res.status(201).json({info, dailyChart, monthlyChart, yearlyChart, yearlyRaw})
        } catch (error) {
            res.status(500).send("Axios failed for getCoin")
        }
    } else {
        console.log("get coin controller api didn't need to run")
        res.status(201).json("Using localstorage data")
    }

    // if (!info || !daily || !monthly || !yearly) {
    //     res.status(500).send("Could no retrieve data, please refresh.")
    // }

    // res.status(201).json({info, dailyChart, monthlyChart, yearlyChart, yearlyRaw})
    // res.status(201).json({info, yearlyRaw}) // erase this later
    // res.status(201).json({info}) // erase this later
}

exports.getTopCoins = async(req, res) => {

    const { getTopCoins } = req.params
    
    console.log("getTopCoins controller", getTopCoins)

    const truth = getTopCoins === "true"

    if (truth) { // not sure why but not working without truth statement
        console.log('topcoins gecko api request sent')
        let response = {}
        try {
            console.log('in try of topCoins')
            // response = await axios.get('https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=10&page=1&sparkline=false')

            const data = await DataModel.findOne()
            data.topCoins.time = convertDate(new Date())
            // right now coingecko not giving me data, but this should work
            // make sure to uncomment the above and uncomment below and erase below that
            // data.topCoins.coins = response.data
            data.topCoins.coins = [
                {
                    "id": "bitcoin",
                    "symbol": "btc",
                    "name": "Bitcoin",
                    "image": "https://assets.coingecko.com/coins/images/1/large/bitcoin.png?1547033579",
                    "current_price": 26872,
                    "market_cap": 520384556073,
                    "market_cap_rank": 1,
                    "fully_diluted_valuation": 564095220221,
                    "total_volume": 6925964999,
                    "high_24h": 26978,
                    "low_24h": 26704,
                    "price_change_24h": 102.09,
                    "price_change_percentage_24h": 0.38137,
                    "market_cap_change_24h": 1858909414,
                    "market_cap_change_percentage_24h": 0.3585,
                    "circulating_supply": 19372750,
                    "total_supply": 21000000,
                    "max_supply": 21000000,
                    "ath": 69045,
                    "ath_change_percentage": -61.09705,
                    "ath_date": "2021-11-10T14:24:11.849Z",
                    "atl": 67.81,
                    "atl_change_percentage": 39511.93035,
                    "atl_date": "2013-07-06T00:00:00.000Z",
                    "roi": null,
                    "last_updated": "2023-05-14T06:27:41.432Z"
                },
                {
                    "id": "ethereum",
                    "symbol": "eth",
                    "name": "Ethereum",
                    "image": "https://assets.coingecko.com/coins/images/279/large/ethereum.png?1595348880",
                    "current_price": 1808.83,
                    "market_cap": 222215945658,
                    "market_cap_rank": 2,
                    "fully_diluted_valuation": 222215945658,
                    "total_volume": 4742129637,
                    "high_24h": 1808.65,
                    "low_24h": 1791.17,
                    "price_change_24h": 8.37,
                    "price_change_percentage_24h": 0.46467,
                    "market_cap_change_24h": 5759521309,
                    "market_cap_change_percentage_24h": 2.66082,
                    "circulating_supply": 122896733.17897,
                    "total_supply": 122896733.17897,
                    "max_supply": null,
                    "ath": 4878.26,
                    "ath_change_percentage": -62.93414,
                    "ath_date": "2021-11-10T14:24:19.604Z",
                    "atl": 0.432979,
                    "atl_change_percentage": 417511.42671,
                    "atl_date": "2015-10-20T00:00:00.000Z",
                    "roi": {
                        "times": 89.02184430572198,
                        "currency": "btc",
                        "percentage": 8902.184430572199
                    },
                    "last_updated": "2023-05-14T06:27:38.704Z"
                },
                {
                    "id": "tether",
                    "symbol": "usdt",
                    "name": "Tether",
                    "image": "https://assets.coingecko.com/coins/images/325/large/Tether.png?1668148663",
                    "current_price": 1.001,
                    "market_cap": 82853270173,
                    "market_cap_rank": 3,
                    "fully_diluted_valuation": 82853270173,
                    "total_volume": 7324087716,
                    "high_24h": 1.004,
                    "low_24h": 0.998164,
                    "price_change_24h": -0.000205277047746089,
                    "price_change_percentage_24h": -0.02051,
                    "market_cap_change_24h": -30043531.848388672,
                    "market_cap_change_percentage_24h": -0.03625,
                    "circulating_supply": 82797235449.0672,
                    "total_supply": 82797235449.0672,
                    "max_supply": null,
                    "ath": 1.32,
                    "ath_change_percentage": -24.3685,
                    "ath_date": "2018-07-24T00:00:00.000Z",
                    "atl": 0.572521,
                    "atl_change_percentage": 74.78429,
                    "atl_date": "2015-03-02T00:00:00.000Z",
                    "roi": null,
                    "last_updated": "2023-05-14T06:25:01.346Z"
                },
                {
                    "id": "binancecoin",
                    "symbol": "bnb",
                    "name": "BNB",
                    "image": "https://assets.coingecko.com/coins/images/825/large/bnb-icon2_2x.png?1644979850",
                    "current_price": 312.6,
                    "market_cap": 49340038029,
                    "market_cap_rank": 4,
                    "fully_diluted_valuation": 62500729043,
                    "total_volume": 290614998,
                    "high_24h": 312.66,
                    "low_24h": 309.15,
                    "price_change_24h": 2.72,
                    "price_change_percentage_24h": 0.87675,
                    "market_cap_change_24h": 393173854,
                    "market_cap_change_percentage_24h": 0.80327,
                    "circulating_supply": 157886280,
                    "total_supply": 157900174,
                    "max_supply": 200000000,
                    "ath": 686.31,
                    "ath_change_percentage": -54.46588,
                    "ath_date": "2021-05-10T07:24:17.097Z",
                    "atl": 0.0398177,
                    "atl_change_percentage": 784736.05855,
                    "atl_date": "2017-10-19T00:00:00.000Z",
                    "roi": null,
                    "last_updated": "2023-05-14T06:27:36.299Z"
                },
                {
                    "id": "usd-coin",
                    "symbol": "usdc",
                    "name": "USD Coin",
                    "image": "https://assets.coingecko.com/coins/images/6319/large/USD_Coin_icon.png?1547042389",
                    "current_price": 1.001,
                    "market_cap": 29991237049,
                    "market_cap_rank": 5,
                    "fully_diluted_valuation": 29991237117,
                    "total_volume": 1373470810,
                    "high_24h": 1.003,
                    "low_24h": 0.997764,
                    "price_change_24h": 0.00048881,
                    "price_change_percentage_24h": 0.04887,
                    "market_cap_change_24h": 15572906,
                    "market_cap_change_percentage_24h": 0.05195,
                    "circulating_supply": 29977410053.3971,
                    "total_supply": 29977410121.9971,
                    "max_supply": null,
                    "ath": 1.17,
                    "ath_change_percentage": -14.68675,
                    "ath_date": "2019-05-08T00:40:28.300Z",
                    "atl": 0.877647,
                    "atl_change_percentage": 13.99505,
                    "atl_date": "2023-03-11T08:02:13.981Z",
                    "roi": null,
                    "last_updated": "2023-05-14T06:27:41.334Z"
                },
                {
                    "id": "ripple",
                    "symbol": "xrp",
                    "name": "XRP",
                    "image": "https://assets.coingecko.com/coins/images/44/large/xrp-symbol-white-128.png?1605778731",
                    "current_price": 0.428149,
                    "market_cap": 22174718500,
                    "market_cap_rank": 6,
                    "fully_diluted_valuation": 42777104214,
                    "total_volume": 381046532,
                    "high_24h": 0.428841,
                    "low_24h": 0.423655,
                    "price_change_24h": 0.00053744,
                    "price_change_percentage_24h": 0.12569,
                    "market_cap_change_24h": 22050149,
                    "market_cap_change_percentage_24h": 0.09954,
                    "circulating_supply": 51837820505,
                    "total_supply": 99988965239,
                    "max_supply": 100000000000,
                    "ath": 3.4,
                    "ath_change_percentage": -87.41341,
                    "ath_date": "2018-01-07T00:00:00.000Z",
                    "atl": 0.00268621,
                    "atl_change_percentage": 15823.90135,
                    "atl_date": "2014-05-22T00:00:00.000Z",
                    "roi": null,
                    "last_updated": "2023-05-14T06:27:36.820Z"
                },
                {
                    "id": "cardano",
                    "symbol": "ada",
                    "name": "Cardano",
                    "image": "https://assets.coingecko.com/coins/images/975/large/cardano.png?1547034860",
                    "current_price": 0.369248,
                    "market_cap": 12934815105,
                    "market_cap_rank": 7,
                    "fully_diluted_valuation": 16609112106,
                    "total_volume": 134037268,
                    "high_24h": 0.369431,
                    "low_24h": 0.36356,
                    "price_change_24h": 0.00139158,
                    "price_change_percentage_24h": 0.37829,
                    "market_cap_change_24h": 51858507,
                    "market_cap_change_percentage_24h": 0.40254,
                    "circulating_supply": 35045020830.3234,
                    "total_supply": 45000000000,
                    "max_supply": 45000000000,
                    "ath": 3.09,
                    "ath_change_percentage": -88.04333,
                    "ath_date": "2021-09-02T06:00:10.474Z",
                    "atl": 0.01925275,
                    "atl_change_percentage": 1817.08704,
                    "atl_date": "2020-03-13T02:22:55.044Z",
                    "roi": null,
                    "last_updated": "2023-05-14T06:27:41.085Z"
                },
                {
                    "id": "staked-ether",
                    "symbol": "steth",
                    "name": "Lido Staked Ether",
                    "image": "https://assets.coingecko.com/coins/images/13442/large/steth_logo.png?1608607546",
                    "current_price": 1806.66,
                    "market_cap": 11987093188,
                    "market_cap_rank": 8,
                    "fully_diluted_valuation": 11987093188,
                    "total_volume": 12475834,
                    "high_24h": 1809.16,
                    "low_24h": 1788.29,
                    "price_change_24h": 8.56,
                    "price_change_percentage_24h": 0.47612,
                    "market_cap_change_24h": 93440419,
                    "market_cap_change_percentage_24h": 0.78563,
                    "circulating_supply": 6630632.89573204,
                    "total_supply": 6630632.89573204,
                    "max_supply": 6630632.89573204,
                    "ath": 4829.57,
                    "ath_change_percentage": -62.56733,
                    "ath_date": "2021-11-10T14:40:47.256Z",
                    "atl": 482.9,
                    "atl_change_percentage": 274.37383,
                    "atl_date": "2020-12-22T04:08:21.854Z",
                    "roi": null,
                    "last_updated": "2023-05-14T06:27:11.532Z"
                },
                {
                    "id": "dogecoin",
                    "symbol": "doge",
                    "name": "Dogecoin",
                    "image": "https://assets.coingecko.com/coins/images/5/large/dogecoin.png?1547792256",
                    "current_price": 0.072275,
                    "market_cap": 10069885763,
                    "market_cap_rank": 9,
                    "fully_diluted_valuation": null,
                    "total_volume": 192646239,
                    "high_24h": 0.072316,
                    "low_24h": 0.071492,
                    "price_change_24h": 0.00005885,
                    "price_change_percentage_24h": 0.08149,
                    "market_cap_change_24h": 17066486,
                    "market_cap_change_percentage_24h": 0.16977,
                    "circulating_supply": 139338386383.705,
                    "total_supply": null,
                    "max_supply": null,
                    "ath": 0.731578,
                    "ath_change_percentage": -90.12142,
                    "ath_date": "2021-05-08T05:08:23.458Z",
                    "atl": 0.0000869,
                    "atl_change_percentage": 83060.44993,
                    "atl_date": "2015-05-06T00:00:00.000Z",
                    "roi": null,
                    "last_updated": "2023-05-14T06:27:34.963Z"
                },
                {
                    "id": "solana",
                    "symbol": "sol",
                    "name": "Solana",
                    "image": "https://assets.coingecko.com/coins/images/4128/large/solana.png?1640133422",
                    "current_price": 21.15,
                    "market_cap": 8359002762,
                    "market_cap_rank": 10,
                    "fully_diluted_valuation": 11573945230,
                    "total_volume": 254362466,
                    "high_24h": 21.25,
                    "low_24h": 20.67,
                    "price_change_24h": 0.071944,
                    "price_change_percentage_24h": 0.34137,
                    "market_cap_change_24h": 27474538,
                    "market_cap_change_percentage_24h": 0.32977,
                    "circulating_supply": 395475572.122671,
                    "total_supply": 547578789.221865,
                    "max_supply": null,
                    "ath": 259.96,
                    "ath_change_percentage": -91.86959,
                    "ath_date": "2021-11-06T21:54:35.825Z",
                    "atl": 0.500801,
                    "atl_change_percentage": 4120.38573,
                    "atl_date": "2020-05-11T19:35:23.449Z",
                    "roi": null,
                    "last_updated": "2023-05-14T06:27:43.045Z"
                }
            ]
            await data.save()

            if (response.data) {
                return res.status(201).json(response.data)
            } else {
                console.log('in error of topcoins')
                return res.status(500).send("Could not load data")
            } 
        } catch (error) {
            console.log('in error of topcoins')
            res.status(500).send("Axios failed for getTopCoins")
        }
          
    } else {
        console.log('topcoins gecko api request NOT NEEDED')
        return res.status(201).json("Using localstorage data")
    }
}

exports.getAllCoins = async(req, res) => {

    const { getAllCoins } = req.params

    console.log("this is truth in controller" , getAllCoins)

    const truth = getAllCoins === "true"

        
    if (truth) {
        console.log('allcoins gecko api request sent')

        let response = {}
        try {
            response = await axios.get('https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=100&page=1&sparkline=false')
            // response = await axios.get('https://api.3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=100&page=1&sparkline=false')

            const data = await DataModel.findOne()

            data.allCoins.time = convertDate(new Date())
            data.allCoins.coins = response.data
            await data.save()


            if (response.data) {
                res.status(201).json(response.data)
            }
            else {
                // if fetching data fails...
                    // get most recent from mongoose and send allCoins

                res.status(500).send("Could not load data")
            }  
        } catch (error) {
            console.log('there was error')
            const data = await DataModel.findOne()
            res.json(data.allCoins.coins)

            
            // res.status(500).send("Axios failed for getAllCoins")
        }
    } else {
        console.log('allcoins gecko api request NOT NEEDED')
        res.status(201).json("Using localstorage data")
    }
}

exports.txCoin = async(req, res) => {
    console.log('tx controller received ', req.body)
    const userId = req.user.id
    const { coinId, coinSymbol, coinImage, amount, price, date, type, total } = req.body

    if (type === 'sell') {
        let tx = await UserModel.findById(userId).populate('transactions')
        tx = tx.transactions.filter((x) => x.coinId == coinId && x.date <= date)
        let totalAmount = 0
        tx.forEach(x => {
            if (x.type == 'buy') {
                return totalAmount += x.amount
            } else { return totalAmount -= x.amount }
        })
        console.log(totalAmount)
        console.log(totalAmount)

        if (totalAmount < amount) {
            return res.status(401).send(`Total amount in portfolio on ${new Date(date).toDateString()} is less than sell amount.`)
        }
    }


    
    const coin = await CoinModel.create({
        userId: userId,
        coinId,
        coinSymbol,
        coinImage,
        amount,
        price,
        date,
        type: type === 'buy' ? 'buy' : 'sell',
        // type,
        total
    })
    
    const user = await UserModel.findByIdAndUpdate(coin.userId, {
        $push: {transactions: coin.id}
    },{new: true}).populate('transactions')

    const transactions = user.transactions.sort((a,b) => b.date - a.date)

    res.json(transactions)
}

exports.getTx = async(req, res) => {
    
    const userId = req.user.id 
    const user = await UserModel.findById(userId).populate("transactions")
    const transactions = user.transactions.sort((a,b) => b.date - a.date)
    // console.log(transactions)
    // const sortedTransactions = transactions.sort((a,b) => a.date - b.date)
    res.json(transactions)
}


exports.deleteTx = async(req, res) => {
    // const userId = req.user
    const userId = req.user.id
    const { id } = req.params
    console.log(id)
    // const userId = "64211e27e309862615151ac6"

    // make sure to sort the tx by date

    await CoinModel.findByIdAndDelete(id)
    await UserModel.updateOne(
        {_id: userId},
        { $pull: { transactions: id}}
    )

    const user = await UserModel.findById(userId).populate('transactions')

    // const transactions = user.transactions.sort((a,b) => b.date - a.date)
    const transactions = user.transactions.sort((a,b) => b.date - a.date)

    res.json(transactions)
    // res.json(user.transactions)
}