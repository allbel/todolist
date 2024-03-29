import React, {useEffect} from 'react';
import './App.css';
import ButtonAppBar from "../components/ButtonAppBar";
import {TodolistsList} from "../features/TodolistsList/TodolistsList";
import Container from "@mui/material/Container";
import {Login} from "../features/Login/Login";
import {Navigate, Route, Routes} from "react-router-dom";
import {initializeAppTC} from "./app-reducer";
import {AppRootStateType, useAppDispatch} from "./store";
import {useSelector} from "react-redux";
import CircularProgress from "@mui/material/CircularProgress";

function App() {
    const isInitialized = useSelector<AppRootStateType, boolean>(state => state.app.isInitialized)
    const dispatch = useAppDispatch()

    useEffect(() => {
        dispatch(initializeAppTC())
    }, [])

    if (!isInitialized) {
        return <div
            style={{position: 'fixed', top: '30%', textAlign: 'center', width: '100%'}}>
            <CircularProgress/>
        </div>
    }

    return (
        <div className="App">
            <ButtonAppBar/>
            <Container fixed>
                <Routes>
                    <Route path={'/'} element={<TodolistsList/>}/>
                    <Route path={'/login'} element={<Login/>}/>
                    <Route path={'/404'} element={<h1 style={{textAlign: 'center'}}>404: Page not found</h1>}/>
                    <Route path={'*'} element={<Navigate to={'/404'}/>}/>
                </Routes>
            </Container>
        </div>
    );
}

export default App;
