"use strict";

class Cell
{

    constructor( node, row, col )
    {
	this._node = node;
	
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

    _call() 
	{
		this._called = true;	
		if(this._occupied)
		{
			this._node.classList.add("h");		
			return true;
		}
		else
		{
			this._node.classList.add("m");
			return false;
		}
	}


}
