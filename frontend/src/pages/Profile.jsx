import React, { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux';

import { getTx } from '../features/coin/coinSlice';
import { getCoin } from '../features/coin/coinSlice';

import ExamplePie from '../components/ExamplePie'
import ExampleLine from '../components/ExampleLine'
import TxCell from '../components/TxCell'

import { generatePieData } from '../utils/generatePieData';
import { generateLineData } from '../utils/generateLineData';
import { convertDate } from '../utils/convertDate';
import { lineData } from '../utils/data';

import { TextField, Box, Table, TableBody, TableCell, TableContainer, TableHead, TablePagination, TableRow, Grid, Container, Typography, Tabs, Tab } from '@mui/material';
import { tableCellClasses } from "@mui/material/TableCell";




import { authenticate } from '../features/user/userSlice';
import { resetUser } from '../features/user/userSlice';
import { useNavigate } from 'react-router-dom';

import { toast } from 'react-toastify';



const Profile = () => {

    const dispatch = useDispatch()
    const navigate = useNavigate()

    const { user } = useSelector((state) => state.auth)
    const { coins, isPending, isRejected, message } = useSelector((state) => state.coin)
        
    const [value, setValue] = useState('daily');
    const [filteredCoinState, setFilteredCoinState] = useState(coins)
    const [page, setPage] = useState(0)
    const [rowsPerPage, setRowsPerPage] = useState(5)
    const [lineGraph, setLineGraph] = useState('')

    const pieData = generatePieData(coins)

    const handleChange = (event, newValue) => {
        setValue(newValue);
    };

    const handleSearchChange = (event) => {
        const filteredCoins = coins.filter(x => x.coinId.includes(event.target.value) || x.coinSymbol.includes(event.target.value))
        setFilteredCoinState(filteredCoins)
    }

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    }

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    }

    const lineDataFunc = async() => {
        console.log('linedatafunc is using coins', coins)
        const uniqueCoinsUser = Object.keys(coins[0]).includes('userId') ? [...new Set(coins.map(coin => coin.coinId))] : []
        const cache = {}

        console.log('these are unique coins user', uniqueCoinsUser)

        Object.entries(localStorage).forEach((x) => {
            if (uniqueCoinsUser.includes(x[0])) { 
                cache[x[0]]=JSON.parse(x[1]) 
            }
        })

        const missing = []
        const today = new Date().getTime()

        uniqueCoinsUser.forEach((x) => {

            console.log('this is unique entry', x)

            if(!Object.keys(cache).includes(x) || today - cache[x]['time'] > 86400000) {
                missing.push(x)
            }
        })
        console.log('these are all missing', missing)

        if (missing.length > 0) {
            for (let i of missing) {
                console.log('there are missing one is ', i)
                await dispatch(getCoin(i))
                cache[i] = JSON.parse(localStorage.getItem(i))
            }
        }

        const lineData = generateLineData(cache, uniqueCoinsUser, coins)
        setLineGraph(lineData)
    }


    const authAsync = async() => {

        const truth = await dispatch(authenticate())
        console.log('these were the AUTH results', truth.payload)

        if (truth.payload === 'verified') {
            console.log('here in truth')
            dispatch(getTx())
        } else if (truth.payload === 'expired') {
            
            localStorage.removeItem('user')
            dispatch(resetUser())
            navigate('/main')
            toast.warn('Token expired, redirecting to main page', {
                toastId: "your-id"
              });
        }
    }

    useEffect(() => {

        authAsync()
        // if (dispatch(authenticate()) === true) {
        //     dispatch(getTx())
        // } else {
        //     localStorage.removeItem('user')
        //     dispatch(resetUser())
        //     navigate('/main')
        //     toast.warn('token expired going to main', {
        //         toastId: "your-id"
        //       });
        // }
        
    },[dispatch])

    useEffect(() => {
        setFilteredCoinState(coins)

        if (coins.length > 0) {
            lineDataFunc()
        } else {
        }
    }, [coins]) 

    return (

        <Container maxWidth="xl">
            <Grid container sx={{marginBottom: 4, marginTop: 4}} justifyContent='center'>
                <Table
                    sx={{
                        [`& .${tableCellClasses.root}`]: {
                            borderBottom: "none"
                        },
                        width: 500
                    }}
                >
                    <TableHead>
                        <TableRow>
                            <TableCell style={{ verticalAlign: 'top'}}>
                                Profit
                            </TableCell>
                            <TableCell style={{ verticalAlign: 'top' }}>
                                %Profit
                            </TableCell>
                            <TableCell style={{ verticalAlign: 'top' }}>
                                Allocation
                            </TableCell>
                            <TableCell style={{ verticalAlign: 'top' }}>
                                Current Value
                            </TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        <TableRow>
                            {lineGraph && lineGraph.overview.profit !== undefined && 
                            <>
                            <TableCell style={{ verticalAlign: 'bottom' }}>
                                <Typography variant='p' color={lineGraph.overview.profit < 0 ? 'secondary' : 'primary'}>
                                    {lineGraph.overview.profit < 0 ? '-' : '+'}${lineGraph.overview.profit.toLocaleString()} 
                                </Typography>
                            </TableCell>
                            <TableCell>
                                <Typography variant='p' color={lineGraph.overview.profit < 0 ? 'secondary' : 'primary'}>
                                    {lineGraph.overview.profit < 0 ? '-' : '+'}{lineGraph.overview.profitPercent}
                                </Typography>                        
                            </TableCell>
                            <TableCell>
                                <Typography variant='p' color={lineGraph.overview.profit < 0 ? 'secondary' : 'primary'}>
                                    ${lineGraph.overview.allocated.toLocaleString()}
                                </Typography>                        
                            </TableCell>
                            <TableCell> 
                                <Typography variant='p' color={lineGraph.overview.profit < 0 ? 'secondary' : 'primary'}>
                                    ${lineGraph.overview.currentValue.toLocaleString()}
                                </Typography>
                            </TableCell>
                            </>
                            }
                        </TableRow>
                    </TableBody>
                </Table>
            </Grid>

            <Grid container sx={{marginBottom: 10}}>

                { pieData !== '' &&
                <Grid item container height={350} xs={12} sm={6}>
                    <ExamplePie data={pieData}></ExamplePie>
                </Grid>
                }

                { lineGraph !== '' &&
                <>
                <Grid item container height={350} xs={12} sm={6}>
                    <ExampleLine data={lineGraph[value]} />
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
                </>
                }
            </Grid>
            
            <TextField label='Search' variant='standard' onChange={handleSearchChange}></TextField>

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
                        { filteredCoinState.length > 0 && filteredCoinState[0].userId &&
                            filteredCoinState.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((coin) => {
                                return (
                                    <TxCell key={coin._id} coin={coin}/>
                                )
                            })
                        }                        
                        <TablePagination
                            showFirstButton={true}
                            showLastButton={true}
                            rowsPerPageOptions={[5, 10, 25]}
                            // component="div"
                            count={filteredCoinState.length}
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

export default Profile

