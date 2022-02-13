class Ship {

	constructor( length, player )
	{
		this._cells[length] = { 0 };
		this._player = _player;
		this._length = _length;
		this._cells.forEach(element => {
			var x = 0;
			element = player + "a" + x;
			x++;
		}
	}


	_updatePos( sign, dir )
	{
		if(dir == 0) {
			switch(sign) {
				case "0" :
					this._cells.forEach(element => element[3] = alphabet(getYfromID(element) += 1));
				case "1" :
					this._cells.forEach(element => element[3] = alphabet(getYfromID(element) -= 1));
		}
		else {
			switch(sign) {
				case "0" :
					this._cells.forEach(element => element[4] += 1);
				case "1" :
					this._cells.forEach(element => element[4] -= 1);
		}
	}

	_rotate( sign )
	{
		switch(sign) {
			case "0" :
				let calculationsX[this._length];
				let calculationsY[this._length];

				var valid = new Boolean(true);			
				
				originX = getXfromID(this._cells[0]);
				originY = getYfromID(this._cells[0]);


				this._cells.forEach(element => {
					var b = 0;

					calculationsX[b] = getYfromID(element) - originY + originX;
					calculationsY[b] = -1 * (getXfromID(element) - originX) + originY;
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
						element[3] = alphabet(calculationsY[c]);
						element[4] = calculationsX[c];
						c++;
					};
				}
						
			case "1" :
				let calculationsX[this._length];
				let calculationsY[this._length];

				var valid = new Boolean(true);			
				
				originX = getXfromID(this._cells[0]);
				originY = getYfromID(this._cells[0]);


				this._cells.forEach(element => {
					var b = 0;

					calculationsX[b] = -1 * (getYfromID(element) - originY) + originX;
					calculationsY[b] = getXfromID(element) - originX + originY;
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
						element[3] = alphabet(calculationsY[c]);
						element[4] = calculationsX[c];
						c++;
					};
				}
		}
	}

}

