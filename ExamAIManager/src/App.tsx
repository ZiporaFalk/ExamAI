
import './App.css'
import ExamUploader from './components/ExamUploader'
import Login from './components/Login'
import StudentTable from './components/StudentTable'
import FileProcessor from './components/FileProcessor'

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
      <StudentTable/>
    </>
  )
}

export default App
