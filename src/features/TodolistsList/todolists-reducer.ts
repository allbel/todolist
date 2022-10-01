import {todolistAPI, TodolistType} from "../../api/todolist-api";
import {Dispatch} from "redux";


const initialState: Array<TodolistDomainType> = []

export const todolistsReducer = (state = initialState, action: ActionsType): Array<TodolistDomainType> => {
    switch (action.type) {
        case 'SET-TODOS':
            return action.todos.map(todo => ({...todo, filter: 'all'}))
        case 'REMOVE-TODOLIST':
            return state.filter(tl => tl.id !== action.todolistId)
        case 'ADD-TODOLIST':
            return [{...action.todolist, filter: "all"}, ...state]
        case 'CHANGE-TODOLIST-TITLE':
            return state.map(tl => tl.id === action.todolistId ? {...tl, title: action.title} : tl)
        case 'CHANGE-TODOLIST-FILTER':
            return state.map(tl => tl.id === action.todolistId ? {...tl, filter: action.filter} : tl)
        default:
            return state
    }
}


// actions

export const removeTodolistAC = (todolistId: string) =>
    ({type: 'REMOVE-TODOLIST', todolistId} as const)

export const addTodoListAC = (todolist: TodolistType) =>
    ({type: 'ADD-TODOLIST', todolist} as const)

export const changeTodolistTitleAC = (todolistId: string, title: string) =>
    ({type: 'CHANGE-TODOLIST-TITLE', todolistId, title} as const)

export const changeTodolistFilterAC = (todolistId: string, filter: FilterValuesType) =>
    ({type: 'CHANGE-TODOLIST-FILTER', todolistId, filter} as const)

export const fetchTodolistsAC = (todos: TodolistType[]) =>
    ({type: 'SET-TODOS', todos} as const)


// thunks

export const fetchTodosTC = () => (dispatch: Dispatch<ActionsType>) => {
    todolistAPI.getTodolists()
        .then((res) => {
            dispatch(fetchTodolistsAC(res.data))
        })
}

export const deleteTodoTC = (todoId: string) => (dispatch: Dispatch<ActionsType>) => {
    todolistAPI.deleteTodolist(todoId)
        .then(() => {
            dispatch(removeTodolistAC(todoId))
        })
}

export const createTodoTC = (title: string) => (dispatch: Dispatch<ActionsType>) => {
    todolistAPI.createTodolist(title)
        .then((res) => {
            dispatch(addTodoListAC(res.data.data.item))
        })
}

export const updateTodoTitleTC = (todoId: string, title: string) => (dispatch: Dispatch<ActionsType>) => {
    todolistAPI.updateTodolist(todoId, title)
        .then((res) => {
            dispatch(changeTodolistTitleAC(todoId, title))
        })
}


// types

type ActionsType = RemoveTodolistACType | AddTodoListAC
    | ChangeTodolistTitleAC | ChangeTodolistFilterAC
    | FetchTodolistsACType

export type RemoveTodolistACType = ReturnType<typeof removeTodolistAC>
export type AddTodoListAC = ReturnType<typeof addTodoListAC>
type ChangeTodolistTitleAC = ReturnType<typeof changeTodolistTitleAC>
type ChangeTodolistFilterAC = ReturnType<typeof changeTodolistFilterAC>
export type FetchTodolistsACType = ReturnType<typeof fetchTodolistsAC>

export type FilterValuesType = 'all' | 'active' | 'completed'

export type TodolistDomainType = TodolistType & {
    filter: FilterValuesType
}