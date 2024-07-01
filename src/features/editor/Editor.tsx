import "./Editor.css"
import {
  toggleBold,
  toggleItalic,
  setNextStep,
  setPreviousStep,
  selectCurrentEditor,
  selectIsFirstStep,
  selectIsLastStep,
  inputText,
} from "./editorSlice"
import { useAppDispatch, useAppSelector } from "../../app/hooks"
import { clsx } from "../../utils"
import { useEffect, useState } from "react"

export const Editor = () => {
  const dispatch = useAppDispatch()
  const isFirstStep = useAppSelector(selectIsFirstStep)
  const isLastStep = useAppSelector(selectIsLastStep)
  const currentEditor = useAppSelector(selectCurrentEditor)
  const [text, setText] = useState(currentEditor.text)

  useEffect(() => {
    setText(currentEditor.text)
  }, [currentEditor.text])

  return (
    <div className="editor">
      <textarea
        value={text}
        style={{
          fontStyle: currentEditor.italic ? "italic" : "normal",
          fontWeight: currentEditor.bold ? 700 : 400,
        }}
        onChange={e => {
          setText(e.target.value)
          dispatch(inputText(e.target.value))
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
