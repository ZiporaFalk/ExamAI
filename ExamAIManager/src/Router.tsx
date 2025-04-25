import { createBrowserRouter } from "react-router-dom";
import StudentTable from "./components/טבלת תלמידים/StudentTable";
import Login from "./components/Login";
import AppLayuot from "./components/AppLayuot";
import ExamUploader from "./components/העלאת קובץ ל-AWS/ExamUploader";
import ExampleExam from "./components/מבחן דוגמא/ExampleExam";
import CheckStudentExams from "./components/בדיקת מבחן תלמיד/CheckStudentExams";


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
            // {
            //     path: 'UploadAWS',
            //     element: <ExamUploader studentId={1} IsExampleExam={false} />
            // },
            {
                path: 'CheckStudentExams',
                element: <CheckStudentExams />
            },
            // {
            //     path: 'UploadSampleTest',
            //     element: <>!כאן מעלים מבחן לדוגמא</>
            // },
            {
                path: 'ExampleExam',
                element: <ExampleExam />
            }

        ]
    }
])