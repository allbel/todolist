import {TasksStateType} from "../../trash/App";
import {tasksReducer} from "./tasks-reducer";
import {addTodoListAC, removeTodolistAC, TodolistDomainType, todolistsReducer} from "./todolists-reducer";
import {TaskPriorities, TaskStatuses} from "../../api/todolist-api";

test('ids should be equals', () => {
    const startTasksState: TasksStateType = {};
    const startTodolistsState: Array<TodolistDomainType> = [];

    const todo: TodolistDomainType = {
        id: 'ddsff',
        title: 'test',
        filter: "all",
        order: 0,
        addedDate: ''
    }

    const action = addTodoListAC(todo);

    const endTasksState = tasksReducer(startTasksState, action)
    const endTodolistsState = todolistsReducer(startTodolistsState, action)

    const keys = Object.keys(endTasksState);
    const idFromTasks = keys[0];
    const idFromTodolists = endTodolistsState[0].id;

    expect(idFromTasks).toBe(action.todolist.id);
    expect(idFromTodolists).toBe(action.todolist.id);
});

test('property with todolistId should be deleted', () => {
    const startState: TasksStateType = {
        "todolistId1": [
            { id: "1", title: "CSS", status: TaskStatuses.New, description: '', todoListId: 'todolistId1',
                startDate: '', deadline: '', order: 0, priority: TaskPriorities.Low, addedDate: '' },
            { id: "2", title: "JS", status: TaskStatuses.Completed, description: '', todoListId: 'todolistId1',
                startDate: '', deadline: '', order: 0, priority: TaskPriorities.Low, addedDate: '' },
            { id: "3", title: "React", status: TaskStatuses.New, description: '', todoListId: 'todolistId1',
                startDate: '', deadline: '', order: 0, priority: TaskPriorities.Low, addedDate: '' }
        ],
        "todolistId2": [
            { id: "1", title: "bread", status: TaskStatuses.New, description: '', todoListId: 'todolistId2',
                startDate: '', deadline: '', order: 0, priority: TaskPriorities.Low, addedDate: ''  },
            { id: "2", title: "milk", status: TaskStatuses.Completed, description: '', todoListId: 'todolistId2',
                startDate: '', deadline: '', order: 0, priority: TaskPriorities.Low, addedDate: '' },
            { id: "3", title: "tea", status: TaskStatuses.New, description: '', todoListId: 'todolistId2',
                startDate: '', deadline: '', order: 0, priority: TaskPriorities.Low, addedDate: ''  }
        ]
    };

    const action = removeTodolistAC("todolistId2");

    const endState = tasksReducer(startState, action)


    const keys = Object.keys(endState);

    expect(keys.length).toBe(1);
    expect(endState["todolistId2"]).not.toBeDefined();
});
