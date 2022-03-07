/**
 * @file  game.js
 * @date  2022.02.12
 * 
 * @brief Defines the Battleship game
 * 
 * @author Andrew MacGillivray
 * @author Luke McCumber
 * @author Brian Bosse
 * @author Jarrod Grothusen
 */

 "use strict";

 const hit = new Audio("hit_effect.wav");
 const miss = new Audio("miss_effect.wav");
 const sunk = new Audio("sunk_ship_effect.wav");
 const over = new Audio("ended.wav");


 /**
  * @brief Set to false to disable extraneous "console.log()" operations.
  */
 const debug = true;
 
 /**
  * @brief Used to determine row letter identifiers
  * @details
  * Only the first ten letters are used. To convert from a letter to a number,
  * use "rowToNum". 
  */
 const alphabet = [
     'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n',
     'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z'
 ];
 
 /**
  * @brief Defines the names of each ship in a player's fleet.
  * @details
  * The values are grabbed in the Ship class constructor by fetching
  *      "fleet[this._length-1]"
  * i.e., the index of the array that is 1 less than the length of 
  * the ship.
  */
 const fleet = [
     "Patrol Boat",
     "Cruiser",
     "Destroyer",
     "Battleship",
     "Carrier"
 ];
 
 const fleetStyles = [
     "pb",
     "cvt",
     "dst",
     "bshp",
     "crr"
 ];
 
 /**
  * @brief The HTML attribute that indicates what ship owns a cell. 
  */
 const shipAttribute = "data-s";
 
 /**
  * @brief converts a row letter to a number using the Alphabet constant.
  */
 function rowToNum(letter) 
 {
     return alphabet.indexOf(letter);
 }
 
 /**
  * @brief Taking a cell ID of the form "p[1|2][p|t][A-J][0-9]", returns column number.
  * @param {string} id 
  * @returns {Number} The last character of the ID (the column number / x-coordinate),
  *                as an integer.
  */
 function getXfromId(id) 
 {
     return parseInt(id[4]);
 }
 
 /**
  * @brief Taking a cell ID of the form "p[1|2][p|t][A-J][0-9]", returns column number.
  * @param {string} id 
  * @returns {Number} The 4th character of the ID (the row number / y-coordinate),
  *                as an integer. 
  * @note To get the y-coordinate as a letter, use the return value as the index of alphabet,
  *       e.g. "let yAsLetter = alphabet[getYfromId(some_id)];"
  */
 function getYfromId(id) 
 {
     return rowToNum(id[3]);
 }
 
 /**
  * @brief Callback fn for keypress event listeners that listen for ship-placement
  *        instructions (WASD QE Enter).
  * @details
  * This function is necessary (instead of an anonymous function) to allow 
  * old / unnecessary eventListeners to be removed via removeEventListener().
  * 
  * @param {Event} e 
  */
 function keydowncb(e) 
 {
     e.currentTarget.obj._placementTurnHandler(e);
 }
 
 /**
  * @brief Callback fn for click event listener on the "confirm" button 
  *        shown to each player when they are selecting the number of ships
  *        to place.
  * @details
  * This function is necessary (instead of an anonymous function) to allow 
  * old / unnecessary eventListeners to be removed via removeEventListener().
  * @param {Event} e 
  */
 function submitclick(e) 
 {
     e.currentTarget.obj._firstTurnHandler(e);
 }
 
 /**
  * @brief Callback fn for click event listeners created for a player's 
  *        "targeting" turn (that is, a turn where they click a cell on
  *        the white grid in order to fire at that position on the opp.
  *        player's board).
  * @details
  * This function is necessary (instead of an anonymous function) to allow 
  * old / unnecessary eventListeners to be removed via removeEventListener().
  * 
  * @param {Event} e 
  */
 function targetingCB(e) 
 {
     e.currentTarget.obj._targetingHandler(e);
 }
 
 /**
  * @brief Callback fn for click event listeners created for a player's 
  *        "targeting" end-turn button.
  * @details
  * This function is necessary (instead of an anonymous function) to allow 
  * old / unnecessary eventListeners to be removed via removeEventListener().
  * 
  * @param {Event} e 
  */
 function targetingTurnEndCB(e) 
 {
     e.currentTarget.obj._targetingEnd(e);
 }
 
 /**
  * @brief Opens a modal displaying the provided content
  * @uses closeModal
  * @uses holdModal
  * @details
  * Content is applied as the innerHTML of a paragraph <p> in the modal.
  * 
  * @param {string} text 
  *        The text to display 
  */
 function openModal( text )
 {
     let container = document.getElementById("modalContainer");
     let content = document.getElementById("modalContent");
     let close = document.getElementById("modalClose");
     let mtext = document.getElementById("modalText");
     
     mtext.innerHTML = text;
 
     // Stop the modal from closing when the main content container is clicked
     content.addEventListener("click", holdModal, true);
 
     // But close it if the background or close button is clicked, or any key is pressed
     container.addEventListener("click", closeModal, true);
     close.addEventListener("click", closeModal, true);
     window.addEventListener("keydown", closeModal, true);
 
     container.classList.remove("hidden");
 }
 
 function holdModal( e )
 {
     e.stopPropagation();
     e.preventDefault();
 }
 
 /**
  * @brief Closes a modal, if opened.
  * @param {Event} e 
  */
 function closeModal( e )
 {
     e.stopImmediatePropagation();
     e.stopPropagation();
     e.preventDefault();
     let container = document.getElementById("modalContainer");
     let content = document.getElementById("modalContent");
     let close = document.getElementById("modalClose");
     let text = document.getElementById("modalText");
 
     // Remove all event listeners
     content.removeEventListener("click", holdModal, true);
     container.removeEventListener("click", closeModal, true);
     close.removeEventListener("click", closeModal, true);
     window.removeEventListener("keydown", closeModal, true);
 
     // Hide the modal and reset its content.
     container.classList.add("hidden");
     text.innerHTML = "&nbsp;";
 }
 
 /**
  * @class Ship
  * @brief Logical representation of a ship in the Battleship game.
  */
 class Ship {
 
     /**
      * 
      * @param {string} board
      *        The 3-character cell-ID prefix assigned to a given board.
      *        Ships are only logically represented for placement boards, 
      *        so "board" should always be "p1p" or "p2p" (which correspond
      *        to #p1-board-placement and #p2-board-placement, respectively).
      * @param {Number} length
      *        The length of the ship's longest side. 
      */
     constructor(board, length) {
         
         /**
          * @brief The board prefix
          */
         this._board = board;
         
         /**
          * @brief The length of the ship
          */
         this._length = length;
 
         /**
          * @brief The name, from the "fleet" constant, assigned for 
          *        ships of this length.
          */
         this._name = fleet[length - 1];
 
         /**
          * @brief Boolean flag; true when 1 or more of the ship's cells
          *        are already occupied by another ship.
          */
         this._invalid = false;
         
         /**
          * @brief Boolean flag; true when the ship has been placed and 
          *        can no longer be moved.
          */
         this._locked = false;
         
         /**
          * @brief Array of strings, where each string is the ID of a cell
          *        being occupied by the ship. 
          */
         this._cells = Array(length);
 
         /**
          * @brief Tracks the ship's health
          */
         this._health = length;
 
         /**
          * @brief Tracks how many times the ship has been hit. 
          *        Used to control the health-indicator's color
          */
         this._timesHit = 0;
 
         /**
          * @brief The HTML node that contains the ship name and health.
          */
         this._uiHealth = document.getElementById("p" + board[1] + "s" + length );
 
         /**
          * @brief HTML span element whose innerHTML is this._health
          */
         this._uiHealthInd = document.getElementById("p" + board[1] + "s" + length + "h");
 
         /* Initialize the ship on the board by collecting an adequate # 
            of Cell IDs and modifying their classlist to show them to the 
            player. */
         for (let i = 0; i < length; i++) {
             let node = document.getElementById(board + alphabet[i] + 0);
             if (node.classList.contains("s")) {
                 node.classList.add("so"); // overlapping
                 this._invalid = true;
             } else {
                 node.classList.add("s");
                 // todo - diff colors for each ship type
                 // node.classList.add(fleetStyles[length-1]);
             }
             this._cells[i] = board + alphabet[i] + 0;
         }
         if (debug) console.log("Created " + board + " " + this._name);
     }
 
     /**
      * @brief Checks whether the specified translation exceeds the boundaries 
      *        of the game board.
      * @param {Number} offsetX
      *              The number of cells the ship is moving in the X-direction 
      * @param {Number} offsetY 
      *              The number of cells the ship is moving in the Y-direction 
      * @returns {boolean}
      *          Whether or not the move is legal.
      */
     _translateBoundsCheck(offsetX = 0, offsetY = 0) {
         for (let i = 0; i < this._length; i++) {
             let cell = this._cells[i];
             let new_x = offsetX + getXfromId(cell);
             let new_y = offsetY + getYfromId(cell);
             if (new_x < 0 || new_x > 9 || new_y < 0 || new_y > 9)
                 return false;
         }
         if (debug) console.log("Move is in-bounds.")
         return true;
     }
 
     /**
      * @brief Prepares a cell that was being occupied by this ship to no longer
      *        be occupied by this ship, by appropriately modifying the cell's 
      *        class list.
      * @param {Node} cell
      *        DOM node for the cell being modified. NOT an ID string.  
      */
     _prepMove( cell )
     {
         if (cell.classList.contains("so"))
             cell.classList.remove("so");
         else if (!cell.classList.contains("l"))
             cell.classList.remove("s")
     }
 
     /**
      * @brief Applies a translation to the ship.
      * @details
      * If the requested move is legal, the ship will update it's "this._cells"
      * array as well as the DOM to stop occupying the old cells, and start 
      * occupying the ones that it will be in after moving +offsetX cols and
      * +offsetY rows.
      * 
      * @param {Number} offsetX
      *        The number of columns to move 
      * @param {Number} offsetY 
      *        The number of rows to move
      * @returns {void}
      */
     translate(offsetX = 0, offsetY = 0) {
         if (this._locked || !this._translateBoundsCheck(offsetX, offsetY))
             return;
 
         // reset to false; if new position is not overlapping, will stay false,
         // otherwise will be set to true
         this._invalid = false;
 
         // Go ahead and get rid of the classes that act as "occupied" flags
         // before using those occupied flags to tell whether or not a new
         // position is valid. (This keeps the ship from invalidating itself 
         // when a new cell position was also an old cell position, such
         // as when moving in a vertical line while vertically oriented.)
         for (let i = 0; i < this._length; i++)
         {
             this._prepMove(document.getElementById(this._cells[i]));
         }
 
         for (let i = 0; i < this._length; i++) {
             let x = getXfromId(this._cells[i]);
             let y = getYfromId(this._cells[i]);
 
             x = offsetX + parseInt(x);
             y = offsetY + y;
             this._cells[i] = this._board + alphabet[y] + x;
 
             if (debug) console.log(this._cells[i]);
 
             let newCell = document.getElementById(this._cells[i]);
             if (newCell.classList.contains("s")) {
                 this._invalid = true;
                 newCell.classList.add("so", true);
             } else {
                 newCell.classList.toggle("s", true);
             }
         }
         return;
     }
 
     /**
      * @brief Rotates the ship, anti-clockwise or clockwise
      * @param {boolean} ccw [ = true ]
      * @returns {void} 
      */
     rotate(ccw = true) 
     {
         if (this._locked)
             return;
 
         let was_invalid = this._invalid;
 
         // reset to false; if new position is not overlapping, will stay false,
         // otherwise will be set to true
         this._invalid = false;
 
         let origin = this._cells[0];
         let ox = getXfromId(origin);
         let oy = getYfromId(origin);
 
         let new_cells = Array(this._length);
             new_cells[0] = origin;
 
         let vertical = ( getXfromId( this._cells[this._length-1] ) == ox );
 
         let originHigh = false;
         if (vertical) // If vertical, the origin is high if origin Y > last cell Y
             originHigh = ( oy > getYfromId( this._cells[this._length-1] ) );
         else          // If horizontal, the origin is high if origin X > last cell X
             originHigh = ( ox > getXfromId( this._cells[this._length-1] ) );
 
         // Loop 1: Calculate new cell positions
         // NOTE - i starts at one, because the origin is not altered by rotation.
         for (let i = 1; i < this._length; i++) 
         {
             let x = getXfromId(this._cells[i]);
             let y = getYfromId(this._cells[i]);
             let new_x = -1;
             let new_y = -1;
 
             // Conditional Rotation Matrix:
             // Outer  Condition: if Counter-Clockwise 
             // Middle Condition: if OriginHigh 
             // Inner  Condition: if Vertical
             if ( ccw ){
                 if ( originHigh ){
                     // C1
                     if ( vertical ){
                         new_x = ox - (oy-y);
                         new_y = oy;
                     // C2
                     } else {
                         new_x = ox;
                         new_y = oy + (ox-x);
                     }
                 } else { 
                     // C3
                     if ( vertical ){
                         new_x = ox + (y-oy);
                         new_y = oy;
                     // C4
                     } else {
                         new_x = ox;
                         new_y = oy - (x-ox);
                     }
                 }
             } else {
                 if ( originHigh )
                 {
                     // C5
                     if ( vertical )
                     {
                         new_x = ox + (oy-y);
                         new_y = oy;
                     // C6
                     } else {
                         new_x = ox;
                         new_y = oy - (ox-x);
                     }
                 } else { 
                     // C7
                     if ( vertical )
                     {
                         new_x = ox - (y-oy);
                         new_y = oy;
                     // C8
                     } else {
                         new_x = ox;
                         new_y = oy + (x-ox);
                     }
 
                 }
             }
 
             // If the rotation moves any cell out-of-bounds, do not apply it
             if ( new_x < 0 || new_x > 9 || new_y < 0 || new_y > 9 ) 
             {
                 if (debug) console.log("Skipping rotation resulting in x=" + new_x + ", y=" + new_y + ", for cell " + i);
                 this._invalid = was_invalid;
                 return;
             }
 
             // Store the new ID string in "new_cells" so the rotation can be applied in L2
             new_cells[i] = this._board + alphabet[new_y] + new_x;
         }
 
         // Loop 2: Apply Rotation
         // NOTE - I starts at one, because the origin is not translated
         for (let i = 0; i < this._length; i++) {
             let cell = document.getElementById(this._cells[i]);
             this._prepMove(cell);
             this._cells[i] = new_cells[i];
             cell = document.getElementById(this._cells[i]);
 
             if (cell.classList.contains("s")) {
                 this._invalid = true;
                 cell.classList.add("so", true);
             } else {
                 cell.classList.toggle("s", true);
             }
         }
         return;
     }
 
     /**
      * @brief Updates the ship's health and the health display in the player's UI.
      * @return {boolean}
      *         True:  The ship was destroyed
      *         False: The ship is hanging on for dear life.
      */
     decrementHealth()
     {
         this._timesHit++;
         this._health--;
         this._uiHealthInd.innerHTML = this._health;
         if (this._health<=0){
             this._uiHealth.classList.add("dstry");
             return true;
         } else {
             this._uiHealth.classList.add("hit" + this._timesHit);
             return false;
         }
     }
 
     /**
      * @brief Confirms the ship's placement
      * @returns {boolean}
      *          True:  The ship's placement was confirmed
      *          False: The ship is in at least one already-occupied space and
      *                 cannot be placed.
      */
     _confirm() {
         if (!this._invalid)
             this._lock();
         return !this._invalid;
     }
 
     /**
      * @internal
      * @brief Locks the ship's placement
      * @pre   none
      * @post  this._locked = true
      *        Further attempts to translate or rotate the ship will be ignored.
      */
     _lock() {
         this._locked = true;
         for (let i = 0; i < this._length; i++) {
             let cell = document.getElementById(this._cells[i]);
             cell.classList.add("l"); // "l" indicates locked
             cell.setAttribute(shipAttribute, this._name);
         }
     }
 }
 
 /**
  * @class Player
  * @brief Defines a logical represenation of the game's players.
  * @uses  Ship
  * @uses  Game
  */
 class Player {
 
     /**
      * @param {Game} game 
      *        The Game object that owns this player.
      * @param {Node} container 
      *        The DOM Node that contains this player's screen (UI, boards).
      * @param {Number} player_number 
      *        The player number (needed to determine ID strings for some operations).
      */
     constructor(game, container, player_number) {
 
         /**
          * @brief The Game that owns the player.
          */
         this._parent = game;
 
         /**
          * @brief The node containing all of the interactive elements for this player.
          */
         this._container = container;
 
         /**
          * @brief The player number
          */
         this._num = player_number;
         
         // /**
         //  * @brief String "p1" or "p2" that identifies the opposing player. 
         //  * @details
         //  * Provided solely for 
         //  */
         // this._opp = "p" + ((this._num % 2) + 1);
 
         /**
          * @brief The HTML form element used by this player to select how many ships they
          *        want to place on their board.
          */
         this._form = document.getElementById("p" + this._num + "-ship-opt");
 
         /**
          * @brief The HTML submit button that is used to submit this._form.
          */
         this._formSubmit = document.getElementById("p" + this._num + "-ship-opt-submit");
             // Add event listener and reference to this object to handle form submission
             this._formSubmit.addEventListener("click", submitclick, true);
             this._formSubmit.obj = this;
 
         /**
          * @brief The HTML link that is used to confirm the end of a player's turn
          */
         this._turnEndButton = document.getElementById("p" + this._num + "-end-turn");
             this._turnEndButton.addEventListener("click", targetingTurnEndCB, true);
             this._turnEndButton.obj = this;
             this._turnEndButton.classList.add("etHidden");
 
         /**
          * @brief Node for the SVG element where this player places their ships.
          */
         this._b_placement = document.getElementById('p' + this._num + '-board-placement');
 
         /**
          * @brief Node for the SVG element that this player clicks when guessing
          *        the location of enemy ships
          */
         this._b_target = document.getElementById('p' + this._num + '-board-target');
 
         /**
          * @brief The size of this player's fleet. Pertains to the number (1-5) chosen
          *        in the player's form.
          */
         this._fleetSize = -1;
 
         /**
          * @brief The number of ships the player has placed so far. 
          *        Used to control the flow of ship placement operations.
          */
         this._shipsPlaced = 0;
 
         /**
          * @brief An array of {Ship} objects for this player
          */
         this._ships = null;
 
         /**
          * @brief The number of ships deployed by the enemy player.
          * @details
          * Used to evaluate win conditions at the end of a targeting turn that scored a hit.
          * Remains -1 until this._targetingHandler() has been triggered (which is the first
          * time win conditions need to be evaluated).
          */
         this._oppShips = -1;
 
         /**
          * @brief How many of the opposing player's ships have been destroyed
          * @todo 
          */
         this._oppShipsDestroyed = 0;
         this._gameover = false;
         this._opponent;
 
     }

     /**
      * @brief Gives this player a turn of the specified type ("first" or "targeting").
      * @details
      * This function is mostly redundant, but still exists as an easy way to toggle the 
      * visibility of each player's screen.
      * @param {string} type 
      * @returns 
      */
     giveTurn(type = "targeting") {
         // maybe have parameter "type", for "placement" or "targeting"
         // where type would be "placement" until all ships have been placed,
         // and then "targeting" until the game is complete.
 
         // this would control which board is active / waiting for input
         this._container.classList.remove("hidden");
 
         switch (type) {
             case "targeting":
                 this._doTargetingTurn();
                 break;
             case "first":
                 // no action needed;
                 break;
             default:
                 openModal("Invalid turn type specified: " + type);
                 break;
         }
         return;
     }
 
     /**
      * @internal
      * @brief Creates an event listener for clicks on the player's targeting board.
      * @pre   The player's targeting board is not interactive
      * @post  Clicking the player's target board fires an event and ends the turn.
      * @uses  targetingCB
      *        Callback function; simply ensures that this._targetingHandler(e) is 
      *        called when the board is clicked.
      */
     _doTargetingTurn() {
        if(!this._gameover){
            openModal("Player " + this._num + ": Choose Target");
            this._b_target.addEventListener("click", targetingCB, false);
            this._b_target.obj = this;
        }
        else{
            over.play();
            openModal("The AI won the game! Please exit the page");
            Promise(resolve => setTimeout(resolve, 3000));
            this._turnEndButton.addEventListener("click", function(e){
                e.preventDefault();
                location.reload();
            });
        }
     }
 
     /**
      * @internal
      * @brief @
      */
     _targetingHandler(e) {
 
         // ignore clicks on anything other than the grid rectangles
         if ( !e.target.nodeName == "rect" )
             return;
 
         // ignore clicks on elements that were already targeted
         if ( e.target.classList.contains("h") || e.target.classList.contains("m") )
             return;
 
         let id = e.target.getAttribute("id");
         let x = getXfromId(id);
         let y = getYfromId(id);
 
         // Get the opposing player's JavaScript object.
         // We'll use this to update their ship's health if the current player scored a hit.
         let opponent = (e.currentTarget.obj._num == 1) ? e.currentTarget.obj._parent._p2 : e.currentTarget.obj._parent._p1;
         if (e.currentTarget.obj._oppShips == -1)
         {
             e.currentTarget.obj._oppShips = opponent._fleetSize;
         }
 
         // This is checking the cell on the opposing player's placement board that has the same 
         // row and column number. Thus, the cell ID we're looking for will be of the form: 
         //      "pXp[A-J][0-9]"
         // Where X = 2 if the current player is 1, and vice-versa, and the last two digits correspond
         // to the clicked cell's x and y coordinates.
         let ref = document.getElementById(
             "p" +                                   // p 
             ((e.currentTarget.obj._num % 2) + 1) +  // 1 or 2
             "p" +                                   // p
             alphabet[y] +                           // some col in A-J
             x                                       // some int in 0-9
         );
 
         let msg = "Hit!";
 
         if (ref.classList.contains("s")) {
             hit.play();
             if (debug) console.log(opponent);
 
             // Update the health of the opposing player's ship
             let shipHit = ref.getAttribute(shipAttribute);
                 shipHit = fleet.indexOf(shipHit);
             if ( opponent._ships[shipHit].decrementHealth() ) {
                 sunk.play();
                 //e.currentTarget.obj._oppShipsDestroyed++
                 this._opponent._oppShipsDestroyed++;
                 msg = msg + " You sank their " + ref.getAttribute(shipAttribute);
             }
             
             // Track the hit visually by adding a hitmarker (red fill color / "h" class)
             document.getElementById(id).classList.add("h");
             ref.classList.add("h");
         } else {
             miss.play();
             msg = "Miss!";
             document.getElementById(id).classList.add("m");
             ref.classList.add("m");
         }
 
         // Tell the player of their accomplishments (or lack thereof)
         openModal( msg );
 
         e.currentTarget.obj._turnEndButton.classList.remove("etHidden");
         e.currentTarget.obj._b_target.removeEventListener("click", targetingCB, false);
         e.currentTarget.obj._turnEndButton.classList.add("suggest");
 
         // Trigger win if the last opponent ship was destroyed
         // if (e.currentTarget.obj._oppShipsDestroyed == e.currentTarget.obj._oppShips)
         if (this._opponent._oppShipsDestroyed == this._opponent._oppShips)
         {
             e.currentTarget.obj._parent.triggerWin(e.currentTarget.obj._num);
             e.currentTarget.obj._turnEndButton.innerHTML = "New Game";
             this._turnEndButton.removeEventListener("click", targetingTurnEndCB, true);
             this._turnEndButton.addEventListener("click", function(e){
                 e.preventDefault();
                 location.reload();
             });
         }
         // e.currentTarget.obj._parent.endTurn(e.currentTarget.obj._num);
     }
 
     _targetingEnd( e )
     {
         e.currentTarget.obj._turnEndButton.classList.remove("suggest");
         e.currentTarget.obj._turnEndButton.classList.add("etHidden");
         e.currentTarget.obj._parent.endTurn(e.currentTarget.obj._num);
     }
 
     /**
      * @internal
      * @brief Places a ship.
      * @param {Player} obj 
      *        Parameter allows reference to this object after event listener callback
      *        (todo - can we get rid of this?)
      * @param {Number} shipLength 
      *        The length of the ship being placed
      */
     _doPlacementTurn(obj, shipLength) {
         openModal("Admiral, place your " + fleet[shipLength-1] + ".");
         window.addEventListener("keydown", keydowncb, true);
         window.obj = obj;
         this._ships[this._shipsPlaced] = new Ship("p" + this._num + "p", shipLength);
     }
 
     /**
      * @internal
      * @brief Handles a placement turn by using specific keystrokes to modify the ship's
      *        location / confirm placement.
      * @param {Event} e 
      * @returns {void}
      */
     _placementTurnHandler(e) {
         
         let ship = this._ships[this._shipsPlaced];
 
         if (debug) console.log(e.code);
 
         switch (e.code) {
             // ================== 
             // TRANSLATION  MOVES 
             // "A", "D", "W", "S"
             // ================== 
             case "KeyA":
                 e.preventDefault();
                 ship.translate(-1, 0);
                 break;
             case "KeyD":
                 e.preventDefault();
                 ship.translate(1, 0);
                 break;
             case "KeyW":
                 e.preventDefault();
                 ship.translate(0, -1);
                 break;
             case "KeyS":
                 e.preventDefault();
                 ship.translate(0, 1);
                 break;
             // ==============
             // ROTATION MOVES
             // "Q", "E"
             // ==============
             case "KeyE":
                 e.preventDefault();
                 ship.rotate(true);
                 break;                
             case "KeyQ":
                 e.preventDefault();
                 ship.rotate(false);
                 break;
             // =========================
             // CONFIRMATION OF PLACEMENT
             // "Enter"
             // =========================
             case "Enter":
                 e.preventDefault();
                 let placedShip = ship._confirm();
                 if (placedShip) {
                     this._shipsPlaced++;
                     window.removeEventListener("keydown", keydowncb, true);
                     this._endPlacementTurn(this._ships[this._shipsPlaced - 1]._length);
                 } else {
                     if (debug) console.log("Ship refused to confirm.");
                 }
                 break;
             // =======================
             // IGNORE OTHER KEYSTROKES
             // =======================
             default:
                 break;
         }
         return;
     }
 
     /** 
      * @internal
      * @brief Called after placement is confirmed. Ends the current placement, then
      *        starts a new one or tells the game to end the turn for the current 
      *        player.
      */
     _endPlacementTurn(i) {
         // this._shipsPlaced++;
         // window.removeEventListener("keydown", keydowncb, false);
         if (this._shipsPlaced >= this._fleetSize) {
             openModal("That's everything. Time to batten down the hatches.");
             this._form.classList.toggle("hidden", true);
             this._parent.endTurn(this._num);
             return;
         } else {
             this._doPlacementTurn(this, i + 1);
         }
         return;
     }
 
     /**
      * @internal
      * @brief Gets the number of ships the player wants to use, then
      *        starts placement operations until that many ships are 
      *        on the player's board.
      * @param {*} e 
      */
     _firstTurnHandler(e) {
         e.preventDefault();
 
         let str = "p" + this._num + "so_";
         for (let i = 1; i <= 5; i++) {
             // alert(str+i);
             let button = document.getElementById(str + i);
             if (button.checked) {
                 this._fleetSize = button.value;
                 this._ships = Array(this._fleetSize);
                 if (debug) console.log("Player " + this._num + " will place " + this._fleetSize + " ships.")
                 break;
             }
         }
         this._form.classList.toggle("hidden", true);
         this._formSubmit.removeEventListener("click", submitclick, false);
 
         this._doPlacementTurn(this, this._shipsPlaced + 1);
     }
 
     /**
      * @brief Hides this player's screen (this._container)
      */
     _hide() {
         this._container.classList.toggle("hidden", true);
     }
 }




 /**
  * @class AI_Player
  * @brief Defines a logical represenation of the AI Player.
  * @uses  Ship
  * @uses  Game
  */
  class AI_Player {
 
    /**
     * @param {Game} game 
     *        The Game object that owns this player.
     * @param {Node} container 
     *        The DOM Node that contains this player's screen (UI, boards).
     * @param {Number} player_number 
     *        The player number (needed to determine ID strings for some operations).
     * @param {Player} player_1
     *        The player number (needed to determine ID strings for some operations).
     */
    constructor(game, container, player_number, player_1) {

        /**
         * @brief The Game that owns the player.
         */
        this._parent = game;

        /**
         * @brief The node containing all of the interactive elements for this player.
         */
        this._container = container;

        /**
         * @brief The player number
         */
        this._num = player_number;

        this._opponent = player_1
        
        // /**
        //  * @brief String "p1" or "p2" that identifies the opposing player. 
        //  * @details
        //  * Provided solely for 
        //  */
        // this._opp = "p" + ((this._num % 2) + 1);

        /**
         * @brief The HTML form element used by this player to select how many ships they
         *        want to place on their board.
         */
        //this._form = document.getElementById("p" + this._num + "-ship-opt");

        /**
         * @brief The HTML submit button that is used to submit this._form.
         */
        //this._formSubmit = document.getElementById("p" + this._num + "-ship-opt-submit");
            // Add event listener and reference to this object to handle form submission
            //this._formSubmit.addEventListener("click", submitclick, true);
            //this._formSubmit.obj = this;

        /**
         * @brief The HTML link that is used to confirm the end of a player's turn
         */
        this._turnEndButton = document.getElementById("p" + this._num + "-end-turn");
            this._turnEndButton.addEventListener("click", targetingTurnEndCB, true);
            this._turnEndButton.obj = this;
            this._turnEndButton.classList.add("etHidden");

        /**
         * @brief Node for the SVG element where this player places their ships.
         */
        this._b_placement = document.getElementById('p' + this._num + '-board-placement');

        /**
         * @brief Node for the SVG element that this player clicks when guessing
         *        the location of enemy ships
         */
        this._b_target = document.getElementById('p' + this._num + '-board-target');

        /**
         * @brief The size of this player's fleet. Pertains to the number (1-5) chosen
         *        in the player's form.
         */
        this._fleetSize = -1;

        /**
         * @brief The number of ships the player has placed so far. 
         *        Used to control the flow of ship placement operations.
         */
        this._shipsPlaced = 0;

        /**
         * @brief An array of {Ship} objects for this player
         */
        this._ships = null;

        /**
         * @brief The number of ships deployed by the enemy player.
         * @details
         * Used to evaluate win conditions at the end of a targeting turn that scored a hit.
         * Remains -1 until this._targetingHandler() has been triggered (which is the first
         * time win conditions need to be evaluated).
         */
        this._oppShips = -1;

        /**
         * @brief How many of the opposing player's ships have been destroyed
         * @todo 
         */
        this._oppShipsDestroyed = 0;

        this._targets = [];

        this._queue = [];

    }

    inTargets(x, y){
        for(let i = 0; i < this._targets.length; i++){
            let coords = this._targets[i];
            if(coords[0] == x && coords[1] == y){
                return true;
            }
        }
        return false;
    }

    /**
     * @brief Gives this player a turn of the specified type ("first" or "targeting").
     * @details
     * This function is mostly redundant, but still exists as an easy way to toggle the 
     * visibility of each player's screen.
     * @param {string} type 
     * @returns 
     */
    giveTurn(type = "targeting") {
        // maybe have parameter "type", for "placement" or "targeting"
        // where type would be "placement" until all ships have been placed,
        // and then "targeting" until the game is complete.

        // this would control which board is active / waiting for input
        this._container.classList.remove("hidden");

        switch (type) {
            case "targeting":
                this._doTargetingTurn();
                break;
            case "first":
                // no action needed;
                this._firstTurnHandler();
                break;
            default:
                openModal("Invalid turn type specified: " + type);
                break;
        }
        return;
    }

    /**
     * @internal
     * @brief Creates an event listener for clicks on the player's targeting board.
     * @pre   The player's targeting board is not interactive
     * @post  Clicking the player's target board fires an event and ends the turn.
     * @uses  targetingCB
     *        Callback function; simply ensures that this._targetingHandler(e) is 
     *        called when the board is clicked.
     */
    _doTargetingTurn() {
        openModal("Player " + this._num + ": Choose Target");
        this._targetingHandler();
        this._b_target.obj = this;
    }

    /**
     * @internal
     * @brief @
     */
    _targetingHandler() {
        // random numbers based off of https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math/random
        let finished = false;
        let x;
        let y;
        if(this._queue.length == 0){
            while(!finished){
                x = Math.floor(Math.random() * 10);
                y = Math.floor(Math.random() * 10);
                if(!this.inTargets(x,y)){
                    if(x < 10 && y < 10){
                        finished = true;
                        this._targets.push([x,y]);
                    }
                }
            }
        }
        else{
            while(!finished){
                if(this._queue.length >= 0){
                    let arr = this._queue.shift(); // removes and returns first element
                    x = arr[0];
                    y = arr[1];
                    if(x <= 9 && x >= 0){
                        if(y <= 9 && y >= 0){
                            if(!this.inTargets(x, y)){
                                finished = true; // only ends loop if it is a valid hit
                                this._targets.push([x,y]);
                            }
                        }
                    }
                }
                else{
                    x = Math.floor(Math.random() * 9);
                    y = Math.floor(Math.random() * 9);
                    if(!this.inTargets(x,y)){
                        finished = true;
                        this._targets.push([x,y]);
                    }
                }
            }
        }

        // Get the opposing player's JavaScript object.
        // We'll use this to update their ship's health if the current player scored a hit.
        //let opponent = e.currentTarget.obj._parent._p1;

        if (this._opponent._oppShips == -1)
        {
            this._opponent._oppShips = this._opponent._fleetSize;
        }

        // This is checking the cell on the opposing player's placement board that has the same 
        // row and column number. Thus, the cell ID we're looking for will be of the form: 
        //      "pXp[A-J][0-9]"
        // Where X = 2 if the current player is 1, and vice-versa, and the last two digits correspond
        // to the clicked cell's x and y coordinates.
        let ref = document.getElementById(
            "p" +                                   // p 
            (1) +  // 1 or 2
            "p" +                                   // p
            alphabet[y] +                           // some col in A-J
            x                                       // some int in 0-9
        );
        let id = "p"+1+"p"+alphabet[y] + x 

        let msg = "Hit!";

        if (ref.classList.contains("s")) {
            
            if (debug) console.log(this._opponent);

            // Update the health of the opposing player's ship
            console.log("player 2 hit a ship");
            this._queue.push([x-1,y]);
            this._queue.push([x,y-1]);
            this._queue.push([x+1,y]);
            this._queue.push([x,y+1]);
            
            let shipHit = ref.getAttribute(shipAttribute);
            console.log(shipHit);
            shipHit = fleet.indexOf(shipHit);
            console.log(shipHit);
            if (this._opponent._ships[shipHit].decrementHealth() ) {
                this._queue = [];
                console.log("reached right spot");
                this._opponent._oppShipsDestroyed++;
                console.log(this._opponent._oppShipsDestroyed)
                msg = msg + " You sank their " + ref.getAttribute(shipAttribute);
            }
            
            // Track the hit visually by adding a hitmarker (red fill color / "h" class)
            document.getElementById(id).classList.add("h");
            ref.classList.add("h");
        } else {
            msg = "Miss!";
            document.getElementById(id).classList.add("m");
            ref.classList.add("m");
        }

        // Tell the player of their accomplishments (or lack thereof)
        openModal( msg );

        this._opponent._turnEndButton.classList.remove("etHidden");
        this._opponent._b_target.removeEventListener("click", targetingCB, false);
        this._opponent._turnEndButton.classList.add("suggest");

        // Trigger win if the last opponent ship was destroyed
        if (this._opponent._oppShipsDestroyed == this._opponent._oppShips)
        {
            console.log("reached destroyed ship");
            console.log(this._opponent._oppShipsDestroyed);
            console.log(this._opponent._oppShips);
            this._opponent._parent.triggerWin(2);
            //openModal("A grueling battle... But Player " + forPlayer + " has come out on top!");
            this._opponent._turnEndButton.innerHTML = "New Game";
            this._opponent._gameover = true;
            //openModal("A grueling battle... But Player " + forPlayer + " has come out on top!");
            //this._turnEndButton.removeEventListener("click", targetingTurnEndCB, true);
            //this._turnEndButton.addEventListener("click", function(e){
                //e.preventDefault();
                //location.reload();
            //});
        }
        this._opponent._parent.endTurn(2);
    }

    _targetingEnd()
    {
        this._opponent._turnEndButton.classList.remove("suggest");
        this._opponent._turnEndButton.classList.add("etHidden");
        this._opponent._parent.endTurn(this._opponent._num);
    }

    /**
     * @internal
     * @brief Places a ship.
     * @param {Player} obj 
     *        Parameter allows reference to this object after event listener callback
     *        (todo - can we get rid of this?)
     * @param {Number} shipLength 
     *        The length of the ship being placed
     */
    _doPlacementTurn(obj, shipLength) {
        //openModal("Admiral, place your " + fleet[shipLength-1] + ".");
        //window.addEventListener("keydown", keydowncb, true);
        //window.obj = obj;
        this._ships[this._shipsPlaced] = new Ship("p" + this._num + "p", shipLength);
        this._placementTurnHandler();
    }

    /**
     * @internal
     * @brief Handles a placement turn by using specific keystrokes to modify the ship's
     *        location / confirm placement.
     * @param {Event} e 
     * @returns {void}
     */
    _placementTurnHandler() {
        
        let ship = this._ships[this._shipsPlaced];
        let A = Math.floor(Math.random() * 9);
        let D = Math.floor(Math.random() * 9);
        let W = Math.floor(Math.random() * 9);
        let S = Math.floor(Math.random() * 9);
        let E = Math.floor(Math.random() * 2);
        // ================== 
        // TRANSLATION  MOVES 
        // "A", "D", "W", "S"
        // ================== 
        for(let i = 0; i < A; i++){
            ship.translate(-1, 0);
        }
        for(let i = 0; i < D; i++){
            ship.translate(1, 0);
        }
        for(let i = 0; i < W; i++){
            ship.translate(0, -1);
        }
        for(let i = 0; i < S; i++){
            ship.translate(0, 1);
        }
        // ==============
        // ROTATION MOVES
        // "Q", "E"
        // ==============
        for(let i = 0; i < E; i++){
            ship.rotate(true);
        }             
        let placedShip = ship._confirm();
        if (placedShip) {
            this._shipsPlaced++;
            //window.removeEventListener("keydown", keydowncb, true);
            this._endPlacementTurn(this._ships[this._shipsPlaced - 1]._length);
        } else {
            if (debug) console.log("Ship refused to confirm.");
            this._placementTurnHandler()
        }
        return;
    }

    /** 
     * @internal
     * @brief Called after placement is confirmed. Ends the current placement, then
     *        starts a new one or tells the game to end the turn for the current 
     *        player.
     */
    _endPlacementTurn(i) {
        // this._shipsPlaced++;
        // window.removeEventListener("keydown", keydowncb, false);
        if (this._shipsPlaced >= this._fleetSize) {
            openModal("That's everything. Time to batten down the hatches.");
            //this._form.classList.toggle("hidden", true);
            this._parent.endTurn(this._num);
            return;
        } else {
            this._doPlacementTurn(this, i + 1);
        }
        return;
    }

    /**
     * @internal
     * @brief Gets the number of ships the player wants to use, then
     *        starts placement operations until that many ships are 
     *        on the player's board.
     * @param {*} e 
     */
    _firstTurnHandler(e) {
        //e.preventDefault()
        this._oppShips = this._opponent._fleetSize;
        this._fleetSize = this._opponent._fleetSize;
        this._ships = Array(this._fleetSize);
        if (debug) console.log("Player " + this._num + " will place " + this._fleetSize + " ships.")
        //this._form.classList.toggle("hidden", true);
        //this._formSubmit.removeEventListener("click", submitclick, false);
        this._doPlacementTurn(this, this._shipsPlaced + 1);
    }

    /**
     * @brief Hides this player's screen (this._container)
     */
    _hide() {
        this._container.classList.toggle("hidden", true);
    }
}
 
 /**
  * @class Game
  * @brief Logical representation of the Battleship game. 
  *        Controls each player and the flow of turns.
  * @uses  Player
  */
 class Game {
 
     constructor() {
 
         /**
          * @brief Player 1
          */
         this._p1 = new Player(
             this,
             document.getElementById("p1-boards-container"),
             1
         );
 
         /**
          * @brief Player 2
          */
         this._p2 = new AI_Player(
             this,
             document.getElementById("p2-boards-container"),
             2,
             this._p1
         );
        
         this._p1._opponent = this._p2;
         //this._pl.setOpponent(this._p2);
 
         /**
          * @brief Player 1's turn count
          */
         this._p1tc = 1;
     
         /**
          * @brief Player 2's turn count
          */
         this._p2tc = 0;
 
     }
 
     /**
      * @brief Starts the game.
      */
     start() {
 
         // alert("Working!");
         this._p2._hide();
         this._p1.giveTurn("first");
     }
 
     /**
      * @brief Ends a player's turn. Called by the Player class
      * @details
      * Has logic to ensure both players get to place their ships ("first" turn)
      * and then will repeat targeting turns for each player until a player wins.
      * 
      * @pre   It was Player forPlayer's turn
      * @post  It is now the other player's turn
      * 
      * @param {Number} forPlayer 
      */
     endTurn(forPlayer) {
         if (forPlayer == 1) {
             this._p1._hide();
             this._p1tc++;
             if (this._p2tc == 0)
                 this._p2.giveTurn("first");
             else
                 this._p2.giveTurn("targeting");
         } else if (forPlayer == 2) {
             this._p2._hide();
             this._p2tc++;
             if (this._p1tc == 0)
                 this._p1.giveTurn("first");
             else
                 this._p1.giveTurn("targeting");
         }
     }
 
     /**
      * @brief Displays a victory message for the winning player.
      * @param {Number} forPlayer 
      */
     triggerWin( forPlayer )
     {
         over.play();
         openModal("A grueling battle... But Player " + forPlayer + " has come out on top!");
         // location.reload();
         // document.getElementById("modalContainer").addEventListener("")
     }
 
 }
 
 // Lets get started
 let game = new Game();
 game.start();