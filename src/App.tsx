import { Editor } from "./features/editor/Editor"
import "./App.css"

const App = () => {
  return (
    <div className="App">
      <header>
        <h1>Text Editor</h1>
      </header>
      <main>
        <Editor />
      </main>
    </div>
  )
}

export default App
