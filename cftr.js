/*!
  Calefactor
  Copyright (C) 2015 Calefactor Contributors

  This program is free software: you can redistribute it and/or modify
  it under the terms of the GNU General Public License as published by
  the Free Software Foundation, either version 3 of the License, or
  (at your option) any later version.

  This program is distributed in the hope that it will be useful,
  but WITHOUT ANY WARRANTY; without even the implied warranty of
  MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
  GNU General Public License for more details.

  You should have received a copy of the GNU General Public License
  along with this program.  If not, see <http://www.gnu.org/licenses/>.
*/
var Artist;Artist=function(){function a(a,b){this.canvas=a,this.ctx=b}return a.prototype.clear=function(){return this.ctx.clearRect(0,0,this.canvas.width,this.canvas.height)},a.prototype.image=function(a,b,c,d){return d&&(this.ctx.save(),this.ctx.scale(-1,0)),this.ctx.drawImage(a,b,c),d?this.ctx.restore():void 0},a}();var Game;Game=function(){function a(a){var b;for(b in a)this[b]=a[b];if(this.canvasSelector&&(this.canvas=document.querySelector(this.canvasSelector)),!this.canvas)throw new GameInitializationError("The canvas was not created.");this.initCanvas(),this.gameMediaManager=new GameMediaManager(this),this.gameLevelManager=new GameLevelManager(this),this.gameRenderer=new GameRenderer(this),this.gameObjectManager=new GameObjectManager(this),this.startLoop()}return a.prototype.initCanvas=function(){return this.canvas.width=this.width,this.canvas.height=this.height,this.graphicsContext=this.canvas.getContext("2d"),this.grapgicsContext.transform(-1,0,0,1,this.canvas.height,0),this.artist=new Artist(this.canvas,this.grapicsContext)},a.prototype.startLoop=function(){return this.loops=0,this.skipTicks=1e3/this.fps,this.maxSkip=10,this.nextTick=(new Date).getTime(),requestAnimationFrame(this.animationFrame)},a.prototype.animationFrame=function(){for(this.loops=0;(new Date).getTime()>this.nextTick&&this.loops<this.maxSkip;)this.gameObjectManager.update(),this.nextTick+=this.skipTicks,this.loops++;return this.gameRenderer.render(),requestAnimationFrame(this.animationFrame)},a.prototype.name="The game",a.prototype.canvas=null,a.prototype.canvasSelector=null,a.prototype.graphicsContext=null,a.prototype.width=500,a.prototype.height=500,a.prototype.fps=60,a.prototype.audioNeeded=[],a.prototype.imagesNeeded=[],a.prototype.levelsNeeded=[],a}();var GameError,GameInitializationError,extend=function(a,b){function c(){this.constructor=a}for(var d in b)hasProp.call(b,d)&&(a[d]=b[d]);return c.prototype=b.prototype,a.prototype=new c,a.__super__=b.prototype,a},hasProp={}.hasOwnProperty;GameError=function(a){function b(a){this.message=a}return extend(b,a),b.prototype.message="There was an error.",b.prototype.name="GameError",b}(Error),GameInitializationError=function(a){function b(){return b.__super__.constructor.apply(this,arguments)}return extend(b,a),b.prototype.name="GameInitializationError",b}(GameError);