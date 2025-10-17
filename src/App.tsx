import { RouterProvider } from 'react-router'
import './App.css'
import { routes } from './routes'
import { SocketConnection } from './socket/socket'
import type { Socket } from 'socket.io-client'
import { NetworkProvider } from './contexts/network-context'

function App() {
  const socket : Socket = SocketConnection.getInstance();
  socket.on('connect', () => {
    console.log('Connected to server with id:', socket.id);
  });
  return (
    <NetworkProvider>
      <RouterProvider router={routes} />
    </NetworkProvider>
  )
}

export default App
