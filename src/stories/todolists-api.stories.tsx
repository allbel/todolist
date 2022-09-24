import React, {useEffect, useState} from 'react'
import {todolistAPI} from "../api/todolist-api"

export default {
    title: 'API'
}

export const GetTodolists = () => {
    const [state, setState] = useState<any>(null)
    useEffect(() => {
        todolistAPI.getTodolists()
            .then((response) => {
                setState(response.data)
            })
    }, [])

    return <div> {JSON.stringify(state)}</div>
}

export const CreateTodolist = () => {
    const [state, setState] = useState<any>(null)
    useEffect(() => {
        const title = 'React Native'
        todolistAPI.createTodolist(title)
            .then((response) => {
                setState(response.data)
            })
    }, [])

    return <div> {JSON.stringify(state)}</div>
}

export const DeleteTodolist = () => {
    const [state, setState] = useState<any>(null)
    useEffect(() => {
        const todolistId = '46e2e3f5-604d-45a3-a368-cdea51798f53'
        todolistAPI.deleteTodolist(todolistId)
            .then((response) => {
                setState(response.data)
            })
    }, [])

    return <div> {JSON.stringify(state)}</div>
}

export const UpdateTodolist = () => {
    const [state, setState] = useState<any>(null)
    useEffect(() => {
        const todolistId = '367e953c-caf1-4f0c-b544-66495b1f85c8'
        const title = 'AXIOS >>>>>>>>'
        todolistAPI.updateTodolist(todolistId, title)
            .then((response) => {
                setState(response.data)
            })
    }, [])

    return <div> {JSON.stringify(state)}</div>
}

export const GetTasks = () => {
    const [state, setState] = useState<any>(null)
    useEffect(() => {
        const todolistId = '46e2e3f5-604d-45a3-a368-cdea51798f53'
        todolistAPI.getTasks(todolistId)
            .then((response) => {
                setState(response.data)
            })
    }, [])

    return <div> {JSON.stringify(state)}</div>
}

export const CreateTask = () => {
    const [state, setState] = useState<any>(null)
    useEffect(() => {
        const todolistId = '46e2e3f5-604d-45a3-a368-cdea51798f53'
        const title = 'Task React'
        todolistAPI.createTask(todolistId, title)
            .then((response) => {
                setState(response.data)
            })
    }, [])

    return <div> {JSON.stringify(state)}</div>
}

export const DeleteTask = () => {
    const [state, setState] = useState<any>(null)
    useEffect(() => {
        const todolistId = '46e2e3f5-604d-45a3-a368-cdea51798f53'
        const taskId = '75596cf8-135f-42bb-bf19-53d939acbe20'
        todolistAPI.deleteTask(todolistId, taskId)
            .then((response) => {
                setState(response.data)
            })
    }, [])

    return <div> {JSON.stringify(state)}</div>
}

export const UpdateTask = () => {
    const [state, setState] = useState<any>(null)
    useEffect(() => {
        const todolistId = '46e2e3f5-604d-45a3-a368-cdea51798f53'
        const taskId = '3f54bca3-5b1f-448b-9bc7-2d1d18f35da4'
        const task = {
            title: 'Super task',
            description: null,
            status: 0,
            priority: 0,
            startDate: null,
            deadline: null,
            order: 0,
        }
        todolistAPI.updateTask(todolistId, taskId, task)
            .then((response) => {
                setState(response.data)
            })
    }, [])

    return <div> {JSON.stringify(state)}</div>
}