const MovmentVecter = {

   Left: false,
   Right: false

}

var Death = false
var Score = 0
var Frame = 0

function randomIntFromInterval(min, max) { // min and max included 
   return Math.floor(Math.random() * (max - min + 1) + min)
}

//Make the world
const world = new GameMaker.World(GameMaker.Init())

world.backgroundColor = '#242424'

var Window = new GameMaker.ShapeSprite("PlayWindow", new GameMaker.Vector2(300, 300), new GameMaker.Vector2(500, 500), 0, "#5e5e5e")
world.addobjects(Window)

function GameOver() {

   Death = true

   snakeHead.Body.reverse().forEach((body, i) => {

      setTimeout(() => {

         snakeHead.Body = snakeHead.Body.filter(BodSeg => BodSeg.pos.X != body.pos.X && BodSeg.pos.Y != body.pos.Y)
         world.objects = world.objects.filter(BodSeg => BodSeg.pos.X != body.pos.X && BodSeg.pos.Y != body.pos.Y)

      }, 10 * i);

   })

   setTimeout(() => {

      snakeHead.pos = Window.pos

      CreateNewSnake()
      Death = false
      Score = 0

   }, (10 * snakeHead.Body.length) + 1000);

}

function CreateNewSnake() {

   snakeHead.MovementAngle = 0.01
   snakeHead.MovementSpeed = 2
   snakeHead.PrevPos = []
   snakeHead.Body = []


   for (let i = 0; i < 10; i++) {

      snakeHead.PrevPos.push({

         id: i,
         pos: new GameMaker.Vector2(10, 10),
         angle: 0

      })

   }

   for (let i = 0; i < 10; i++) {
      var snake = new GameMaker.ShapeSprite("SnakeBody", snakeHead.pos, new GameMaker.Vector2(12, 12), 0, "#4e8a5e")
      snake.id = snakeHead.Body.length
      snakeHead.Body.push(snake)
      world.addobjects(snake)
   }

   var Bodys = world.objects.filter(object => object.name == "SnakeBody")
   var Apples = world.objects.find(object => object.name == "Apple")
   var Window = world.objects.find(object => object.name == "PlayWindow")
   var Head = world.objects.filter(object => object.name == "SnakeHead")
   var FPSText = world.objects.find(object => object.name == "FPS")

   world.objects = [Window]
   Bodys.forEach(body => { world.objects.push(body) })
   Head.forEach(body => { world.objects.push(body) })
   world.objects.push(Apples)

}

function createApple() {

   var Apple = new GameMaker.ShapeSprite("Apple", new GameMaker.Vector2(10, 10), new GameMaker.Vector2(15, 15), 0, "#f54242")
   Apple.Move = function () {

      this.pos = new GameMaker.Vector2(randomIntFromInterval(Window.pos.X - (Window.size.X / 2) + 20, Window.pos.X + (Window.size.X / 2) - 20), randomIntFromInterval(Window.pos.Y - (Window.size.Y / 2) + 20, Window.pos.Y + (Window.size.Y / 2) - 20))

   }
   Apple.Move()
   world.addobjects(Apple)

}

createApple()

var snakeHead = new GameMaker.ShapeSprite("SnakeHead", Window.pos, new GameMaker.Vector2(15, 15), 0, "#66b07a")
world.addobjects(snakeHead)

CreateNewSnake()

var Text = new GameMaker.TextSprite("SnakeBody", new GameMaker.Vector2(1, 1), 0, "FPS: ")
Text.font = "Fredoka"
Text.fontColor = "white"
world.addobjects(Text)

var ScoreText = new GameMaker.TextSprite("SnakeBody", new GameMaker.Vector2(50, 550), 0, "Score: ")
ScoreText.font = "Fredoka"
ScoreText.fontColor = "white"
ScoreText.fontSize = '40'
world.addobjects(ScoreText)

new GameMaker.Plugins.Keyboard(world)

window.addEventListener("keydown", function (e) {

   if (e.keyCode == 39) {
      MovmentVecter.Right = true
   }
   if (e.keyCode == 37) {
      MovmentVecter.Left = true
   }

}, false);

window.addEventListener("keyup", function (e) {

   if (e.keyCode == 39) {
      MovmentVecter.Right = false
   }
   if (e.keyCode == 37) {
      MovmentVecter.Left = false
   }

}, false);

var FPS = 0

//Update the frame every 60th of a second
setInterval(() => {

   Frame += 1
   FPS += 1
   ScoreText.text = `Score: ${Score}`

   if (!Death) {

      if (MovmentVecter.Right) {

         snakeHead.MovementAngle += 0.1

      }
      if (MovmentVecter.Left) {

         snakeHead.MovementAngle -= 0.1

      }

      var HeadNextPos = new GameMaker.Vector2(

         snakeHead.pos.X + Math.cos(snakeHead.MovementAngle) * snakeHead.MovementSpeed,
         snakeHead.pos.Y + Math.sin(snakeHead.MovementAngle) * snakeHead.MovementSpeed

      )

      snakeHead.angle = snakeHead.pos.angle(HeadNextPos)

      snakeHead.PrevPos.unshift({

         pos: snakeHead.pos,
         angle: snakeHead.angle,
         id: Frame

      })


      snakeHead.PrevPos = snakeHead.PrevPos.filter(object => object.id > Frame - world.objects.filter(object => object.name == "SnakeBody").length)

      snakeHead.pos = HeadNextPos

      if (world.objects.find( body => body.name == "SnakeBody" && body.pos.distance(snakeHead.pos) < snakeHead.size.X && body.id > 10) != undefined) {

         GameOver()

      }

      var Apples = world.objects.filter(objects => objects.name == "Apple")

      Apples.forEach(apple => {

         if (apple.pos.distance(snakeHead.pos) < 15) {

            if (Apples.length < 5) {

               createApple()

            }

            snakeHead.MovementSpeed += 0.1
            Score += 10

            apple.Move()

            for (let i = 0; i < 5; i++) {
               var snake = new GameMaker.ShapeSprite("SnakeBody", new GameMaker.Vector2(-25, -25), new GameMaker.Vector2(12, 12), 0, "#4e8a5e")
               snake.id = snakeHead.Body.length
               snakeHead.Body.push(snake)
               world.addobjects(snake)
            }

         }

         for (let i = 0; i < 5; i++) {

            snakeHead.PrevPos.push({

               id: i,
               angle: 0,
               pos: snakeHead.Body[snakeHead.Body.length - 1].pos

            })
         }
      })

      snakeHead.Body.forEach((body, index) => {

         body.angle = snakeHead.PrevPos[index].angle
         body.pos = snakeHead.PrevPos[index].pos

      })

   }

   if (snakeHead.pos.X < Window.pos.X - (Window.size.X / 2) || snakeHead.pos.X > Window.pos.X + (Window.size.X / 2) || snakeHead.pos.Y < Window.pos.Y - (Window.size.Y / 2) || snakeHead.pos.Y > Window.pos.Y + (Window.size.Y / 2)) {

      if (!Death) { GameOver() }

   }

   world.render()

}, 1000 / 60)

//Calculate FPS
setInterval(() => {

   Text.text = `FPS: ${FPS * 4}`
   FPS = 0

}, 250)