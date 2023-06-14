import React, { useEffect, useState } from 'react'
import { useSelector, useDispatch } from "react-redux"
import { toast } from 'react-toastify';

import { getTopCoins, resetCoin } from '../features/coin/coinSlice';
import { reset } from '../features/user/userSlice';

import Carousel from '../components/Carousel';
import Login from '../components/Login'
import SignUp from '../components/SignUp'
import ExmaplePie from '../components/ExamplePie'
import ExampleLine from '../components/ExampleLine'

import { pieData } from '../utils/data'
import lineData from '../utils/lineData';

import { Grid, Typography, Box, Container, Tabs, Tab, Divider} from '@mui/material'

const Main = () => {
    const dispatch = useDispatch()
    
    const { user, isFulfilled, isRejected, message } = useSelector((state) => state.auth)
    const { coins, isPending } = useSelector((state) => state.coin)

    const [value, setValue] = useState('daily');

    const handleChange = (event, newValue) => {
        setValue(newValue);
    };

    useEffect(() => {
        dispatch(getTopCoins())

        return () => {
            dispatch(resetCoin())
            dispatch(reset())
        }
    }, [dispatch])

    if (isPending) {
        return ( 
            <div>LOADING</div>
        )
    }

    if (isRejected) {
        toast.warn(message, {
            toastId: "your-id"
          });
    }

    if (isFulfilled) {
        toast('Sign in successful, welcome.', {
            toastId: "your-id"
          });
    }

  return (
    <>
        <Container maxWidth="xl">
            <Grid container textAlign='center' sx={{width: "100%"}}>
                <Grid item xs={12}>
                    <Typography variant='h1'>
                        Welcome
                    </Typography>

                    <Typography sx={{paddingRight: 20, paddingLeft:20, fontSize: 20, fontStyle: 'italic'}}>
                        Use our website to manage your portfolio. We are currently tracking the price and performance of the top 100 coins by market capitalization. Login or sign up to get utilize all the features we have to offer!
                    </Typography>

                    { !user &&
                        <Grid item container justifyContent='center'>
                                <SignUp navbar={false}/>
                                <Login navbar={false}/>
                        </Grid>
                    }
                </Grid>

                <Grid item container xs={12}>
                    <Grid item xs={12} sm={6} height={400}>
                        <ExmaplePie data={pieData}/> 
                    </Grid>

                    <Grid item container xs={12} sm={6} height={400} direction="row"> 
                        <Grid item container height={350} xs={12}>
                            { lineData && 
                                <ExampleLine data={lineData[value]} />
                            }
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

                <Grid item xs={12}> 
                    {/* spacer */}
                </Grid>

                <Grid item xs={12}>
                    <Divider sx={{m: 5}} variant="middle">Top 10 Coins by Market Capital</Divider>

                    <Box display="flex" justifyContent="center">
                        <Carousel coins={coins}/>
                    </Box>
                </Grid>
            </Grid>
        </Container>
    </>
  )
}

export default Main