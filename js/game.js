"use strict";

const alphabet = [
    'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n',
    'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z'
];

/**
 * @brief converts a row letter to a number
 */
function rowToNum( letter )
{
    return alphabet.indexOf(letter);
}

function getXfromId( id )
{
    return parseInt(id[4]);
}

function getYfromId( id )
{
    return rowToNum(id[3]);
}

class Ship 
{
    constructor( board, parent, length )
    {
        this._board  = board;
        this._parent = parent;
        this._length = length;
        this._invalid = false;
        this._cells  = Array(length);
        for (let i = 0; i < length; i++)
        {    
            let node = document.getElementById(board+alphabet[i]+0);
            if (node.classList.contains("s")) {
                node.classList.add("so"); // overlapping
                this._invalid = true;
            } else {
                node.classList.add("s");
            }
            this._cells[i] = board+alphabet[i]+0;
        }
    }

    _translateBoundsCheck( offsetX = 0, offsetY = 0 )
    {
      for (let i = 0; i < this._length; i++)
      {
        let cell = this._cells[i];
        let new_x = offsetX + getXfromId(cell);
        let new_y = offsetY + getYfromId(cell);
        if ( new_x < 0 || new_x > 9 || new_y < 0 || new_y > 9 )
          return false;
      }
      console.log("Move is in-bounds.")
      return true;
    }

    translate( offsetX = 0, offsetY = 0)
    {
      if (!this._translateBoundsCheck( offsetX, offsetY ))
          return;

      // reset to false; if new position is not overlapping, will stay false,
      // otherwise will be set to true
      this._invalid = false;

      for (let i = 0; i < this._length; i++)
      {
        let cell = document.getElementById(this._cells[i]);
        let x = getXfromId(this._cells[i]);
        let y = getYfromId(this._cells[i]);

        if (cell.classList.contains("so"))
          cell.classList.remove("so");
        else
          cell.classList.remove("s")

        x = offsetX+parseInt(x);
        y = offsetY+y;
        this._cells[i] = this._board + alphabet[y] + x;
        console.log(this._cells[i]);

        let newCell = document.getElementById(this._cells[i]);

        if (newCell.classList.contains("s")) 
        {
          this._invalid = true;
          newCell.classList.toggle("so", true);
        } else {
          newCell.classList.toggle("s", true);
        }
      }
    }

    rotateQ()
    {
        // algorithmically shift by -90 deg
        // manual boundary check
    }

    rotateE(){
        // algorithmically shift by +90 deg 
        // manual boundary check
    }

    _confirm()
    {
        if (this._invalid)
          return;
        else 
          this._parent._endPlacementTurn(this._length);
    }
}


class Board
{
    constructor( rootNode )
    {
      this._root = rootNode;

      this._cells = Array.from(
        {length:this._n},
        (row) => Array.from(
          {length:this._n},
          (col) => new Cell(row, col, svg)
        )
      );
    }
}

class Player
{

  constructor ( game, container, player_number )
  {
    this._parent = game; 
     
    // or just give the container and player number?
    this._num = player_number;
    this._container = container;
    this._b_placement = new Board( document.getElementById( 'p' + this._num + '-board-placement' ) );
    this._b_target    = new Board( document.getElementById( 'p' + this._num + '-board-target' ) );
    this._form = document.getElementById("p" + this._num + "-ship-opt");
    this._formSubmit = document.getElementById("p" + this._num + "-ship-opt-submit" );
    this._shipCount = -1;
    this._shipsPlaced = 0;
    this._ships = null;
  }

  giveTurn( type = "targeting" )
  {
    // maybe have parameter "type", for "placement" or "targeting"
    // where type would be "placement" until all ships have been placed,
    // and then "targeting" until the game is complete.

    // this would control which board is active / waiting for input
    this._container.classList.remove("hidden");

    switch (type)
    {
      case "targeting" :
        this._doTargetingTurn();
        break;
      case "placement" :
        this._doPlacementTurn();
        break;
      case "first":
        this._doFirstTurn( this );
        break;
      default:
        window.alert("Invalid turn type specified: " + type);
        break;
    }
  }


