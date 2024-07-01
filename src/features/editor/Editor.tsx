import "./Editor.css"
import {
  toggleBold,
  toggleItalic,
  updateText,
  setNextStep,
  setPreviousStep,
  selectCurrentEditor,
  selectIsFirstStep,
  selectIsLastStep,
} from "./editorSlice"
import { useAppDispatch, useAppSelector } from "../../app/hooks"
import { clsx } from "../../utils"
import { useEffect, useRef, useState } from "react"

const debounce = (f: any, delay: number) => {
  let timer: number | null = null
  return (...args: any[]) => {
    if (timer !== null) {
      clearTimeout(timer)
    }
    timer = setTimeout(() => {
      f(...args)
      timer = null
    }, delay)
  }
}

export const Editor = () => {
  const dispatch = useAppDispatch()
  const isFirstStep = useAppSelector(selectIsFirstStep)
  const isLastStep = useAppSelector(selectIsLastStep)
  const currentEditor = useAppSelector(selectCurrentEditor)
  const [text, setText] = useState(currentEditor.text)

  const textUpdateRef = useRef(
    debounce((text: string) => dispatch(updateText(text)), 500),
  )

  const changeHandler = e => {
    setText(e.target.value)
    textUpdateRef.current(e.target.value)
  }

  useEffect(() => {
    setText(currentEditor.text)
  }, [currentEditor.text])

  return (
    <div className="editor">
      <textarea
        value={text}
        onChange={changeHandler}
        style={{
          fontStyle: currentEditor.italic ? "italic" : "normal",
          fontWeight: currentEditor.bold ? 700 : 400,
        }}
      ></textarea>
      <button
        disabled={isFirstStep}
        onClick={() => dispatch(setPreviousStep())}
      >
        ◀
      </button>
      <button disabled={isLastStep} onClick={() => dispatch(setNextStep())}>
        ▶
      </button>
      <button
        onClick={() => dispatch(toggleBold())}
        className={clsx("bold", currentEditor.bold && "enabled")}
      >
        B
      </button>
      <button
        onClick={() => dispatch(toggleItalic())}
        className={clsx("italic", currentEditor.italic && "enabled")}
      >
        I
      </button>
    </div>
  )
}
