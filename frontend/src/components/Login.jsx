import * as React from 'react';
import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify'

import { loginUser } from '../features/user/userSlice';

import {Box, Typography, Modal, Avatar, Button, CssBaseline, TextField, Grid, Container} from '@mui/material';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';

export default function BasicModal() {

  const dispatch = useDispatch()

  const { isFulfilled } = useSelector((state) => state.auth)

  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const handleSubmit = (event) => {
    event.preventDefault();

    const formData = new FormData(event.currentTarget);
    const body = {
      email: formData.get('email'),
      password: formData.get('password'),
    }
    console.log(body)
    dispatch(loginUser(body))
  };

  return (
    <div>

        <Button variant='contained' sx={{m: 1, width: 100}} onClick={handleOpen}>
        {/* <Button variant='contained' sx={{m: 1, width: 100}}> */}
          <Typography>
              Login
          </Typography>
        </Button>

      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
      <Container component="main" maxWidth="xs">
        <CssBaseline />
        <Box
          sx={{
            marginTop: 8,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            bgcolor: 'background.paper',
            p: 4,
            border: '2px solid #000',
            boxShadow: 24,
            borderRadius: 4
          }}
        >
          <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
            <LockOutlinedIcon />
          </Avatar>
          <Typography component="h1" variant="h5">
            Login
          </Typography>
          <Box component="form" noValidate onSubmit={handleSubmit} sx={{ mt: 3 }}>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  id="email"
                  label="Email Address"
                  name="email"
                  autoComplete="email"
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  name="password"
                  label="Password"
                  type="password"
                  id="password"
                  autoComplete="new-password"
                />
              </Grid>
            </Grid>
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
            >
              Login
            </Button>
          </Box>
        </Box>
      </Container>
      </Modal>
    </div>
  );
}