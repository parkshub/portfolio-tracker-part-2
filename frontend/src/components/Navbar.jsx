import * as React from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

import { logoutUser } from '../features/user/userSlice';

import { AppBar, Box, Toolbar, IconButton, Typography, Menu, Container, Tooltip, MenuItem } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import MultilineChartIcon from '@mui/icons-material/MultilineChart';

import Login from './Login'

function ResponsiveAppBar() {

  const dispatch = useDispatch()
  const navigate = useNavigate()
  
  const { user } = useSelector((state) => state.auth)

  const [anchorElUser, setAnchorElUser] = React.useState(null);
  
  
  ////////////////////////////////

  // const [open, setOpen] = useState(false);
  // const handleOpen = () => setOpen(true);
  // const handleClose = () => setOpen(false);

  ///////////////////////////////

  const settings = user ? ['Main', 'Profile', 'Browse'] : ['Main', 'Browse']

  const handleOpenUserMenu = (event) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  const onClickLogout = () => {
    setAnchorElUser(null);
    dispatch(logoutUser())
    navigate('/main')
  }

  return (
    <AppBar position="static">
      <Container maxWidth="xl">
        <Toolbar disableGutters>
          <MultilineChartIcon sx={{ display: { xs: 'none', md: 'flex' }, mr: 1 }} />
          <Typography
            variant="h6"
            noWrap
            component="a"
            href="/main"
            sx={{
              mr: 2,
              display: { xs: 'none', md: 'flex' },
              fontFamily: 'monospace',
              fontWeight: 700,
              letterSpacing: '.3rem',
              color: 'inherit',
              textDecoration: 'none',
            }}
          >
            Portfolio Tracker
          </Typography>


          <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' } }}> 
            {/* this is for spacing */}
          </Box>

          <Box display="flex" alignItems="center">

            <Box sx={{ flexGrow: 0 }}>
              <Tooltip title="Open settings">
                <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                  <MenuIcon sx={{color:"white"}}/>
                </IconButton>
              </Tooltip>
              <Menu
                sx={{ mt: '45px' }}
                id="menu-appbar"
                anchorEl={anchorElUser}
                anchorOrigin={{
                  vertical: 'top',
                  horizontal: 'right',
                }}
                keepMounted
                transformOrigin={{
                  vertical: 'top',
                  horizontal: 'right',
                }}
                open={Boolean(anchorElUser)}
                onClose={handleCloseUserMenu}
              >
                {settings.map((setting) => (
                  <MenuItem key={setting} component={Link} to={`/${setting.toLowerCase()}`} onClick={handleCloseUserMenu}>
                      {setting}
                  </MenuItem>
                ))}
                    {/* <MenuItem onClick={handleOpen}>
                      <Login navbar={true} open={open} handleClose={handleClose}/>
                    </MenuItem> */}
                { user &&
                  <>
                    <MenuItem onClick={onClickLogout}>
                      <Typography textAlign="center">Logout</Typography>
                    </MenuItem>
                  </>
                  
                }
              </Menu>
            </Box>
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
}
export default ResponsiveAppBar;
