import { Dispatch } from 'redux'
import {setAppStatusAC} from '../../app/app-reducer'
import {authAPI, FieldErrorType, LoginParamsType, StatusCode} from "../../api/todolist-api";
import {handleServerAppError, handleServerNetworkError} from "../../utils/error-utils";
import {AxiosError} from "axios";
import {createAsyncThunk, createSlice, PayloadAction} from "@reduxjs/toolkit";

export const loginTC = createAsyncThunk<
    {isLoggedIn: boolean}, LoginParamsType, {rejectValue: {errors: string[], fieldsErrors?: FieldErrorType[]}}
    >('auth/loginTC', async (param, thunkAPI) => {
    thunkAPI.dispatch(setAppStatusAC({status: 'loading'}))
    const res = await authAPI.login(param)
    try {
        if (res.data.resultCode === StatusCode.Ok) {
            thunkAPI.dispatch(setAppStatusAC({status: 'succeeded'}))
            // thunkAPI.dispatch(setIsLoggedInAC({value: true}))
            return {isLoggedIn: true}
        } else {
            handleServerAppError(thunkAPI.dispatch, res.data)
            return thunkAPI.rejectWithValue({errors: res.data.messages, fieldsErrors: res.data.fieldsErrors})
        }
    } catch(error: any) {
        handleServerNetworkError(thunkAPI.dispatch, error)
        return thunkAPI.rejectWithValue({errors: [error.message], fieldsErrors: undefined})
    }
})

const slice = createSlice({
    name: 'auth',
    initialState: {
        isLoggedIn: false
    },
    reducers: {
        setIsLoggedInAC(state, action: PayloadAction<{value: boolean}>) {
            state.isLoggedIn = action.payload.value // immerjs
            // return {...state, isLoggedIn: action.value}
        }
    },
    extraReducers: (builder) => {
        builder.addCase(loginTC.fulfilled, (state, action) => {
            state.isLoggedIn = action.payload.isLoggedIn
        })
    }
})

export const authReducer = slice.reducer
export const {setIsLoggedInAC} = slice.actions

// thunks

export const logoutTC = () => (dispatch: Dispatch) => {
    dispatch(setAppStatusAC({status: 'loading'}))
    authAPI.logout()
        .then((res) => {
            if (res.data.resultCode === StatusCode.Ok) {
                dispatch(setIsLoggedInAC({value: false}))
                dispatch(setAppStatusAC({status: 'succeeded'}))
            } else {
                handleServerAppError(dispatch, res.data)
            }
        }).catch((e: AxiosError) => {
        handleServerNetworkError(dispatch, e)
    })
}
