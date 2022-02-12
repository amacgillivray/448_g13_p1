"use strict";

const alphabet = [
    'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n',
    'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z'
];

class cell {
    
    /** 
     * @param board 
     *        String such as "p1p" (player1's placement board) that acts as 
     *        a prefix to the cell's id.
     * @param row
     * @param col
     */
    constructor ( board, row, col )
    {
        this._board = board;
        this._row = row;
        this._col = col;
        this._occupied = false;
        this._called = false;        
        this._node = document.getElementById(board + alphabet[row] + col );
    }
    
    setOccupied()
    {
        this._occupied = true;
    }

}

class Ship 
{
    constructor( size, cells )
    {
        this._cells = cells;    
    }
    
    __boundscheck( row_offset = 0 , col_offset = 0 ){
        // todo - check that movement is valid 
    }
    
    moveA(){
        if (!this.__boundscheck( 0, -1 ))
            return;
    }
    
    moveW() {
        if (!this.__boundscheck( 1 ))
            return;
    }
    
    moveS(){
        if (!this.__boundscheck( -1 ))
            return;
    }
    
    moveD(){
        if (!this.__boundscheck( 0, 1 ))
            return;
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
        forEach( this._cells => function(cell){
            cell.setOccupied();
        });
    }
}


class Board
{
    constructor( rootNode, rows = 10, cols = 10 )
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
  // constructor ( boardPlacement, boardTarget )
  // {
  //   // or just give the container and player number?
  //   this._p = boardPlacement;
  //   this._t = boardTarget;
  // }

  constructor ( container, player_number )
  {
    // or just give the container and player number?
    this._num = player_number;
    this._container = container;
    this._b_placement = new Board( document.getElementById( 'p' + this._num + '-board-placement' ) );
    this._b_target    = new Board( document.getElementById( 'p' + this._num + '-board-target' ) );
    this._form = 
  }

  _giveTurn( type ="targeting" )
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
  _doPlacementTurn()
  {
      alert("Targeting");
      wasd
      enter
      
  }
  
  _doFirstTurn() 
  {
    // get the number of ships the player is going to place
    // then, loop over "DoPlacementTurn" until all ships are placed
  }

  _toggleHidden()
  {
    this._container.classList.toggle("hidden");
  }
}

class Game
{
  constructor()
  {
      this._p1 = new Player(
        document.getElementById("p1-boards-container"),
        1
      );

      this._p2 = new Player(
        document.getElementById("p2-boards-container"),
        2
      );
  }
  start(){
    this._p2._toggleHidden();
    this._p1._giveTurn("first");

    this._p1._toggleHidden();
    this._p2._toggleHidden();

    this._p2._giveTurn("first");
    this.loop();
  }
  loop()
  {
    // call toggle hidden on both players for each turn change
    
    this._p1._giveTurn()
  }
}

let game = new Game();
game.start();
