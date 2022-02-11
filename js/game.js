"use strict";

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
    this._b_placement = new Board( container.getElementById( 'p' . this._num . '-board-placement' ) );
    this._b_target    = new Board( container.getElementById( 'p' . this._num . '-board-target' ) );
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
      default:
        window.alert("Invalid turn type specified: " + type);
        break;
    }
  }

  _doTargetingTurn()
  {

  }

  _doPlacementTurn()
  {

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
}
