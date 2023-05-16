import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { getAllCoins, resetCoin } from '../features/coin/coinSlice';

import BrowseCoinCell from '../components/BrowseCoinCell';

import { Grid, Paper, Container, Box, Table, TableBody, TableCell, TableContainer, TableHead, TablePagination, TableRow, TextField} from '@mui/material'

export default function Browse() {

    const dispatch = useDispatch()

    const { coins, isPending } = useSelector((state) => state.coin) 

    const [filteredCoinState, setFilteredCoinState] = useState(coins) 
    const [page, setPage] = useState(0)
    const [rowsPerPage, setRowsPerPage] = useState(5)

    const handleSearchChange = (event) => {
        const filteredCoins = coins.filter(x => x.id.includes(event.target.value) || x.symbol.includes(event.target.value))
        setFilteredCoinState(filteredCoins)
    }

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    }

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    }

    useEffect(() => {
        dispatch(getAllCoins())
        return () => {
            dispatch(resetCoin())
        }
    }, [dispatch]) 

    useEffect(() => {
        setFilteredCoinState(coins)
    }, [coins]) 

    return (
        <Container sx={{marginTop: 3}} maxWidth="xl">
            <TextField label='Search' variant='standard' onChange={handleSearchChange}></TextField>
            <TableContainer sx={{ minWidth: 850 }}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>
                                Logo
                            </TableCell>
                            <TableCell>
                                Name: Ticker
                            </TableCell>
                            <TableCell>
                                Market Cap
                            </TableCell>
                            <TableCell>
                                Price
                            </TableCell>
                            <TableCell>
                                Price Change 24 Hours
                            </TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        { filteredCoinState.length > 0 && filteredCoinState[0].userId === undefined &&
                            filteredCoinState.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map(coin => {
                                return(
                                    <BrowseCoinCell key={coin.id} coin={coin}/>
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