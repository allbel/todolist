import React, {ChangeEvent, memo, useCallback} from 'react';
import {Checkbox, IconButton} from "@mui/material";
import {EditableSpan} from "../../../../components/EditableSpan/EditableSpan";
import {Delete} from "@mui/icons-material";
import {TaskStatuses} from "../../../../api/todolist-api";
import {TaskDomainType} from "../../tasks-reducer";

type TaskPropsType = {
    task: TaskDomainType
    disabled: boolean
    removeTask: (taskID: string) => void
    changeTaskStatus: (taskID: string, status: TaskStatuses) => void
    changeTaskTitle: (taskID: string, title: string) => void
}

const Task = memo(({
                  task, disabled,
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
            <Checkbox onChange={onChangeTaskStatus} checked={task.status === TaskStatuses.Completed}
                      disabled={disabled || task.entityStatus === 'loading'}/>
            <EditableSpan title={task.title} callBack={onChangeTitleHandler} disabled={disabled || task.entityStatus === 'loading'}/>
            <IconButton aria-label="delete" onClick={removeTaskHandler} disabled={disabled || task.entityStatus === 'loading'}>
                <Delete/>
            </IconButton>
        </li>
    );
})

export default Task;