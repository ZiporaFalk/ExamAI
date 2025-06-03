
import './App.css'
import { RouterProvider, useLocation } from 'react-router-dom'
import { myRouter } from './Router'
import { StepperDataProvider } from './components/Stepper/StepperDataContext'

function App() {

  return (
    <>
      <StepperDataProvider>
        <RouterProvider router={myRouter} />
      </StepperDataProvider>
    </>
  )
}

export default App
