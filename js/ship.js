_updatePos( sign, dir )
{
	if(dir == 0) {
		switch(sign) {
			case "0" :
				this._cells.forEach(element => element._col += 1);
			case "1" :
				this._cells.forEach(element => element._col -= 1);
	}
	else {
		switch(sign) {
			case "0" :
				this._cells.forEach(element => element._row += 1);
			case "1" :
				this._cells.forEach(element => element._row -= 1);
	}
}

_rotate( sign )
{
	switch(sign) {
		case "0" :
			let calculationsX[this._length];
			let calculationsY[this._length];

			var valid = new Boolean(true);			

			this._cells.forEach(element => {
				var b = 0;
				originX = _cells[0]._col;
				originY = _cells[0]._row;

				calculationsX[b] = element._row - originY + originX;
				calculationsY[b] = -1 * (element._col - originX) + originY;
				b++;
			};

			for(int a = 0; a < this._length; a++) {
				if(calculationsX[a] < 0 || calculationsY[a] < 0 || calculationsX[a] > 9 || calculationsY[a] > 9) {
					valid = false;
					break;
				}
			}

			if(valid == true) {
				this._cells.forEach(element => {
					var c = 0;
					element._row = calculationsY[c];
					element._col = calculationsX[c];
					c++;
				};
			}
					
		case "1" :
			let calculationsX[this._length];
			let calculationsY[this._length];

			var valid = new Boolean(true);			

			this._cells.forEach(element => {
				var b = 0;
				originX = _cells[0]._col;
				originY = _cells[0]._row;

				calculationsX[b] = -1 * (element._row - originY) + originX;
				calculationsY[b] = element._col - originX + originY;
				b++;
			};

			for(int a = 0; a < this._length; a++) {
				if(calculationsX[a] < 0 || calculationsY[a] < 0 || calculationsX[a] > 9 || calculationsY[a] > 9) {
					valid = false;
					break;
				}
			}

			if(valid == true) {
				this._cells.forEach(element => {
					var c = 0;
					element._row = calculationsY[c];
					element._col = calculationsX[c];
					c++;
				};
			}
	}
}
