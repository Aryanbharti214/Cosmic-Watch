// import { io } from "socket.io-client"

// let socket

// export const connectSocket = (token) => {
//   socket = io("http://localhost:3000", {
//     auth: { token }
//   })
//   return socket
// }

// export const getSocket = () => socket
import { io } from "socket.io-client"

let socket

export const connectSocket = (token) => {
  if (!socket) {
    socket = io({
      auth: { token },
      transports: ["websocket"], // prevents long polling issues
      withCredentials: true
    })
  }
  return socket
}

export const getSocket = () => socket

export const disconnectSocket = () => {
  if (socket) {
    socket.disconnect()
    socket = null
  }
}
