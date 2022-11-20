const canvas = document.createElement('canvas')
const context = canvas.getContext('2d')

let width = 500
let height = 700



// create Canvas Element
function createCanvas() {
    canvas.id = 'canvas'
    canvas.width = width
    canvas.height = height

    document.body.appendChild(canvas)
    renderCanvas()
}

// Render everything on canvas
function renderCanvas() {
    // canvas background
    context.fillStyle = 'black'
    context.fillRect(0, 0, width, height)

    // paddle color
    context.fillStyle = 'white'

    // bottom paddle
    context.fillRect(paddleX[0], height - 20, paddleWidth, paddleHeight)
}

// start game, reset everything
function startGame() {
    console.log('Inside startGame')
    createCanvas()
}


// on load
startGame()