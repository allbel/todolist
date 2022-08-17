import {TasksStateType} from "../App";
import {v1} from "uuid";
import {AddTodoListAC, RemoveTodolistACType} from "./todolists-reducer";

export const tasksReducer = (state:TasksStateType, action: ActionType): TasksStateType => {
    switch (action.type) {
        case 'REMOVE-TASK':
            return {...state, [action.todolistId]: state[action.todolistId].filter(t => t.id !== action.taskID)}
        case 'ADD-TASK':
            return {...state, [action.todolistId]: [{id: v1(), title: action.title, isDone: false}, ...state[action.todolistId]]}
        case 'CHANGE-TASK-STATUS':
            return {...state, [action.todolistId]: state[action.todolistId].map(t => t.id === action.taskID ? {...t, isDone: action.isDone} : t)}
        case 'CHANGE-TASK-TITLE':
            return {...state, [action.todolistId]: state[action.todolistId].map(t => t.id === action.taskID ? {...t, title: action.title} : t)}
        case 'ADD-TODOLIST':
            return {...state, [action.payload.todolistId]: []}
        case 'REMOVE-TODOLIST':
            // const {[action.id]: [], ...rest} = {...state}
            // return rest
            let copyState = {...state}
            delete copyState[action.payload.id]
            return copyState
        default:
            return state
    }
}


type ActionType = RemoveTaskActionType | AddTaskActionType |
    ChangeTaskStatusActionType | ChangeTaskTitleActionType |
    AddTodoListAC | RemoveTodolistACType

type RemoveTaskActionType = ReturnType<typeof removeTaskAC>

export const removeTaskAC = (taskID: string, todolistId: string) => {
    return {type: 'REMOVE-TASK', taskID, todolistId} as const
}

type AddTaskActionType = ReturnType<typeof addTaskAC>

export const addTaskAC = (title: string, todolistId: string) => {
    return {type: 'ADD-TASK', title, todolistId} as const
}

type ChangeTaskStatusActionType = ReturnType<typeof changeTaskStatusAC>

export const changeTaskStatusAC = (taskID: string, isDone: boolean, todolistId: string) => {
    return {type: 'CHANGE-TASK-STATUS', taskID, isDone, todolistId} as const
}

type ChangeTaskTitleActionType = ReturnType<typeof changeTaskTitleStatusAC>

export const changeTaskTitleStatusAC = (taskID: string, title: string, todolistId: string) => {
    return {type: 'CHANGE-TASK-TITLE', taskID, title, todolistId} as const
}