Battleship Project
==================

## Planned Language(s): 
To be determined

## Planned Classes:

### Board 
Constructed with a parameterized size
Creates a 2D (size NxN) array of cell objects 
Two boards exist per game
Tracks position of 5 ships, called cells (hits/misses)

#### Player's Board
Each player is given a "player's board" (name subject to change), where they place their own ships. 
The opposing player's called cells are checked against this board for hits/misses.

#### Tracking Board
Each player also gets a "tracking board", which tracks and displays their hits and misses while
hiding the placement of their opponent's ships.


### Cell
Tracks the status of a single cell on the board
    is_occupied flag tracks whether or not a ship is in the square
    was_called flag tracks whether or not the opponent has called this square
        if is_occupied && was_called, then hit
        if !is_occupied && was_called, then miss
    
### Ship
The ship class is constructed with a length, and tracks
both the orientation of the ship as it is placed as well as the cells that it is occupying.

