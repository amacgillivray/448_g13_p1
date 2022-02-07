/**
 * @file board.js
 * @date 2022-02-02
 * 
 * @brief Defines the basic Board classes.
 * 
 * @author Andrew MacGillivray (a637m351@ku.edu)
 */

"use strict";

class Board 
{

    constructor( size_n = 10 )
    {
        this._n = size_n;

        this._cells = Array.from( {length:this._n}, (row) => Array.from( {length:this._n}, (col) => new Cell(row, col) ) );

    }

    /**
     * @brief Draws the board as an svg
     */
    _draw()
    {
        // todo 
    }

}

class Board_Player extends Board 
{
    
}

class Board_Target extends Board 
{

}