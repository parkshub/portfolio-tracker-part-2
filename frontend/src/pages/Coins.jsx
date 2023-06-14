// make it so that there is a warning if user presses buy or sell button when their token expired

// make it so that if you're not logged in you don't see the buy and sell button

// make it so that it says something like...to see tx log in or sign up to start tracking

import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useParams } from 'react-router-dom'
import { toast } from 'react-toastify'

import { getTx, getCoin, resetCoin } from '../features/coin/coinSlice';
// import { getCoin,resetCoin } from '../features/coin/coinSlice'
// import { resetCoin } from '../features/coin/coinSlice'

import ExampleLine from '../components/ExampleLine'
import BuySell from '../components/BuySell'
import TxCell from '../components/TxCell'
import Divider from '@mui/material/Divider';


import { Grid, Typography, Box, Container, Tabs, Tab, Table, TableBody, TableCell, TableContainer, TableHead, TablePagination, TableRow} from '@mui/material'


import { authenticate } from '../features/user/userSlice';
import { resetUser } from '../features/user/userSlice';
import { useNavigate } from 'react-router-dom';

const Coins = () => {

    const dispatch = useDispatch()

    const { id } = useParams()

    const { coin, coins, isPending, isRejected, message } = useSelector((state) => state.coin)
    const { user } = useSelector((state) => state.auth)

    const [filteredCoins, setFilteredCoins] = useState(coins === undefined ? [] : coins.filter((x) => x.coinId == id))
    const [value, setValue] = useState('daily');
    const [chartData, setChartData] = useState(coin.dailyChart) 
    const [page, setPage] = useState(0)
    const [rowsPerPage, setRowsPerPage] = useState(5)

    const handleChange = (event, newValue) => {
        setValue(newValue);
    };

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    }

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    }

    const authAsync = async() => {

        const truth = await dispatch(authenticate())
        console.log('these were the AUTH results', truth.payload)

        if (truth.payload === 'verified') {
            console.log('here in truth')
            dispatch(getTx())
        } else if (truth.payload === 'expired') {
            console.log('here in false')
            localStorage.removeItem('user')
            dispatch(resetUser())
            toast.warn('Token expired, login again to see transactions', {
                toastId: "your-id"
              });
        }
    }

    useEffect(() => {

        dispatch(getCoin(id))

        authAsync()

        return () => {
            dispatch(resetCoin())
        }
    },[dispatch, id])

    useEffect(() => {
        setFilteredCoins(coins === undefined ? [] : coins.filter((x) => x.coinId == id))
    }, [coins])

    useEffect(() => {
        setChartData(coin[value + 'Chart'])
    },[coin, value])

    if (isRejected) {
        toast.warn(message, {
            toastId: "your-id"
          });
    }

    return (
        <Container maxWidth="xl">
            <Grid container sx={{m: 4}}>
                { coin !== '' &&
                    <Grid item container xs={12}>
                        <Grid item xs={12} md={6} textAlign="center" height={400}>
                            <img src={coin.info.image.large} height={200} alt="" />
                            <Typography variant='h6'>{coin.info.name}: {coin.info.symbol.toUpperCase()}</Typography>
                            <Typography variant='h6'>Rank: {coin.info.market_cap_rank}</Typography>
                            <Typography variant='h6'>${coin.info.market_data.current_price.usd}</Typography>
                            <Typography variant='h6'>Daily % Change: 
                                <Typography variant="span"color={String(coin.info.market_data.price_change_percentage_24h).startsWith('-') ? 'secondary' : 'primary'}> {coin.info.market_data.price_change_percentage_24h.toFixed(2)}%
                                </Typography>
                            </Typography>

                            { user &&
                                <Grid item container justifyContent='center'>
                                    <BuySell transaction={"buy"} yearlyData={coin.yearlyRaw} coinInfo={coin.info}></BuySell>
                                    <BuySell transaction={"sell"} yearlyData={coin.yearlyRaw} coinInfo={coin.info}></BuySell>
                                </Grid>
                            }
                        </Grid>


                        <Grid item container xs={12} md={6} height={400} direction="row">
                        
                            <Grid item container height={350} xs={12}>
                                <ExampleLine data={chartData} />
                            </Grid>

                            <Grid item xs={12}>
                                <Box sx={{ width: '100%' }} display="flex" justifyContent="center">
                                    <Tabs
                                        value={value}
                                        onChange={ handleChange }
                                        textColor="primary"
                                        indicatorColor="primary"
                                        aria-label="secondary tabs example"
                                    >
                                        <Tab value="daily" label="daily" sx={{ fontSize: 10 }}/>
                                        <Tab value="monthly" label="monthly" sx={{ fontSize: 10 }}/>
                                        <Tab value="yearly" label="yearly" sx={{ fontSize: 10 }}/>
                                    </Tabs>
                                </Box>                    
                            </Grid>

                        </Grid>
                    </Grid>
                }
            </Grid>
            <Divider orientation="horizontal" flexItem>
                
                { user ? 
                    <Typography>Past Transactions</Typography> :
                    <Typography>Login or Sign Up to Track Transactions</Typography>
                }
                
            </Divider>
            <TableContainer>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>
                                Date
                            </TableCell>
                            <TableCell>
                                Logo
                            </TableCell>
                            <TableCell>
                                Name: Ticker
                            </TableCell>
                            <TableCell>
                                Tx Type
                            </TableCell>
                            <TableCell>
                                Price
                            </TableCell>
                            <TableCell>
                                Amount
                            </TableCell>
                            <TableCell>
                                Total
                            </TableCell>
                            <TableCell>
                                
                            </TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        { filteredCoins.length > 0 &&
                            filteredCoins.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((coin) => {
                                return (
                                    <TxCell coin={coin}/>
                                )
                            })
                        }
                        <TablePagination
                            showFirstButton={true}
                            showLastButton={true}
                            rowsPerPageOptions={[5, 10, 25]}
                            count={filteredCoins.length}
                            rowsPerPage={rowsPerPage}
                            page={page}
                            onPageChange={handleChangePage}
                            onRowsPerPageChange={handleChangeRowsPerPage}
                        />  
                    </TableBody>
                </Table>
            </TableContainer>
        </Container>
            
    )
}

export default Coins