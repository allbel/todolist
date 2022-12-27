import {setAppStatusAC} from '../../app/app-reducer'
import {authAPI, FieldErrorType, LoginParamsType, StatusCode} from "../../api/todolist-api";
import {handleServerAppError, handleServerNetworkError} from "../../utils/error-utils";
import {AxiosError} from "axios";
import {createAsyncThunk, createSlice, PayloadAction} from "@reduxjs/toolkit";

export const loginTC = createAsyncThunk<
    undefined, LoginParamsType, {rejectValue: {errors: string[], fieldsErrors?: FieldErrorType[]}}
    >('auth/loginTC', async (param, thunkAPI) => {
    thunkAPI.dispatch(setAppStatusAC({status: 'loading'}))
    const res = await authAPI.login(param)
    try {
        if (res.data.resultCode === StatusCode.Ok) {
            thunkAPI.dispatch(setAppStatusAC({status: 'succeeded'}))
            // thunkAPI.dispatch(setIsLoggedInAC({value: true}))
            return;
        } else {
            handleServerAppError(thunkAPI.dispatch, res.data)
            return thunkAPI.rejectWithValue({errors: res.data.messages, fieldsErrors: res.data.fieldsErrors})
        }
    } catch(err) {
        const error = err as Error | AxiosError
        handleServerNetworkError(thunkAPI.dispatch, error)
        return thunkAPI.rejectWithValue({errors: [error.message], fieldsErrors: undefined})
    }
})

export const logoutTC = createAsyncThunk('auth/logoutTC', async (param, thunkAPI) => {
    thunkAPI.dispatch(setAppStatusAC({status: 'loading'}))
    try {
        const res = await authAPI.logout()
        if (res.data.resultCode === StatusCode.Ok) {
            thunkAPI.dispatch(setAppStatusAC({status: 'succeeded'}))
            // thunkAPI.dispatch(setIsLoggedInAC({value: false}))
            return;
        } else {
            handleServerAppError(thunkAPI.dispatch, res.data)
            return thunkAPI.rejectWithValue({})
        }
    } catch(err) {
        const error = err as Error | AxiosError
        handleServerNetworkError(thunkAPI.dispatch, error)
        return thunkAPI.rejectWithValue({})
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
        builder.addCase(loginTC.fulfilled, (state) => {
            state.isLoggedIn = true
        })
        builder.addCase(logoutTC.fulfilled, (state) => {
            state.isLoggedIn = false
        })
    }
})

export const authReducer = slice.reducer
export const {setIsLoggedInAC} = slice.actions
