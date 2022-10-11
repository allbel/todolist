import {AddTodoListAC, FetchTodolistsACType, FilterValuesType, RemoveTodolistACType} from "./todolists-reducer";
import {TaskStatuses, TaskType, todolistAPI, TodolistType, UpdateTaskType} from "../../api/todolist-api";
import {Dispatch} from "redux";
import {AppRootStateType} from "../../app/store";
import {RequestStatusType, SetAppErrorAСType, setAppStatusAC, SetAppStatusAСType} from "../../app/app-reducer";
import {AxiosError} from "axios";
import {handleServerAppError, handleServerNetworkError} from "../../utils/error-utils";


const initialState: TasksStateType = {}

export const tasksReducer = (state = initialState, action: ActionsType): TasksStateType => {
    switch (action.type) {
        case "SET-TASKS":
            return {...state, [action.todoId]: action.tasks.map(t => ({...t, entityStatus: "idle"}))}
        case "SET-TODOS":
            const stateCopy = {...state}
            action.todos.forEach((todo) => {
                stateCopy[todo.id] = []
            })
            return stateCopy
        case 'REMOVE-TASK':
            return {...state, [action.todolistId]: state[action.todolistId].filter(t => t.id !== action.taskID)}
        case 'ADD-TASK':
            return {...state, [action.task.todoListId]: [{...action.task, entityStatus: "idle"}, ...state[action.task.todoListId]]}
        case 'CHANGE-TASK':
            return {
                ...state,
                [action.task.todoListId]: state[action.task.todoListId].map((task) =>
                    task.id === action.task.id ? {...task, ...action.task} : task)
            }
        case 'CHANGE-TASK-TITLE':
            return {
                ...state,
                [action.todolistId]: state[action.todolistId].map(t =>
                    t.id === action.taskID ? {...t, title: action.title} : t)
            }
        case 'TODO/CHANGE-TASK-STATUS':
            return {...state, [action.todolistId]: state[action.todolistId]
                    .map(t => t.id === action.taskID ? {...t, entityStatus: action.entityStatus} : t)}
        case 'ADD-TODOLIST':
            return {...state, [action.todolist.id]: []}
        case 'REMOVE-TODOLIST':
            // const {[action.id]: [], ...rest} = {...state}
            // return rest
            let copyState = {...state}
            delete copyState[action.todolistId]
            return copyState
        default:
            return state
    }
}


// actions

export const removeTaskAC = (todolistId: string, taskID: string) =>
    ({type: 'REMOVE-TASK', todolistId, taskID} as const)

export const addTaskAC = (task: TaskType) =>
    ({type: 'ADD-TASK', task} as const)

export const changeTaskAC = (task: TaskType) =>
    ({type: 'CHANGE-TASK', task} as const)

export const changeTaskTitleStatusAC = (taskID: string, title: string, todolistId: string) =>
    ({type: 'CHANGE-TASK-TITLE', taskID, title, todolistId} as const)

export const changeTaskStatusAC = (todolistId: string, taskID: string, entityStatus: RequestStatusType) =>
    ({type: 'TODO/CHANGE-TASK-STATUS', todolistId, taskID, entityStatus} as const)

export const setTasksAC = (todoId: string, tasks: TaskType[]) =>
    ({type: 'SET-TASKS', todoId, tasks} as const)


// thunks

export const fetchTasksTC = (todoId: string) => (dispatch: Dispatch<ActionsType>) => {
    dispatch(setAppStatusAC('loading'))
    todolistAPI.getTasks(todoId)
        .then((res) => {
            dispatch(setTasksAC(todoId, res.data.items))
            dispatch(setAppStatusAC('succeeded'))
        }).catch((e: AxiosError) => {
        handleServerNetworkError(dispatch, e)
    })
}

export const removeTaskTC = (todoId: string, taskId: string) => (dispatch: Dispatch<ActionsType>) => {
    dispatch(setAppStatusAC('loading'))
    dispatch(changeTaskStatusAC(todoId, taskId, 'loading'))
    todolistAPI.deleteTask(todoId, taskId)
        .then((res) => {
            if (res.data.resultCode === 0) {
                dispatch(removeTaskAC(todoId, taskId))
                dispatch(setAppStatusAC('succeeded'))
            } else {
                handleServerAppError(dispatch, res.data)
            }
        }).catch((e: AxiosError) => {
        handleServerNetworkError(dispatch, e)
    })
}

export const addTaskTC = (todoId: string, title: string) => (dispatch: Dispatch<ActionsType>) => {
    dispatch(setAppStatusAC('loading'))
    todolistAPI.createTask(todoId, title)
        .then((res) => {
            if (res.data.resultCode === 0) {
                dispatch(addTaskAC(res.data.data.item))
                dispatch(setAppStatusAC('succeeded'))
            } else {
                handleServerAppError(dispatch, res.data)
            }
        }).catch((e: AxiosError) => {
        handleServerNetworkError(dispatch, e)
    })
}

export const updateTaskTC = (todoId: string, taskId: string, value: UpdateTaskModelType) =>
    (dispatch: Dispatch<ActionsType>, getState: () => AppRootStateType) => {
        dispatch(setAppStatusAC('loading'))
        dispatch(changeTaskStatusAC(todoId, taskId, 'loading'))
        const task = getState().tasks[todoId].find(task => task.id === taskId)

        if (task) {
            const taskUpdate: UpdateTaskType = {
                ...task,
                ...value
            }
            todolistAPI.updateTask(todoId, taskId, taskUpdate)
                .then((res) => {
                    if (res.data.resultCode === 0) {
                        dispatch(changeTaskAC(res.data.data.item))
                        dispatch(setAppStatusAC('succeeded'))
                        dispatch(changeTaskStatusAC(todoId, taskId, 'succeeded'))
                    } else {
                        handleServerAppError(dispatch, res.data)
                        dispatch(changeTaskStatusAC(todoId, taskId, 'failed'))
                    }
                }).catch((e: AxiosError) => {
                handleServerNetworkError(dispatch, e)
                dispatch(changeTaskStatusAC(todoId, taskId, 'failed'))
            })
        }
    }


// types

type ActionsType = ReturnType<typeof removeTaskAC> | ReturnType<typeof addTaskAC>
    | ReturnType<typeof changeTaskAC> | ReturnType<typeof changeTaskTitleStatusAC>
    | ReturnType<typeof setTasksAC>
    | AddTodoListAC | RemoveTodolistACType | FetchTodolistsACType
    | SetAppStatusAСType | SetAppErrorAСType
    | ReturnType<typeof changeTaskStatusAC>

type UpdateTaskModelType = {
    title?: string,
    description?: null | string
    status?: TaskStatuses
    priority?: number
    startDate?: null | string
    deadline?: null | string
}

export type TasksStateType = {
    [key: string]: Array<TaskDomainType>
}

export type TaskDomainType = TaskType & {
    entityStatus: RequestStatusType
}