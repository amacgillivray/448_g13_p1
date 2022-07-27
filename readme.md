Battleship Project
==================

![p1](https://user-images.githubusercontent.com/40438470/181321847-1ee2a452-f4f4-464a-b9c4-e44d8fd14c5a.jpg)

The project uses JavaScript and SVG elements to create the game.

Most of the game's logic exists in the "game.js" file, which provides
thorough explanations for some all of the variables and functions.

Here's how the game works:

The `Game` class is created.
It creates two `Player` objects.
Each player object is given a first turn, where they create and place 1-5 `Ship` objects.
Then, each player is given `"targeting"` turns until someone wins.

## Other Notes

### Unused Assets
There are unused assets (carrier.svg) in the `/assets` folder that would make a beautiful improvement to the game board if completed.

### Ships (Per Player) - Interpretation
Our group was uncertain about the interpretation of "Number of Ships (per player)" and interpreted it to mean that each player chooses their own number of ships.
