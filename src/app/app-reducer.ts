import {Dispatch} from "redux";
import {authAPI} from "../api/todolist-api";
import {setIsLoggedInAC} from "../features/Login/auth-reducer";
import {handleServerAppError, handleServerNetworkError} from "../utils/error-utils";
import {AxiosError} from "axios";
import {AppRootStateType} from "./store";

export type RequestStatusType = 'idle' | 'loading' | 'succeeded' | 'failed'

const initialState = {
    status: 'idle' as RequestStatusType,
    error: null as null | string,
    isInitialized: false as boolean
}

type InitialStateType = typeof initialState

export const appReducer = (state: InitialStateType = initialState, action: AppActionsType): InitialStateType => {
    switch (action.type) {
        case 'APP/SET-STATUS':
            return {...state, status: action.status}
        case 'APP/SET-ERROR':
            return {...state, error: action.error}
        case 'APP/INITIALIZED':
            return {...state, isInitialized: action.isInitialized}
        default:
            return state
    }
}

export const setAppStatusAC = (status: RequestStatusType) =>
    ({type: 'APP/SET-STATUS', status} as const)

export const setAppErrorAC = (error: null | string) =>
    ({type: 'APP/SET-ERROR', error} as const)

export const setisInitializedAC = (isInitialized: boolean) =>
    ({type: 'APP/INITIALIZED', isInitialized} as const)

export const initializeAppTC = () => (dispatch: Dispatch, getState: () => AppRootStateType) => {
    authAPI.me()
        .then(res => {
            if (res.data.resultCode === 0) {
                dispatch(setIsLoggedInAC({value: true}));
                dispatch(setisInitializedAC(true));
            } else {
                const isLoggedIn = getState().auth.isLoggedIn;
                if (isLoggedIn) {
                    handleServerAppError(dispatch, res.data);
                }
            }
        }).catch((e: AxiosError) => {
            handleServerNetworkError(dispatch, e)
        }).finally(() => {
            dispatch(setisInitializedAC(true));
        })
}


export type AppActionsType = SetAppStatusAСType | SetAppErrorAСType | SetAppInitializedAСType

export type SetAppStatusAСType = ReturnType<typeof setAppStatusAC>
export type SetAppErrorAСType = ReturnType<typeof setAppErrorAC>
export type SetAppInitializedAСType = ReturnType<typeof setisInitializedAC>