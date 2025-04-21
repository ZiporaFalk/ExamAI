
import './App.css'
import ExamUploader from './components/ExamUploader'
import Login from './components/Login'
import StudentTable from './components/טבלת תלמידים/StudentTable'
import FileProcessor from './components/פיענוח מבחן/FileProcessor'
import { RouterProvider } from 'react-router-dom'
import { myRouter } from './Router'
import NavBar from './components/NavBar'

function App() {

  return (
    <>

      <RouterProvider router={myRouter} />

      {/* .....העלאת מבחן/קובץ ל AWS....... */}
      {/* <ExamUploader></ExamUploader> */}

      {/* .....התחברות...... */}
      {/* <Login></Login> */}

      {/* ....פיענוח מבחן...... */}
      {/* <FileProcessor></FileProcessor> */}

      {/* .....טבלת התלמידים...... */}
      {/* <StudentTable/> */}



    </>
  )
}

export default App
