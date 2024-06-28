import type { Action, ThunkAction } from "@reduxjs/toolkit"
import { combineSlices, configureStore } from "@reduxjs/toolkit"
import { editorSlice, sessionMiddleware } from "../features/editor/editorSlice"

const rootReducer = combineSlices(editorSlice)

export type RootState = ReturnType<typeof rootReducer>

export const makeStore = (preloadedState?: Partial<RootState>) => {
  const store = configureStore({
    reducer: rootReducer,
    preloadedState,
    middleware: getDefaultMiddleware =>
      getDefaultMiddleware().prepend(sessionMiddleware.middleware),
  })
  return store
}

const session = localStorage.getItem("__state")
const initState = session ? (JSON.parse(session) as RootState) : undefined

export const store = makeStore(initState)

export type AppStore = typeof store
export type AppDispatch = AppStore["dispatch"]
export type AppThunk<ThunkReturnType = void> = ThunkAction<
  ThunkReturnType,
  RootState,
  unknown,
  Action
>
