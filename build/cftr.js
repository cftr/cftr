
/*
  The Calefactor Engine
  Copyright (C) 2015 Calefactor Contributors

  This file is part of The Calefactor Engine.

  The Calefactor Engine is free software: you can redistribute it and/or modify
  it under the terms of the GNU General Public License as published by
  the Free Software Foundation, either version 3 of the License, or
  (at your option) any later version.

  The Calefactor Engine is distributed in the hope that it will be useful,
  but WITHOUT ANY WARRANTY; without even the implied warranty of
  MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
  GNU General Public License for more details.

  You should have received a copy of the GNU General Public License
  along with The Calefactor Engine.  If not, see <http://www.gnu.org/licenses/>.
 */
var Artist;

Artist = (function() {
  function Artist(canvas, ctx) {
    this.canvas = canvas;
    this.ctx = ctx;
  }

  Artist.prototype.clear = function() {
    return this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
  };

  Artist.prototype.image = function(image, x, y, flip) {
    if (flip) {
      this.ctx.save();
      this.ctx.scale(-1, 0);
    }
    this.ctx.drawImage(image, x, y);
    if (flip) {
      return this.ctx.restore();
    }
  };

  return Artist;

})();


/*
  The Calefactor Engine
  Copyright (C) 2015 Calefactor Contributors

  This file is part of The Calefactor Engine.

  The Calefactor Engine is free software: you can redistribute it and/or modify
  it under the terms of the GNU General Public License as published by
  the Free Software Foundation, either version 3 of the License, or
  (at your option) any later version.

  The Calefactor Engine is distributed in the hope that it will be useful,
  but WITHOUT ANY WARRANTY; without even the implied warranty of
  MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
  GNU General Public License for more details.

  You should have received a copy of the GNU General Public License
  along with The Calefactor Engine.  If not, see <http://www.gnu.org/licenses/>.
 */
var Game;

Game = (function() {
  function Game(options) {
    var i;
    for (i in options) {
      this[i] = options[i];
    }
    if (this.canvasSelector) {
      this.canvas = document.querySelector(this.canvasSelector);
    }
    if (this.canvas) {
      this.initCanvas();
    } else {
      throw new GameInitializationError("The canvas was not created.");
    }
    this.gameMediaManager = new GameMediaManager(this);
    this.gameLevelManager = new GameLevelManager(this);
    this.gameRenderer = new GameRenderer(this);
    this.gameObjectManager = new GameObjectManager(this);
    this.startLoop();
  }

  Game.prototype.initCanvas = function() {
    this.canvas.width = this.width;
    this.canvas.height = this.height;
    this.graphicsContext = this.canvas.getContext("2d");
    this.grapgicsContext.transform(-1, 0, 0, 1, this.canvas.height, 0);
    return this.artist = new Artist(this.canvas, this.grapicsContext);
  };

  Game.prototype.startLoop = function() {
    this.loops = 0;
    this.skipTicks = 1000 / this.fps;
    this.maxSkip = 10;
    this.nextTick = new Date().getTime();
    return requestAnimationFrame(this.animationFrame);
  };

  Game.prototype.animationFrame = function() {
    this.loops = 0;
    while (new Date().getTime() > this.nextTick && this.loops < this.maxSkip) {
      this.gameObjectManager.update();
      this.nextTick += this.skipTicks;
      this.loops++;
    }
    this.gameRenderer.render();
    return requestAnimationFrame(this.animationFrame);
  };

  Game.prototype.name = "The game";

  Game.prototype.canvas = null;

  Game.prototype.canvasSelector = null;

  Game.prototype.graphicsContext = null;

  Game.prototype.width = 500;

  Game.prototype.height = 500;

  Game.prototype.fps = 60;

  Game.prototype.audioNeeded = [];

  Game.prototype.imagesNeeded = [];

  Game.prototype.levelsNeeded = [];

  return Game;

})();


/*
  The Calefactor Engine
  Copyright (C) 2015 Calefactor Contributors

  This file is part of The Calefactor Engine.

  The Calefactor Engine is free software: you can redistribute it and/or modify
  it under the terms of the GNU General Public License as published by
  the Free Software Foundation, either version 3 of the License, or
  (at your option) any later version.

  The Calefactor Engine is distributed in the hope that it will be useful,
  but WITHOUT ANY WARRANTY; without even the implied warranty of
  MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
  GNU General Public License for more details.

  You should have received a copy of the GNU General Public License
  along with The Calefactor Engine.  If not, see <http://www.gnu.org/licenses/>.
 */
var GameError, GameInitializationError,
  extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  hasProp = {}.hasOwnProperty;

GameError = (function(superClass) {
  extend(GameError, superClass);

  function GameError(message) {
    this.message = message;
  }

  GameError.prototype.message = "There was an error.";

  GameError.prototype.name = "GameError";

  return GameError;

})(Error);

GameInitializationError = (function(superClass) {
  extend(GameInitializationError, superClass);

  function GameInitializationError() {
    return GameInitializationError.__super__.constructor.apply(this, arguments);
  }

  GameInitializationError.prototype.name = "GameInitializationError";

  return GameInitializationError;

})(GameError);
