setTimeout(() => { console.log(Startup()) }, 1)

var GameState = {

   BombCount: 10,
   Waiting: true,
   GameOver: false,
   World: {}

}

function lerp(v0, v1, t) {
   return v0 * (1 - t) + v1 * t
}

function PreloadImages(){

   var UpdateImage = new Image(30, 30)
   UpdateImage.src = 'Assets/minesweeper_Pressed.png'

   var UpdateImage = new Image(30, 30)
   UpdateImage.src = 'Assets/minesweeper_Flag.png'

   var UpdateImage = new Image(30, 30)
   UpdateImage.src = 'Assets/minesweeper_Unpressed.png'

   var UpdateImage = new Image(30, 30)
   UpdateImage.src = 'Assets/minesweeper_Bomb.png'

   var UpdateImage = new Image(30, 30)
   UpdateImage.src = 'Assets/minesweeper_BombBoom.png'

   for (let Y = 1; Y < 8; Y++) {

      var UpdateImage = new Image(30, 30)
      UpdateImage.src = `Assets/minesweeper_${Y}.png`  

   }
}

function TileClicked(world, ID , e, GameStateText) {

      if (GameState.GameOver) return
      if (ID == undefined) return

      var SelectedObject = world.objects.find(object => object.ID === ID)

      if (e.button == 0 && SelectedObject.Flaged == false) {

         if (GameState.Waiting == true) {

            PickBombs(world ,world.plugins.mouse.pos )
            GameState.Waiting = false

         }

         if (SelectedObject.Bomb == true) {

            EndGame(world, GameStateText)

         } else {

            SelectedObject.Pressed = true

            if (SelectedObject.BombCloseness == 0) {
               SelectedObject.changeImage('Assets/minesweeper_Pressed.png')
               
               var CloseTiles = [
                  world.objects.find( object => object.ID == SelectedObject.ID + 10 && object.Pressed == false && object.pos.distance(SelectedObject.pos) < 90),
                  world.objects.find( object => object.ID == SelectedObject.ID - 10 && object.Pressed == false && object.pos.distance(SelectedObject.pos) < 90),
                  world.objects.find( object => object.ID == SelectedObject.ID + 1 && object.Pressed == false && object.pos.distance(SelectedObject.pos) < 90),
                  world.objects.find( object => object.ID == SelectedObject.ID - 1 && object.Pressed == false && object.pos.distance(SelectedObject.pos) < 90),
                  world.objects.find( object => object.ID == SelectedObject.ID + 11 && object.Pressed == false && object.pos.distance(SelectedObject.pos) < 90),
                  world.objects.find( object => object.ID == SelectedObject.ID - 11 && object.Pressed == false && object.pos.distance(SelectedObject.pos) < 90),
                  world.objects.find( object => object.ID == SelectedObject.ID + 9 && object.Pressed == false && object.pos.distance(SelectedObject.pos) < 90),
                  world.objects.find( object => object.ID == SelectedObject.ID - 9 && object.Pressed == false && object.pos.distance(SelectedObject.pos) < 90)
               ]

               CloseTiles.forEach( CurrentTile => {
   
                  if(CurrentTile == undefined) return
                  TileClicked(world, CurrentTile.ID, e)

               })
               
            }
            if (SelectedObject.BombCloseness > 0) {
               SelectedObject.changeImage(`Assets/minesweeper_${SelectedObject.BombCloseness}.png`)
            }

         }

      }
      if (e.button == 2) {

         if (SelectedObject.Pressed) {return}

         SelectedObject.Flaged = !SelectedObject.Flaged

         if (SelectedObject.Flaged == true){
   
            SelectedObject.changeImage('Assets/minesweeper_Flag.png')

            //Game Win State
            if (world.objects.filter(object => object.Flaged == true && object.Bomb == true).length == GameState.BombCount) {
      
               world.objects.filter( object => object.Pressed == false && object.Bomb == false).forEach( (UnPressedTiles) => {
   
                  TileClicked(world,UnPressedTiles.ID,{button: 0}) 

               })

               GameState.GameOver = true

               GameStateText.text = "You Win!"
               GameStateText.visible = true

                  setTimeout( () => {

                     ResetGame()

                  }, 2500)

            }

         } else {

            SelectedObject.changeImage('Assets/minesweeper_Unpressed.png')

         }
      }

}

function PickBombs(world ,MousePos){


   //Pick Bombs
   for (let X = 0; X < GameState.BombCount; X++) {

      var CouldBe = world.objects.filter(object => object.name === "TileObject" && object.pos.distance(MousePos) >= 150 && object.Bomb === false)

      const random = Math.floor(Math.random() * CouldBe.length)
      CouldBe[random].Bomb = true
   }

   var NormalTiles = world.objects.filter( object => object.name === "TileObject" && object.Bomb == false )

   NormalTiles.forEach( Tile => {

      Tile.BombCloseness = 0

      var Naboers = [
         world.objects.find( object => object.ID == Tile.ID + 10 && object.pos.distance(Tile.pos) < 90),
         world.objects.find( object => object.ID == Tile.ID - 10 && object.pos.distance(Tile.pos) < 90),
         world.objects.find( object => object.ID == Tile.ID + 1 && object.pos.distance(Tile.pos) < 90),
         world.objects.find( object => object.ID == Tile.ID - 1 && object.pos.distance(Tile.pos) < 90),
         world.objects.find( object => object.ID == Tile.ID + 11 && object.pos.distance(Tile.pos) < 90),
         world.objects.find( object => object.ID == Tile.ID - 11 && object.pos.distance(Tile.pos) < 90),
         world.objects.find( object => object.ID == Tile.ID + 9 && object.pos.distance(Tile.pos) < 90),
         world.objects.find( object => object.ID == Tile.ID - 9 && object.pos.distance(Tile.pos) < 90)
      ]

      Naboers.forEach( NextToTile => {

         if (NextToTile == undefined) return
         if (NextToTile.Bomb == true){

            Tile.BombCloseness += 1

         }
      })

   })

}

