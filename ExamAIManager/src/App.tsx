
import './App.css'
// import ExamUploader from './components/העלאת קובץ ל-AWS/ExamUploader'
// import Login from './components/Login'
// import StudentTable from './components/טבלת תלמידים/StudentTable'
// import FileProcessor from './components/בדיקת מבחן תלמיד/CheckStudentExams'
import { RouterProvider } from 'react-router-dom'
import { myRouter } from './Router'
// import NavBar from './components/NavBar'
// import Stepper_upload from './components/Steps'
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
