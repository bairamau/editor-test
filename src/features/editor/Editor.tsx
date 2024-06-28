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

export const Editor = () => {
  const dispatch = useAppDispatch()
  const isFirstStep = useAppSelector(selectIsFirstStep)
  const isLastStep = useAppSelector(selectIsLastStep)
  const currentEditor = useAppSelector(selectCurrentEditor)

  return (
    <div className="editor">
      <textarea
        value={currentEditor.text}
        style={{
          fontStyle: currentEditor.italic ? "italic" : "normal",
          fontWeight: currentEditor.bold ? 700 : 400,
        }}
        onChange={e => {
          dispatch(updateText(e.target.value))
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