  _doTargetingTurn()
  {
      alert("Targeting");
  }

  // only called by _doFirstTurn; 
  _doPlacementTurn( obj, shipLength )
  {
      alert("Placing ship of size 1x" + shipLength);
      this._ships[shipLength-1] = new Ship( "p"+this._num+"p", this, shipLength);
      window.addEventListener("keydown", function(e){
        //  if (e.code == 10) // 10 = enter
        //  {
            //  return;
        //  }  
        obj._placementTurnHandler(e);
      }, false);
  }
  


  _placementTurnHandler( e )
  {
      // this._ships[this._shipsPlaced] = new Ship(this._shipsPlaced+1);
      console.log(e.code);
      switch (e.code)
      {
          case "Enter":
            this._shipsPlaced++;
            this._parent.endturn( this._shipsPlaced );
            break;
          case "KeyA":
            // this._ships[this._shipsPlaced].moveA();
            this._ships[this._shipsPlaced].translate( -1 , 0 );
            break;
          case "KeyD":
            // this._ships[this._shipsPlaced].moveD();
            this._ships[this._shipsPlaced].translate( 1 , 0 );
            break;
          case "KeyW":
            // this._ships[this._shipsPlaced].moveW();
            this._ships[this._shipsPlaced].translate( 0 , -1 );
            break;
          case "KeyS":
            // this._ships[this._shipsPlaced].moveS();
            this._ships[this._shipsPlaced].translate( 0 , 1 );
            break;
          default:
            break;
      }
      return;
  }

  /** 
   * called by ship after placement is confirmed, 
   *  allows js to wait for input
   */
  _endPlacementTurn( i )
  {
      if (this._shipsPlaced == this._shipCount)
      {
        this._form.classList.toggle("hidden", true);    
        this._parent.endTurn( this._num );
      }

      this._doPlacementTurn(this, i+1);
  }
  

  _doFirstTurn( obj ) 
  {
    this._formSubmit.addEventListener("click", function(e){ 
        obj._firstTurnHandler(e) }, false );
  }
  
  _firstTurnHandler( e )
  {
      let str = "p" + this._num + "so_";
      for ( let i = 1; i <=5; i++ )
      {
          // alert(str+i);
          let button = document.getElementById(str + i); 
          if (button.checked)  {
              this._shipCount = button.value;
              this._ships = Array(this._shipCount);
              break;
          }
      }
      e.preventDefault();
      
      this._doPlacementTurn(this, 1);

  }

  

  _hide()
  {
    this._container.classList.toggle("hidden", true);
  }
}

class Game
{
  constructor()
  {
      this._p1 = new Player(
        this,
        document.getElementById("p1-boards-container"),
        1
      );

      this._p2 = new Player(
        this,
        document.getElementById("p2-boards-container"),
        2
      );
  }
  
  
  
  start(){
      
    // alert("Working!");
    this._p2._hide();
    this._p1.giveTurn("first");
    
    this._p1tc = 0;
    this._p2tc = 0;
    // this._p1._hide();
    // 
    // this._p2.giveTurn("first");
    // this._p2._hide();
    // this.loop();
  }
  
  endTurn( forPlayer )
  {
      if (forPlayer == 1)
      {
          this._p1._hide();
          this._p1tc++;
          if (this._p2tc == 0)
            this._p2.giveTurn("first");
          else
            this._p2.giveTurn("targeting");
      } else if (forPlayer == 2){
          this._p2._hide();
          this._p2tc++;
          if (this._p1tc == 0)
            this._p1.giveTurn("first");
          else
            this._p1.giveTurn("targeting");
      }
  }
}

let game = new Game();
game.start();
