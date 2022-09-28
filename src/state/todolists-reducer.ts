import {v1} from "uuid";
import {todolistAPI, TodolistType, UpdateTaskType} from "../api/todolist-api";
import {Dispatch} from "redux";
import {addTaskAC, changeTaskAC} from "./tasks-reducer";
import {AppRootStateType} from "./store";

export type FilterValuesType = 'all' | 'active' | 'completed'

export type TodolistDomainType = TodolistType & {
    filter: FilterValuesType
}

const initialState: Array<TodolistDomainType> = []

export const todolistsReducer = (state = initialState, action: ActionType): Array<TodolistDomainType> => {
    switch (action.type) {
        case 'SET-TODOS':
            return action.todos.map(todo => ({...todo, filter: 'all'}))
        case 'REMOVE-TODOLIST':
            return state.filter(tl => tl.id !== action.payload.id)
        case 'ADD-TODOLIST':
            return [{...action.todolist, filter: "all"}, ...state]
        case 'CHANGE-TODOLIST-TITLE':
            return state.map(tl => tl.id === action.payload.id ? {...tl, title: action.payload.title} : tl)
        case 'CHANGE-TODOLIST-FILTER':
            return state.map(tl => tl.id === action.payload.id ? {...tl, filter: action.payload.filter} : tl)
        default:
            return state
    }
}

type ActionType = RemoveTodolistACType | AddTodoListAC
    | ChangeTodolistTitleAC | ChangeTodolistFilterAC
    | FetchTodolistsACType

export type RemoveTodolistACType = ReturnType<typeof removeTodolistAC>

export const removeTodolistAC = (todolistId: string) => {
    return {
        type: 'REMOVE-TODOLIST',
        payload: {
            id: todolistId
        }
    } as const
}

export type AddTodoListAC = ReturnType<typeof addTodoListAC>

export const addTodoListAC = (todolist: TodolistType) =>
    ({type: 'ADD-TODOLIST', todolist} as const)


type ChangeTodolistTitleAC = ReturnType<typeof changeTodolistTitleAC>

export const changeTodolistTitleAC = (todolistId: string, title: string) => {
    return {
        type: 'CHANGE-TODOLIST-TITLE',
        payload: {
            id: todolistId,
            title: title
        }
    } as const
}

type ChangeTodolistFilterAC = ReturnType<typeof changeTodolistFilterAC>

export const changeTodolistFilterAC = (todolistId: string, newFilter: FilterValuesType) => {
    return {
        type: 'CHANGE-TODOLIST-FILTER',
        payload: {
            id: todolistId,
            filter: newFilter
        }
    } as const
}

export type FetchTodolistsACType = ReturnType<typeof fetchTodolistsAC>
export const fetchTodolistsAC = (todos: TodolistType[]) => ({type: 'SET-TODOS', todos} as const)

export const fetchTodosTC = () => (dispatch: Dispatch) => {
    todolistAPI.getTodolists()
        .then((res) => {
            dispatch(fetchTodolistsAC(res.data))
        })
}

export const deleteTodosTC = (todoId: string) => (dispatch: Dispatch) => {
    todolistAPI.deleteTodolist(todoId)
        .then(() => {
            dispatch(removeTodolistAC(todoId))
        })

}

export const createTodoTC = (title: string) => (dispatch: Dispatch) => {
    todolistAPI.createTodolist(title)
        .then((res) => {
            dispatch(addTodoListAC(res.data.data.item))
        })
}

export const updateTodoTitleTC = (todoId: string, title: string) => (dispatch: Dispatch) => {
    todolistAPI.updateTodolist(todoId, title)
        .then((res) => {
            dispatch(changeTodolistTitleAC(todoId, title))
        })
}