function EndGame(world, GameStateText){

   GameState.GameOver = true

   var CouldBe = world.objects.filter(object => object.Bomb === true)

   CouldBe.forEach( (tile, index) => {

      if(tile.Flaged) return
      tile.changeImage('Assets/minesweeper_BombBoom.png')
   
   })   

   GameStateText.text = "You Lose!"
   GameStateText.visible = true

   setTimeout( () => {

      ResetGame()

   }, 2500)

}

function ResetGame() {

   location.reload();

}

function Startup() {

   PreloadImages()

   //Create World
   const world = new GameMaker.World(GameMaker.Init(), new GameMaker.Vecter2(0, 0))
   world.backgroundColor = '#202124'

   GameState.World = world

   new GameMaker.Plugins.Mouse(world)

   //Create Tiles
   for (let X = 0; X < 10; X++) {

      for (let Y = 0; Y < 10; Y++) {

         var Tile = new GameMaker.ImageSprite("TileObject", new GameMaker.Vecter2(45 + (X * 45), 45 + (Y * 45)), new GameMaker.Vecter2(45, 45), 0, 'Assets/minesweeper_Unpressed.png')
         Tile.ID = (Y + (10 * X))
         Tile.Pressed = false
         Tile.Bomb = false
         Tile.Flaged = false
         world.addobjects(Tile)
      }
   }

   var Text = new GameMaker.TextSprite("FPS", new GameMaker.Vecter2(1, 1), 0, "FPS: ")
   Text.font = "Fredoka"
   world.addobjects(Text)

   var FlagCount = new GameMaker.TextSprite("Flag Count", new GameMaker.Vecter2(45 / 2, 450 + (45/2)), 0, "Flags: 0")
   FlagCount.font = "Fredoka"
   FlagCount.fontSize = "25"
   world.addobjects(FlagCount)

   var CorrectCount = new GameMaker.TextSprite("Correct Count", new GameMaker.Vecter2(45 / 2, (450 + (45/2)) + 25 ), 0, "Flags: 0")
   CorrectCount.font = "Fredoka"
   CorrectCount.fontSize = "25"
   world.addobjects(CorrectCount)

   var GameStateText = new GameMaker.TextSprite("StateText", new GameMaker.Vecter2((45 / 2) + 20, 45/2), 0, "You ....")
   GameStateText.font = "Fredoka"
   GameStateText.fontColor = "#202124"
   GameStateText.fontSize = "60"
   GameStateText.visible = false
   world.addobjects(GameStateText)

   var Selected = new GameMaker.ShapeSprite("Selected", new GameMaker.Vecter2(-60, -60), new GameMaker.Vecter2(45, 45), 0, "#ffffff")
   Selected.opacity = 20
   Selected.Neededpos = new GameMaker.Vecter2(-30, -30)
   world.addobjects(Selected)

   var FPS = 0

   world.canvas.addEventListener("mousedown", function (e) {

      var SelectedObject = world.objects.find(object => object.ID === Selected.SelectedID)

      TileClicked(world ,Selected.SelectedID, e, GameStateText)

   })


   //Update the screen
   setInterval(() => {

      world.objects.forEach((Object) => {

         if (Object.name != "TileObject") { return }

         if (((world.plugins.mouse.pos.X >= (Object.pos.X - (Object.size.X / 2))) && (world.plugins.mouse.pos.Y >= (Object.pos.Y - (Object.size.Y / 2)))) && ((world.plugins.mouse.pos.X <= (Object.pos.X + (Object.size.X / 2))) && (world.plugins.mouse.pos.Y <= (Object.pos.Y + (Object.size.Y / 2))))) {
            if (GameState.GameOver) return
            Selected.Neededpos = Object.pos
            Selected.SelectedID = Object.ID
         }
      })

      if (GameState.GameOver) {
         Selected.visible = false
      } else {
         Selected.visible = true
      }

      Selected.pos = new GameMaker.Vecter2(lerp(Selected.pos.X, Selected.Neededpos.X, 0.2), lerp(Selected.pos.Y, Selected.Neededpos.Y, 0.2))

      FlagCount.text = `Flags: ${GameState.BombCount - world.objects.filter(object => object.Flaged == true).length}`
      CorrectCount.text = world.objects.filter(object => object.Flaged == true && object.Bomb == true).length

      world.render()

      FPS += 1

   }, 1000 / 120)

   //Calculate FPS
   setInterval(() => {

      Text.text = `FPS: ${FPS * 4}`
      FPS = 0

   }, 250)

   return world

}