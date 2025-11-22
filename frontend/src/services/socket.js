import { io } from 'socket.io-client'

const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || 'http://localhost:5000'

// create socket with robust reconnect behavior
const socket = io(SOCKET_URL, {
  transports: ['websocket'], // prefer real WebSocket transport
  reconnection: true, // auto reconnect
  reconnectionAttempts: Infinity, // keep trying
  reconnectionDelay: 1000, // first retry delay
  reconnectionDelayMax: 5000,
  timeout: 20000, // connection timeout
  autoConnect: true, // connect immediately
})

socket.on('connect_error', (err) => {
  console.error('Socket connection error:', err.message)
})

socket.on('reconnect_attempt', (attempt) => {
  console.log(`Socket reconnect attempt #${attempt}`)
})

export default socket
