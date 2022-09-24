import React, {ChangeEvent, memo, useCallback} from 'react';
import {Checkbox, IconButton} from "@mui/material";
import {EditableSpan} from "./EditableSpan";
import {Delete} from "@mui/icons-material";
import {TaskStatuses, TaskType} from "../api/todolist-api";

type TaskPropsType = {
    task: TaskType
    removeTask: (taskID: string) => void
    changeTaskStatus: (taskID: string, status: TaskStatuses) => void
    changeTaskTitle: (taskID: string, title: string) => void
}

const Task = memo(({
                  task,
                  removeTask, changeTaskStatus, changeTaskTitle
}: TaskPropsType) => {
    const removeTaskHandler = () => removeTask(task.id)

    const onChangeTaskStatus = (e: ChangeEvent<HTMLInputElement>) =>
        changeTaskStatus(task.id, e.currentTarget.checked ? TaskStatuses.Completed : TaskStatuses.New)

    const onChangeTitleHandler = useCallback((title: string) => {
        changeTaskTitle(task.id, title)
    }, [changeTaskTitle, task.id])

    return (
        <li>
            <Checkbox onChange={onChangeTaskStatus} checked={task.status === TaskStatuses.Completed}/>
            <EditableSpan title={task.title} callBack={onChangeTitleHandler}/>
            <IconButton aria-label="delete" onClick={removeTaskHandler}>
                <Delete/>
            </IconButton>
        </li>
    );
})

export default Task;