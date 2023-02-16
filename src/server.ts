import express from "express"
import cors from "cors"
import { Server } from "socket.io"
import { createServer } from "http" // CORE MODULE
import { newConnectionHandler } from "./socket"
import productsRouter from "./api/products"
import usersRouter from "./api/users"
import { badRequestHandler, unauthorizedHandler, genericErrorHandler } from "./errorHandlers"

const expressServer = express()

// ************************************ SOCKET.IO ********************************
const httpServer = createServer(expressServer)
const io = new Server(httpServer) // this constructor is expecting to receive an HTTP-SERVER as parameter not an EXPRESS SERVER!!!

io.on("connection", newConnectionHandler) // "connection" is NOT a custom event! This is a socket.io event, triggered every time a new client connects!

// *********************************** MIDDLEWARES *******************************
expressServer.use(cors())
expressServer.use(express.json())

// ************************************ ENDPOINTS ********************************
expressServer.use("/products", productsRouter)
expressServer.use("/users", usersRouter)

// *********************************** ERROR HANDLERS ****************************
expressServer.use(badRequestHandler)
expressServer.use(unauthorizedHandler)
expressServer.use(genericErrorHandler)

export { httpServer, expressServer }
