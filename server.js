const http = require('http')
const io = require('socket.io')

const apiServer = require('./api')
const sockets = require('./sockets')
const PORT = 3000

const httpServer = http.createServer(apiServer)
const socketServer = io(httpServer, {
    cors: {
        origin: '*',
        method: ['GET', 'POST']
    }
})

httpServer.listen(PORT)
console.log(`listening on ${PORT}...`)
sockets.listen(socketServer)
