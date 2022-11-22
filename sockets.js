let readyPlayerCount = 0


function listen(io) {
    const pongNamespace = io.of('/pong')
    pongNamespace.on('connection', (socket) => {
        console.log('a user connected', socket.id)

        socket.on('ready', () => {
            console.log('Player ready', socket.id)
            readyPlayerCount += 1
            if (readyPlayerCount % 2 === 0) {
                // broadcast('startGame') to every client connected
                pongNamespace.emit('startGame', socket.id)
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

        socket.on('disconnect', (reason) => {
            console.log(`Client ${socket.id} disconnected: ${reason}`)
        })
    })
}

module.exports = {
    listen,
}


