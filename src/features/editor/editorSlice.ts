import {
  type PayloadAction,
  createSlice,
  createListenerMiddleware,
  isAnyOf,
} from "@reduxjs/toolkit"

export interface EditorSliceState {
  history: Array<{ text: string; bold: boolean; italic: boolean }>
  step: number
}

const initialState: EditorSliceState = {
  history: [{ text: "", bold: false, italic: false }],
  step: 0,
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
    updateText: create.reducer((state, action: PayloadAction<string>) => {
      const currentItem = state.history[state.step]
      state.history.splice(state.step + 1, Infinity, {
        text: action.payload,
        bold: currentItem.bold,
        italic: currentItem.italic,
      })
      state.step = state.history.length - 1
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
} = editorSlice.actions

export const { selectCurrentEditor, selectIsFirstStep, selectIsLastStep } =
  editorSlice.selectors

export const sessionMiddleware = createListenerMiddleware()

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
    localStorage.setItem("__state", JSON.stringify(listenerApi.getState()))
  },
})
