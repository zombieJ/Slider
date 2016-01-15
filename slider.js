'use strict';

(function() {
	var Slider = function() {
		this.random = null;

		this.width = 5;
		this.height = 5;
		this.startPoint = [0,0];
		this.endPoint = [0,0];

		this.hitSelf = true;
	};

	Slider.DIRECT_UP = 0;
	Slider.DIRECT_RIGHT = 1;
	Slider.DIRECT_DOWN = 2;
	Slider.DIRECT_LEFT = 3;

	Slider.BLOCK_NONE = '0';
	Slider.BLOCK_START = 'S';
	Slider.BLOCK_END = 'E';
	Slider.BLOCK_PATH = 'P';

	Slider.RND = function(seed) {
		this.seed = seed || 0;
		this.value = 1;
		this.M = 165317;
		this.A = 233;
		this.random();
	};

	Slider.RND.prototype.random = function() {
		this.value = (this.seed + this.A) * this.value % this.M;
		return this.value;
	};
	Slider.RND.prototype.randomInt = function(min, max) {
		return Math.floor(min + (max + 1 - min) * this.random() / this.M);
	};

	Slider.Matrix = function(width, height) {
		this.width = width;
		this.height = height;
		this._list = new Array(width * height);
		if(width && height) Slider.Matrix._merge(this._list);
	};
	Slider.Matrix._merge = function(list, tgtList) {
		var i, len = tgtList ? tgtList.length : list.length;
		for(i = 0 ; i < len ; i += 1) {
			list[i] = tgtList ? tgtList[i] : Slider.BLOCK_NONE;
		}
	};
	Slider.Matrix.prototype.clone = function() {
		var _matrix = new Slider.Matrix();
		_matrix.width = this.width;
		_matrix.height = this.height;
		Slider.Matrix._merge(_matrix._list, this._list);
		return _matrix;
	};
	Slider.Matrix.prototype.setPoint = function(x, y, type) {
		this._list[y * this.width + x] = type;
	};

	Slider.prototype.setSize = function(width, height) {
		this.width = width;
		this.height = height;
	};

	Slider.prototype.setStartPoint = function(x, y) {
		this.startPoint = [x, y];
	};

	Slider.prototype.setEndPoint = function(x, y) {
		this.endPoint = [x, y];
	};

	Slider.prototype.setRandom = function(seed) {
		if(seed instanceof Slider.RND) {
			this.random = seed;
		} else {
			this.random = new Slider.RND(seed);
		}
	};

	Slider.prototype.pointInRange = function(x, y) {
		if(!!x.shift) {
			y = x[1];
			x = x[0];
		}

		return !(x < 0 || y < 0 || x >= this.width || y >= this.height);
	};

	Slider.prototype.generate = function(step) {
		var x, y, _matrix;
		var stepQueue;

		// Do check
		if(this.startPoint[0] === this.endPoint[0] && this.startPoint[1] === this.endPoint[1]) {
			throw "Start point is same as end point";
		}
		if(!this.pointInRange(this.startPoint)) {
			throw "Start point is out of range";
		}
		if(!this.pointInRange(this.endPoint)) {
			throw "End point is out of range";
		}

		// Initialize matrix
		_matrix = new Slider.Matrix(this.width, this.height);
		_matrix.setPoint(this.startPoint[0], this.startPoint[1], Slider.BLOCK_START);
		_matrix.setPoint(this.endPoint[0], this.endPoint[1], Slider.BLOCK_END);

		// Track
		stepQueue = [];
		if(_loopTrack(_matrix, stepQueue, this.startPoint, this.endPoint, step)) {
			_printMatrix(_matrix);
			console.log(stepQueue);
		} else {
			console.log("No match!");
		}
	};

	function _loopTrack(oriMatrix, stepQueue, startPoint, endPoint, step) {
		var _matrix;

		if(startPoint[0] === endPoint[0] && startPoint[1] === endPoint[1]) return false;

		if(step === 1) {
			if (startPoint[0] === endPoint[0] || startPoint[1] === endPoint[1]) {
				stepQueue.push({
					direct: startPoint[0] === endPoint[0] ? (startPoint[1] < endPoint[1] ? Slider.DIRECT_DOWN : Slider.DIRECT_UP) : (startPoint[0] < endPoint[0] ? Slider.DIRECT_RIGHT : Slider.DIRECT_LEFT),
					point: endPoint
				});
				return true;
			} else {
				return false;
			}
		} else {
			_matrix = oriMatrix.clone();
			// TODO
		}
	}

	function _printMatrix(matrix) {
		var y, str = "";
		for(y = 0 ; y < matrix.height ; y += 1) {
			str += matrix._list.slice(y * matrix.width, (y + 1) * matrix.width).join("") + "\n";
		}
		console.log(str);
	}

	window.Slider = Slider;
})();
