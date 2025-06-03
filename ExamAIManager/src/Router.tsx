import { createBrowserRouter } from "react-router-dom";
import AppLayout from "./components/AppLayout";
import GetStarted from "./components/GetStarted";
import Stepper_upload from "./components/Stepper/Steps";
import HomePage from "./components/HomePage";
import StudentTable from "./components/Dashboard/StudentTable";
import StatisticsDashboard from "./components/statistics";


export const myRouter = createBrowserRouter([
    {
        path: '/',
        element: <AppLayout />,
        errorElement: <>main error </>,
        children: [
            {
                index: true,
                element: <HomePage />
            },
            {
                path: 'dashboard',
                element: <StudentTable></StudentTable>,
            },
            {
                path: 'statistics',
                element: <StatisticsDashboard />
            },
            {
                path: 'GetStarted',
                element: <GetStarted />
            },
            {
                path: 'tests',
                element: <Stepper_upload />
            }
        ]
    }
])