import { createBrowserRouter } from "react-router-dom";
import StudentTable from "./components/טבלת תלמידים/StudentTable";
import Login from "./components/Login";
import AppLayuot from "./components/AppLayuot";
import ExamUploader from "./components/העלאת קובץ ל-AWS/ExamUploader";
import ExampleExam from "./components/מבחן דוגמא/ExampleExam";
import CheckStudentExams from "./components/בדיקת מבחן תלמיד/CheckStudentExams";
import Decoding from "./components/Decoding";
import GetStarted from "./components/GetStarted";
import TestType from "./components/TestType";
import Stepper_upload from "./components/Steps";


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
            //     path: 'CheckStudentExams',
            //     element: <CheckStudentExams />
            // },
            // {
            //     path: 'Decoding',
            //     element: <Decoding/>
            // },
            // {
            //     path: 'ExampleExam',
            //     element: <ExampleExam />
            // },
            // {
            //     path: 'TestType',
            //     element: <TestType />
            // },
            {
                path: 'GetStarted',
                element: <GetStarted />
            },
            {
                path: 'Stepper',
                element: <Stepper_upload />
            }
        ]
    }
])