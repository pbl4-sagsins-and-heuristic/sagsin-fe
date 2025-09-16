import { RouterProvider } from 'react-router'
import './App.css'
import { routes } from './routes'

function App() {
  return (
    <>
      <RouterProvider router={routes} />
    </>
  )
}

export default App
