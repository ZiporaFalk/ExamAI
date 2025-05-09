
import './App.css'
import { RouterProvider } from 'react-router-dom'
import { myRouter } from './Router'
import { StepperDataProvider } from './components/StepperDataContext'

function App() {

  return (
    <>
      {/* .....העלאת מבחן/קובץ ל AWS....... */}
      {/* <ExamUploader></ExamUploader> */}

      {/* .....התחברות...... */}
      {/* <Login></Login> */}

      {/* ....פיענוח מבחן...... */}
      {/* <FileProcessor></FileProcessor> */}

      {/* .....טבלת התלמידים...... */}
      {/* <StudentTable/> */}
      <StepperDataProvider>
        <RouterProvider router={myRouter} />
      </StepperDataProvider>

    </>
  )
}

export default App
