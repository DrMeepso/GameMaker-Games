const MovmentVecter = {

   Left: false,
   Right: false

}

var Frame = 0

function randomIntFromInterval(min, max) { // min and max included 
  return Math.floor(Math.random() * (max - min + 1) + min)
}

//Make the world
const world = new GameMaker.World(GameMaker.Init())

world.backgroundColor = "#5e5e5e"

function createApple() {

   var Apple = new GameMaker.ShapeSprite("Apple", new GameMaker.Vector2(10,10), new GameMaker.Vector2(15,15), 0, "#f54242")
   Apple.Move = function(){

      this.pos = new GameMaker.Vector2(randomIntFromInterval(15, world.canvas.width - 15),randomIntFromInterval(15, world.canvas.height - 15))

   }
   Apple.Move()
   world.addobjects(Apple)

}

createApple()

var snakeHead = new GameMaker.ShapeSprite("SnakeHead", new GameMaker.Vector2(10,10), new GameMaker.Vector2(15,15), 0, "#66b07a")
snakeHead.MovementAngle = 0
snakeHead.PrevPos = []
snakeHead.Body = []
world.addobjects(snakeHead)

for (let i = 0; i < 10; i++) {

   snakeHead.PrevPos.push( {

      id: i,
      pos: new GameMaker.Vector2(10,10)

   })

}

for (let i = 0; i < 10; i++) {
   var snake = new GameMaker.ShapeSprite("SnakeBody", new GameMaker.Vector2(10,10), new GameMaker.Vector2(12,12), 0, "#4e8a5e")
   snakeHead.Body.push(snake)
   world.addobjects(snake)
}


var Bodys = world.objects.filter( object => object.name == "SnakeBody" )
var Apples = world.objects.find( object => object.name == "Apple" )
var Head = world.objects.find( object => object.name == "SnakeHead" )

world.objects = Bodys
world.objects.push(Head)
world.objects.push(Apples)

var Text = new GameMaker.TextSprite("FPS", new GameMaker.Vector2(1, 1), 0, "FPS: ")
//Text.font = "Fredoka"
world.addobjects(Text)

new GameMaker.Plugins.Keyboard(world)

window.addEventListener("keydown",function (e) {
   
   if(e.keyCode == 39){
      MovmentVecter.Right = true
   }
   if(e.keyCode == 37){
      MovmentVecter.Left = true
   }

},false);

window.addEventListener("keyup",function (e) {
   
   if(e.keyCode == 39){
      MovmentVecter.Right = false
   }
   if(e.keyCode == 37){
      MovmentVecter.Left = false
   }

},false);

var FPS = 0

//Update the frame every 60th of a second
setInterval(() => {

   Frame += 1
   FPS += 1
   
   if(MovmentVecter.Right){

      snakeHead.MovementAngle += 0.1

   }
   if(MovmentVecter.Left){

      snakeHead.MovementAngle -= 0.1

   }
   
   var HeadNextPos = new GameMaker.Vector2(
   
      snakeHead.pos.X + Math.cos(snakeHead.MovementAngle) * 2,
      snakeHead.pos.Y + Math.sin(snakeHead.MovementAngle) * 2

   )

   snakeHead.angle = snakeHead.pos.angle(HeadNextPos)

   snakeHead.PrevPos.unshift({

      pos: snakeHead.pos,
      id: Frame

   })

   snakeHead.PrevPos = snakeHead.PrevPos.filter( object => object.id > Frame - world.objects.filter( object => object.name == "SnakeBody" ).length )

   snakeHead.pos = HeadNextPos

   var Apples = world.objects.filter( objects => objects.name == "Apple" )
   Apples.forEach( apple => {

      if (apple.pos.distance(snakeHead.pos) < 15){

         if (Apples.length < 5) {

            createApple()            

         }
         apple.Move()

         for (let i = 0; i < 5; i++) {
            var snake = new GameMaker.ShapeSprite("SnakeBody", new GameMaker.Vector2(-25,-25), new GameMaker.Vector2(12,12), 0, "#4e8a5e")
            snakeHead.Body.push(snake)
            world.addobjects(snake)
         }

      }

      for (let i = 0; i < 5; i++) {

         snakeHead.PrevPos.push( {

            id: i,
            pos: snakeHead.Body[snakeHead.Body.length - 1].pos

       })
      }
   })

   snakeHead.Body.forEach( (body, index) => {

      body.angle = body.pos.angle(snakeHead.PrevPos[index].pos)
      body.pos = snakeHead.PrevPos[index].pos

   })

  //Render the world and push it to the canvas/screen
  world.render()

}, 1000/60)

//Calculate FPS
setInterval(() => {

   Text.text = `FPS: ${FPS * 4}`
   FPS = 0

}, 250)