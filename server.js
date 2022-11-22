const server = require('http').createServer()
const io = require('socket.io')(server, {
    cors: {
        origin: '*',
        method: ['GET', 'POST']
    }
})

const PORT = 3000

server.listen(PORT)
console.log(`listening on ${PORT}...`)

let readyPlayerCount = 0

io.on('connection', (socket) => {
    console.log('a user connected', socket.id)

    socket.on('ready', () => {
        console.log('Player ready', socket.id)
        readyPlayerCount += 1
        if (readyPlayerCount === 2) {
            // broadcast('startGame') to every client connected
            io.emit('startGame', socket.id)
        }
    })

    // listen to the 'paddleMove' event and broadcast the 'paddleMove' event
    // to all clients except the one that originally send it.
    socket.on('paddleMove', (paddleData) => {
        socket.broadcast.emit('paddleMove', paddleData)
    })

    socket.on('ballMove', (ballData) => {
        socket.broadcast.emit('ballMove', ballData)
    })
})