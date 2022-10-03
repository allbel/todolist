import React, {ChangeEvent, memo, useState} from "react";

type EditableSpanPropsType = {
    title: string
    callBack: (title: string) => void
    disabled: boolean
}

export const EditableSpan = memo((props: EditableSpanPropsType) => {

    let [editMode, setEditMode] = useState(false)
    let [title, setTitle] = useState(props.title)

    const activateEditMode = () => setEditMode(true)

    const activateViewMode = () => {
        setEditMode(false)
        props.callBack(title)
    }

    const onChangeTitleHandler = (e: ChangeEvent<HTMLInputElement>) => {
        setTitle(e.currentTarget.value)
    }

    return editMode && !props.disabled
        ? <input onChange={onChangeTitleHandler} value={title} onBlur={activateViewMode} autoFocus/>
        : <span onDoubleClick={activateEditMode}>{props.title}</span>
})