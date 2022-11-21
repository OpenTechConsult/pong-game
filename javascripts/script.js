// Canvas related
const canvas = document.createElement('canvas')
const context = canvas.getContext('2d')
const socket = io('http://localhost:3000')
let paddleIndex = 0

let width = 500
let height = 700

// Paddle
let paddleHeight = 10
let paddleWidth = 50
let paddleDiff = 25
let paddleX = [225, 225]
let trajectoryX = [0, 0]
let playerMoved = false

// ball
let ballX = 250
let ballY = 350
let ballRadius = 5
let ballDirection = 1

// speed
let speedY = 2
let speedX = 0

// score for both players
let score = [0, 0]


// create Canvas Element
function createCanvas() {
    canvas.id = 'canvas'
    canvas.width = width
    canvas.height = height

    document.body.appendChild(canvas)
    renderCanvas()
}

// Wait for Opponents
function renderIntro() {
    // Canvas background
    context.fillStyle = 'black'
    context.fillRect(0, 0, width, height)

    // Intro text
    context.fillStyle = 'white'
    context.font = "32px Courier New"
    context.fillText("Waiting for opponent...", 20, (canvas.height / 2) - 30)
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

    // top paddle
    context.fillRect(paddleX[1], 10, paddleWidth, paddleHeight)

    // dashed center line
    context.beginPath()
    context.setLineDash([4])
    context.moveTo(0, 350)
    context.lineTo(500, 350)
    context.strokeStyle = 'grey'
    context.stroke()

    // ball
    context.beginPath()
    context.arc(ballX, ballY, ballRadius, 2 * Math.PI, false)
    context.fillStyle = 'white'
    context.fill()

    // score
    context.font = "32px Courier New"
    context.fillText(score[0], 20, (canvas.height / 2) + 50)
    context.fillText(score[1], 20, (canvas.height / 2) - 30)
}

//reset ball to center
function ballReset() {
    ballX = width / 2
    ballY = height / 2
    speedY = 3
}

// Adjust ball Movement
function ballMove() {
    // vertical speed
    ballY += speedY * ballDirection
    // Horizontal speed
    if (playerMoved) {
        ballX += speedX
    }
}


// Determine What Ball Bounces Off, Score points, Reset Ball
function ballBoundaries() {
    // Bounce off left wall
    if (ballX < 0 && speedX < 0) {
        speedX = -speedX
    }

    // Bounce off right wall
    if (ballX > width && speedX > 0) {
        speedX = -speedX
    }

    // Bounce off player paddle (bottom)
    if (ballY > height - paddleDiff) {
        if (ballX >= paddleX[0] && ballX <= paddleX[0] + paddleWidth) {
            // add speed on height
            if (playerMoved) {
                speedY += 1
                // Max speed
                if (speedY > 5) {
                    speedY = 5
                }
            }
            ballDirection = -ballDirection
            trajectoryX[0] = ballX - (paddleX[0] + paddleDiff)
            speedX = trajectoryX[0] * 0.3
        } else {
            // Reset Ball, add to computer score
            ballReset()
            score[1]++
        }
    }

    // Bounce off computer paddle (top)
    if (ballY < paddleDiff) {
        if (ballX > paddleX[1] && ballX <= paddleX[1] + paddleWidth) {
            // add speed on hit.
            if (playerMoved) {
                speedX += 1
                // Max speed
                if (speedY > 5) {
                    speedY = 5
                }
            }
            ballDirection = -ballDirection
            trajectoryX[1] = ballX - (paddleX[1] + paddleDiff)
            speedX = trajectoryX[1] * 0.3
        } else {
            // Reset ball, Increase computer difficulty, add to player score.
            ballReset()
            score[0]++
        }
    }
}

// Called every frame
function animate() {
    ballMove()
    renderCanvas()
    ballBoundaries()
    window.requestAnimationFrame(animate)
}

// start game, reset everything
function startGame() {
    createCanvas()
    renderIntro()
    paddleIndex = 0
    window.requestAnimationFrame(animate)
    canvas.addEventListener('mousemove', (e) => {
        playerMoved = true
        paddleX[paddleIndex] = e.offsetX
        if (paddleX[paddleIndex] < 0) {
            paddleX[paddleIndex] = 0
        }

        if (paddleX[paddleIndex] > (width - paddleWidth)) {
            paddleX[paddleIndex] = width - paddleWidth
        }

        // Hide Cursor
        canvas.style.cursor = 'none'
    })
}


// on load
startGame()