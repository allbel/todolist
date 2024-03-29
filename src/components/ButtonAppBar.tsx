import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import LinearProgress from "@mui/material/LinearProgress";
import {useSelector} from "react-redux";
import {AppRootStateType, useAppDispatch} from "../app/store";
import {RequestStatusType} from "../app/app-reducer";
import ErrorSnackbars from "./ErrorSnackbar/ErrorSnackbar";
import {logoutTC} from "../features/Login/auth-reducer";

export default function ButtonAppBar() {

    const status = useSelector<AppRootStateType, RequestStatusType>(state => state.app.status)
    const isLoggedIn = useSelector<AppRootStateType, boolean>(state => state.auth.isLoggedIn)
    const dispatch = useAppDispatch()

    return (
        <Box sx={{ flexGrow: 1 }}>
            {status === 'loading' && <div className={'linearProgress'}><LinearProgress color="secondary" /></div>}
            <AppBar position="static">
                <Toolbar>
                    <IconButton
                        size="large"
                        edge="start"
                        color="inherit"
                        aria-label="menu"
                        sx={{ mr: 2 }}
                    >
                        {/*<MenuIcon />*/}
                    </IconButton>
                    <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                        Todo Lists
                    </Typography>
                    {isLoggedIn && <Button color="inherit" onClick={() => dispatch(logoutTC())}>Log out</Button>}
                </Toolbar>
            </AppBar>
            <ErrorSnackbars/>
        </Box>
    );
}
