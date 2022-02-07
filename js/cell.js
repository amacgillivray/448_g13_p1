"use strict";

class Board 
{

    constructor( row, col )
    {
        /**
         * @brief The row number of the cell.
         */
        this._row = row;

        /**
         * @brief The column number of the cell
         */
        this._col = col;

        /**
         * @brief Whether or not this cell is currently occupied by a ship.
         */
        this._occupied = false;

        /**
         * @brief Whether or not this cell has been called by the opposing
         *        player.
         */
        this._called = false;
    }

    _draw()
    {
        
    }


}
