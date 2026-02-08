import { useEffect, useState, useRef } from "react"
import { connectSocket } from "../../services/socket"
import { jwtDecode } from "jwt-decode"

export default function ChatPanel({ asteroidId = "global-room" }) {
  const [messages, setMessages] = useState([])
  const [input, setInput] = useState("")
  const messagesEndRef = useRef(null)

  const token = localStorage.getItem("token")
  const user = token ? jwtDecode(token) : null

  useEffect(() => {
    if (!token) return

    const socket = connectSocket(token)

    socket.emit("join-asteroid", asteroidId)

    socket.on("chat-history", (history) => {
      setMessages(history)
    })

    socket.on("receive-message", (msg) => {
      setMessages((prev) => [...prev, msg])
    })

    return () => socket.disconnect()
  }, [token, asteroidId])

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  const sendMessage = () => {
    if (!input.trim()) return

    const socket = connectSocket(token)

    socket.emit("send-message", {
      asteroidId,
      userId: user.id,
      message: input
    })

    setInput("")
  }

  return (
    <div className="bg-black/40 backdrop-blur-xl border border-purple-800 rounded-2xl p-4 flex flex-col h-[450px]">

      <h2 className="text-purple-400 font-semibold mb-3">
         Live Community Thread
      </h2>

      <div className="flex-1 overflow-y-auto space-y-3 pr-2">

        {messages.map((msg, index) => {
          const isMe = msg.userId?._id === user?.id

          return (
            <div
              key={index}
              className={`flex ${isMe ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`
                  max-w-xs px-4 py-2 rounded-2xl text-sm
                  ${isMe
                    ? "bg-purple-600 text-white rounded-br-none"
                    : "bg-gray-800 text-gray-200 rounded-bl-none"
                  }
                `}
              >
                {!isMe && (
                  <p className="text-xs text-purple-400 font-semibold mb-1">
                    {msg.userId?.name || "User"}
                  </p>
                )}
                {msg.message}
              </div>
            </div>
          )
        })}

        <div ref={messagesEndRef}></div>
      </div>

      <div className="flex mt-4 gap-2">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type message..."
          className="flex-1 bg-black border border-purple-700 px-4 py-2 rounded-xl text-sm"
        />

        <button
          onClick={sendMessage}
          className="bg-gradient-to-r from-purple-600 to-pink-600 hover:opacity-90 px-5 rounded-xl text-sm"
        >
          Send
        </button>
      </div>
    </div>
  )
}
