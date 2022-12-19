import {setAppErrorAC, SetAppErrorAСType, setAppStatusAC, SetAppStatusAСType} from "../app/app-reducer";
import {Dispatch} from "redux";
import {ResponseType} from "../api/todolist-api";

export const handleServerNetworkError = (dispatch: ErrorUtilsDispatchType, error: {message: string}) => {
    dispatch(setAppErrorAC({error: error.message}))
    dispatch(setAppStatusAC({status: 'failed'}))
}

export const handleServerAppError = <T>(dispatch: ErrorUtilsDispatchType, data: ResponseType<T>) => {
    if (data.messages.length) {
        dispatch(setAppErrorAC({error: data.messages[0]}))
    } else {
        dispatch(setAppErrorAC({error: 'Some error occurred'}))
    }
    dispatch(setAppStatusAC({status: 'failed'}))
}

type ErrorUtilsDispatchType = Dispatch<SetAppStatusAСType | SetAppErrorAСType>