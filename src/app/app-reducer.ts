import {authAPI} from "../api/todolist-api";
import {setIsLoggedInAC} from "../features/Login/auth-reducer";
import {createAsyncThunk, createSlice, PayloadAction} from "@reduxjs/toolkit";

export const initializeAppTC = createAsyncThunk('app/initializeAppTC', async (param, {dispatch, getState}) => {
    const res = await authAPI.me()
    if (res.data.resultCode === 0) {
        dispatch(setIsLoggedInAC({value: true}));
        // dispatch(setIsInitializedAC({isInitialized: true}));
    } else {
        // const isLoggedIn = getState().auth.isLoggedIn;
        // if (isLoggedIn) {
        //     handleServerAppError(dispatch, res.data);
        // }
    }
    // .catch((e: AxiosError) => {
    //     handleServerNetworkError(dispatch, e)
    // }).finally(() => {
    //     dispatch(setIsInitializedAC({isInitialized: true}));
    // })
})

export type RequestStatusType = 'idle' | 'loading' | 'succeeded' | 'failed'
export type ErrorType = null | string

const initialState = {
    status: 'idle' as RequestStatusType,
    error: null as ErrorType,
    isInitialized: false
}

export type AppInitialState = typeof initialState

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
    },
    extraReducers: builder => {
        builder.addCase(initializeAppTC.fulfilled, (state) => {
            state.isInitialized = true
        })
    }
})

export const appReducer = slice.reducer
export const {setAppStatusAC, setAppErrorAC} = slice.actions

export type SetAppStatusAСType = ReturnType<typeof setAppStatusAC>
export type SetAppErrorAСType = ReturnType<typeof setAppErrorAC>