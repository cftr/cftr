
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
    this.ctx.drawImage(this.game.gameMediaManager.images[image], x, y);
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
    this.gameMediaManager = new GameMediaManager(this(function() {
      return this.gameLevelManager = new GameLevelManager(this(function() {
        this.gameRenderer = new GameRenderer(this);
        this.gameKeybindingManager = new GameKeybindingManager(this);
        this.gameLevelManager.levels[this.level].initialize();
        return this.startLoop();
      }));
    }));
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
      this.gameLeveManager.levels[this.level].update();
      this.nextTick += this.skipTicks;
      this.loops++;
    }
    this.gameRenderer.render();
    if (this.gameLevelManager.levels[this.level].music) {
      this.gameMediaManager.audio[this.gameLevelManager.levels[this.level].music].play();
    }
    return requestAnimationFrame(this.animationFrame);
  };

  Game.prototype.playAudio = function(aud) {
    return this.gameMediaManager.audio[aud].play();
  };

  Game.prototype.changeLevels = function(n) {
    this.stopMusic();
    this.level = n;
    return this.gameLevelManager.levels[n].initialize();
  };

  Game.prototype.stopMusic = function() {
    var i, results;
    results = [];
    for (i in this.gameMediaManager.audio) {
      this.gameMediaManager.audio[i].pause();
      results.push(this.gameMediaManager.audio[i].currentTime = 0);
    }
    return results;
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

  Game.prototype.level = 0;

  Game.prototype.keybindings = {};

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
var GameRenderer;

GameRenderer = (function() {
  function GameRenderer(game) {
    this.game = game;
  }

  GameRenderer.prototype.render = function() {
    var curobjs, i, j, len, results;
    this.game.artist.clear();
    curobjs = this.game.gameLevelManager.levels[this.game.level].objects;
    results = [];
    for (j = 0, len = curobjs.length; j < len; j++) {
      i = curobjs[j];
      if (curobjs[i].image) {
        this.game.artist.image(curobjs[i].image, curobjs[i].x, curobjs[i].y, curobjs[i].flipImage);
      }
      if (curobjs[i].render) {
        results.push(curobjs[i].render());
      } else {
        results.push(void 0);
      }
    }
    return results;
  };

  return GameRenderer;

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
var Level;

Level = (function() {
  function Level(game, url, finished) {
    var request, that;
    this.game = game;
    that = this;
    request = new XMLHttpRequest;
    request.onload = function() {
      return that.parse(this.responseText(finished));
    };
    request.open("get", url, true);
    request.send();
  }

  Level.prototype.parse = function(json, finished) {
    this.jsondata = JSON.parse(json);
    this.name = this.jsondata.name;
    this.music = this.jsondata.music;
    return finished();
  };

  Level.prototype.initialize = function() {
    var i, k, len, ref, results, separated;
    this.objects = [];
    ref = this.jsondata.objects;
    results = [];
    for (k = 0, len = ref.length; k < len; k++) {
      i = ref[k];
      separated = this.jsondata.objects[i].split(":");
      results.push(this.objects[i] = new window[separated[0] + "Object"](separated[1], separated[2], separated[3]));
    }
    return results;
  };

  Level.prototype.update = function() {
    var collisions, i, j, k, l, len, len1, ref, ref1, results;
    ref = this.objects;
    results = [];
    for (k = 0, len = ref.length; k < len; k++) {
      i = ref[k];

      /* Surrounds the collison detection as well because collision detection
      is pointless without an object update.
       */
      if (this.objects[i].update) {
        collisions = [];
        ref1 = this.objects;
        for (l = 0, len1 = ref1.length; l < len1; l++) {
          j = ref1[l];
          if (this.checkIntersections(this.objects[i], this.objects[j])) {
            collisons.push(j);
          }
        }
        results.push(this.objects[i].update(collisions));
      } else {
        results.push(void 0);
      }
    }
    return results;
  };

  Level.prototype.checkIntersections = function(a, b) {
    return !(b.x > a.x + a.width || b.x + b.width < a.x || b.y + b.height > a.y || b.y < a.y + a.height);
  };

  return Level;

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
var Object;

Object = (function() {
  function Object(game, x, y, datavalue) {
    this.game = game;
    this.x = x != null ? x : 0;
    this.y = y != null ? y : 0;
    this.datavalue = datavalue != null ? datavalue : 0;
    this.initialize();
  }

  Object.prototype.width = 0;

  Object.prototype.height = 0;

  return Object;

})();
