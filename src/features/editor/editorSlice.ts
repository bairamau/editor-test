import {
  type PayloadAction,
  createListenerMiddleware,
  isAnyOf,
  createSlice,
} from "@reduxjs/toolkit"

export interface EditorSliceState {
  history: Array<{ text: string; bold: boolean; italic: boolean }>
  step: number
  typing: boolean
}

const initialState: EditorSliceState = {
  history: [{ text: "", bold: false, italic: false }],
  step: 0,
  typing: false,
}

export const editorSlice = createSlice({
  name: "editor",
  initialState,
  reducers: create => ({
    toggleBold: create.reducer(state => {
      const currentItem = state.history[state.step]
      state.history.splice(state.step + 1, Infinity, {
        text: currentItem.text,
        bold: !currentItem.bold,
        italic: currentItem.italic,
      })
      state.step = state.history.length - 1
    }),
    toggleItalic: create.reducer(state => {
      const currentItem = state.history[state.step]
      state.history.splice(state.step + 1, Infinity, {
        text: currentItem.text,
        bold: currentItem.bold,
        italic: !currentItem.italic,
      })
      state.step = state.history.length - 1
    }),
    inputText: create.reducer((state, action: PayloadAction<string>) => {
      state.typing = true
    }),
    updateText: create.reducer((state, action: PayloadAction<string>) => {
      const currentItem = state.history[state.step]
      state.history.splice(state.step + 1, Infinity, {
        text: action.payload,
        bold: currentItem.bold,
        italic: currentItem.italic,
      })
      state.step = state.history.length - 1
      state.typing = false
      console.log("state update")
    }),
    setPreviousStep: create.reducer(state => {
      if (state.step > 0) state.step -= 1
    }),
    setNextStep: create.reducer(state => {
      if (state.step < state.history.length - 1) state.step += 1
    }),
  }),
  selectors: {
    selectCurrentEditor: editor => editor.history[editor.step],
    selectIsLastStep: editor => editor.step === editor.history.length - 1,
    selectIsFirstStep: editor => editor.step === 0,
  },
})

export const {
  toggleBold,
  toggleItalic,
  updateText,
  setNextStep,
  setPreviousStep,
  inputText,
} = editorSlice.actions

export const { selectCurrentEditor, selectIsFirstStep, selectIsLastStep } =
  editorSlice.selectors

export const sessionMiddleware = createListenerMiddleware()
export const debouncedUpdateTextMiddleware = createListenerMiddleware()

debouncedUpdateTextMiddleware.startListening({
  actionCreator: inputText,
  effect: async (action, listenerApi) => {
    listenerApi.cancelActiveListeners()
    await listenerApi.delay(500)
    listenerApi.dispatch(updateText(action.payload))
  },
})

sessionMiddleware.startListening({
  matcher: isAnyOf(
    toggleBold,
    toggleItalic,
    updateText,
    setNextStep,
    setPreviousStep,
  ),
  effect: async (action, listenerApi) => {
    listenerApi.cancelActiveListeners()
    await listenerApi.delay(500)
    console.log("session middleware")
    localStorage.setItem("__state", JSON.stringify(listenerApi.getState()))
  },
})
