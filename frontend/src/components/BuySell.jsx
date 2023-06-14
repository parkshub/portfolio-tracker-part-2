import * as React from 'react';
import { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { toast } from 'react-toastify'

import { txCoin } from '../features/coin/coinSlice';

import { Box, Typography, Modal, Avatar, Button, CssBaseline, TextField, Grid, Container, Checkbox, FormControlLabel } from '@mui/material';
import ReceiptIcon from '@mui/icons-material/Receipt';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';

import dayjs from 'dayjs';

import { authenticate } from '../features/user/userSlice';
import { resetUser } from '../features/user/userSlice';
import { useNavigate } from 'react-router-dom';


// import { toast } from 'react-toastify';


export default function BuySell({transaction, yearlyData, coinInfo}) {

  const dispatch = useDispatch()
  const navigate = useNavigate()
  
  const min = dayjs().set('date', 3).set('month', 0).set('year', 2009)
  const max = dayjs()

  const type = transaction === "buy" ? "Buy" : "Sell"

  const [open, setOpen] = useState(false);
  const [total, setTotal] = useState(0)
  const [formData, setFormData] = useState({
    price: "",
    amount: "",
  })
  const [date, setDate] =useState('')
  const [manualInput, setManualInput] = useState(false)

  // const handleOpen = () => setOpen(true);
  const handleOpen = () => {
    
    setOpen(true)
    // if (dispatch(authenticate()) === true) {
    // } else {
    //   localStorage.removeItem('user')
    //   dispatch(resetUser())
    //   navigate('/main')
    //   toast.warn('token expired, login again to use buy and sell button', {
    //       toastId: "your-id"
    //   });
    // }
  };
  const handleClose = () => {
    setOpen(false)
    setFormData({
      price: "",
      amount: ""
    })
  }

  const handleChangeDate = (e) => {

      const userDate = String(e.$d)
      const splitDate = userDate.split(" ").slice(0, 5)
      splitDate.push("UTC")
      
      const dateString = splitDate.join(' ')

      let UTCDate = new Date(dateString).getTime()
      setDate(UTCDate)

      let minDate = new Date()
      minDate.setFullYear(minDate.getFullYear() - 1)
      minDate.setDate(minDate.getDate() - 2);
      
      const minDateString = new Date(minDate).toDateString().split(' ').slice(1,4).join(' ')
      
      if (UTCDate < minDate) {
        toast.warn(`Manual input needed dates ${minDateString} and before.`)
      }
      
      if (!manualInput) {
        
        let tempPrice = yearlyData.filter(x => x.includes(UTCDate))
        let price = tempPrice.length > 0 ? yearlyData.filter(x => x.includes(UTCDate))[0][1] : coinInfo.market_data.current_price.usd

        setFormData((prev) => ({
          ...prev,
          price: price.toFixed(2),
        }))      
      }
  }

  const handleChangeCheck = (e) => {

    setManualInput(e.target.checked)

    if (!e.target.checked) {
      setFormData((prev) => ({
        ...prev,
        price: "",
      }))
    }
  }

  const handleChangeFormData = (e) => {

    setFormData((prev) => ({
      ...prev,
      [e.target.id]: Number(e.target.value)
    }))
  }

  const submitTest = (e) => {
    e.preventDefault()
    const data = { coinId: coinInfo.id, coinSymbol: coinInfo.symbol, coinImage: coinInfo.image.small, price: formData.price, amount: formData.amount, date, type: transaction , total}
    dispatch(txCoin(data))
    handleClose()
  }

  useEffect(() => {
    setTotal(Number((formData.amount * formData.price).toFixed(2)))
  }, [formData])

  return (
    <div>
      <Button onClick={handleOpen}>
        {type}
      </Button>
      <Modal open={open} onClose={handleClose} aria-labelledby="modal-modal-title" aria-describedby="modal-modal-description" >
        <Container component="main" maxWidth="xs">
          <CssBaseline />
          <Box sx={{ marginTop: 8, display: 'flex', flexDirection: 'column', alignItems: 'center', bgcolor: 'background.paper', p: 4, border: '2px solid #000', boxShadow: 24, borderRadius: 4 }}>
            <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
              <ReceiptIcon />
            </Avatar>
            <Typography component="h1" variant="h5">
              {type}
            </Typography>

            <Box component="form" noValidate onChange={handleChangeFormData} sx={{ mt: 3 }} onSubmit={submitTest}> 
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <DatePicker onChange={handleChangeDate} sx={{width: "100%"}} disableFuture maxDate={max} minDate={min}/>
                  </LocalizationProvider>
                </Grid>

                <Grid item xs={12}>
                  <TextField required fullWidth type="number" name="amount" label="amount" id="amount" autoComplete="amount" defaultValue={formData.amount} />
                </Grid>

                { manualInput ? 
                  <Grid item xs={12}>
                    <TextField required fullWidth type="number" name="price" label="price" id="price" defaultValue={formData.price} />
                  </Grid>
                  :
                  <Grid item xs={12}>
                    <TextField variant='filled' disabled fullWidth type="number" InputProps={{ readOnly: true, }} name="price" label="price at (00:00 UTC)" id="price" value={formData.price}/>
                  </Grid>
                }

                <Grid item xs={12}>
                  <TextField variant='filled' disabled fullWidth InputProps={{ readOnly: true, }} name="total" type="total" id="total" value={`Total: $${total}`} />
                </Grid>

                <Grid item xs={12}>
                  <FormControlLabel control={<Checkbox checked={manualInput} defaultChecked onChange={handleChangeCheck}/>} label="Manually Input Price"/>
                </Grid>
              </Grid>
              <Button type="submit" fullWidth variant="contained" sx={{ mt: 3, mb: 2 }} >
                {type}
              </Button>
            </Box>
          </Box>
        </Container>
      </Modal>
    </div>
  )
}