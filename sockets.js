let readyPlayerCount = 0

function listen(io) {
    const pongNamespace = io.of('/pong')
    pongNamespace.on('connection', (socket) => {
        console.log('a user connected', socket.id)
        let room

        socket.on('ready', () => {
            room = 'room' + Math.floor(readyPlayerCount / 2)
            socket.join(room)
            console.log('Player ready', socket.id)
            readyPlayerCount += 1
            if (readyPlayerCount % 2 === 0) {
                // broadcast('startGame') to every client connected
                pongNamespace.in(room).emit('startGame', socket.id)
            }
        })

        // listen to the 'paddleMove' event and broadcast the 'paddleMove' event
        // to all clients except the one that originally send it.
        socket.on('paddleMove', (paddleData) => {
            socket.to(room).emit('paddleMove', paddleData)
        })

        socket.on('ballMove', (ballData) => {
            socket.to(room).emit('ballMove', ballData)
        })

        socket.on('disconnect', (reason) => {
            console.log(`Client ${socket.id} disconnected: ${reason}`)
            socket.leave(room)
        })
    })
}

module.exports = {
    listen,
}


