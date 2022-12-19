import {Dispatch} from "redux";
import {authAPI} from "../api/todolist-api";
import {setIsLoggedInAC} from "../features/Login/auth-reducer";
import {handleServerAppError, handleServerNetworkError} from "../utils/error-utils";
import {AxiosError} from "axios";
import {AppRootStateType} from "./store";
import {createSlice, PayloadAction} from "@reduxjs/toolkit";

export type RequestStatusType = 'idle' | 'loading' | 'succeeded' | 'failed'
export type ErrorType = null | string

const initialState = {
    status: 'idle' as RequestStatusType,
    error: null as ErrorType,
    isInitialized: false
}

const slice = createSlice({
    name: 'app',
    initialState: initialState,
    reducers: {
        setAppStatusAC(state, action: PayloadAction<{status: RequestStatusType}>) {
            state.status = action.payload.status // immerjs
            // return {...state, status: action.status}
        },
        setAppErrorAC(state, action: PayloadAction<{error: ErrorType}>) {
            state.error = action.payload.error // immerjs
            // return {...state, error: action.error}
        },
        setIsInitializedAC(state, action: PayloadAction<{isInitialized: boolean}>) {
            state.isInitialized = action.payload.isInitialized // immerjs
            // return {...state, isInitialized: action.isInitialized}
        },
    }
})

export const appReducer = slice.reducer
export const {setAppStatusAC, setAppErrorAC, setIsInitializedAC} = slice.actions

export const initializeAppTC = () => (dispatch: Dispatch, getState: () => AppRootStateType) => {
    authAPI.me()
        .then(res => {
            if (res.data.resultCode === 0) {
                dispatch(setIsLoggedInAC({value: true}));
                dispatch(setIsInitializedAC({isInitialized: true}));
            } else {
                const isLoggedIn = getState().auth.isLoggedIn;
                if (isLoggedIn) {
                    handleServerAppError(dispatch, res.data);
                }
            }
        }).catch((e: AxiosError) => {
            handleServerNetworkError(dispatch, e)
        }).finally(() => {
            dispatch(setIsInitializedAC({isInitialized: true}));
        })
}

export type SetAppStatusAСType = ReturnType<typeof setAppStatusAC>
export type SetAppErrorAСType = ReturnType<typeof setAppErrorAC>
export type SetAppInitializedAСType = ReturnType<typeof setIsInitializedAC>