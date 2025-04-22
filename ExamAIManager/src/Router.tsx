import { createBrowserRouter } from "react-router-dom";
import StudentTable from "./components/טבלת תלמידים/StudentTable";
import Login from "./components/Login";
import AppLayuot from "./components/AppLayuot";
import ExamUploader from "./components/ExamUploader";
import FileProcessor from "./components/פיענוח מבחן/FileProcessor";
import ExampleExam from "./components/מבחן דוגמא/ExampleExam";


export const myRouter = createBrowserRouter([
    {
        path: '/',
        element: <AppLayuot />,
        errorElement: <>main error </>,
        children: [
            {
                path: 'students',
                element: <StudentTable />,
                // children: [{
                //     path: ':id',
                //     element: <RecipeDetails />
                // }]
            },
            {
                path: 'login',
                element: <Login />
            },
            {
                path: 'file',
                element: <ExamUploader />
            },
            {
                path: 'FileProcessor',
                element: <FileProcessor />
            },
            {
                path: 'UploadSampleTest',
                element: <>!כאן מעלים מבחן לדוגמא</>
            },
            {
                path: 'ExampleExam',
                element: <ExampleExam />
            }

        ]
    }
])