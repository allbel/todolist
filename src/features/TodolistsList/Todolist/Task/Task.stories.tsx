import React from 'react';
import {ComponentStory, ComponentMeta} from '@storybook/react';
import {action} from "@storybook/addon-actions";
import Task from "./Task";
import {TaskPriorities, TaskStatuses} from "../../../../api/todolist-api";

export default {
    title: 'Todolist/Task',
    component: Task,
    args: {
        removeTask: action('removeTask'),
        changeTaskStatus: action('changeTaskStatus'),
        changeTaskTitle: action('changeTaskTitle'),
    }
} as ComponentMeta<typeof Task>;

const Template: ComponentStory<typeof Task> = (args) => <Task {...args} />;

export const TaskIsDoneStory = Template.bind({});
TaskIsDoneStory.args = {
    task: {id: 'fds', title: 'JS', status: TaskStatuses.Completed, description: '', todoListId: 'todolistID1',
        startDate: '', deadline: '', order: 0, priority: TaskPriorities.Low, addedDate: ''},
};

export const TaskIsNotDoneStory = Template.bind({});
TaskIsNotDoneStory.args = {
    task: {id: 'fdsfd', title: 'HTML', status: TaskStatuses.New, description: '', todoListId: 'todolistID1',
        startDate: '', deadline: '', order: 0, priority: TaskPriorities.Low, addedDate: ''},
};