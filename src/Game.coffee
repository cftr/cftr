###
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
###
# Game class: Stores game information and handles the game.
class Game

  constructor: (options) ->

    # Copy the options over to this object.
    for i of options
      this[i] = options[i]

    # Automatically select the canvas if specified.
    if @canvasSelector
      @canvas = document.querySelector @canvasSelector

    # Try to initialize the canvas. If it doesn't exist, throw an error.
    if @canvas
      @initCanvas()
    else
      throw new GameInitializationError "The canvas was not created."

    # Game media and level managers.
    @gameMediaManager = new GameMediaManager this ->
      @gameLevelManager = new GameLevelManager this ->

        # Game renderer.
        @gameRenderer = new GameRenderer this

        # Keybindings managers
        @gameKeybindingManager = new GameKeybindingManager this

        # Start the level.
        @gameLevelManager.levels[@level].initialize()

        # Start the loop.
        @startLoop()

  # initCanvas: Initialize the canvas and the 2-D context.
  initCanvas: ->
    # Set the proper canvas width and height.
    @canvas.width = @width
    @canvas.height = @height
    # Get the graphics context.
    @graphicsContext = @canvas.getContext "2d"
    # Change the canvas origin to bottom-left.
    @graphicsContext.transform -1, 0, 0, 1, @canvas.height, 0
    # Create the artist (methods for drawing to canvas.)
    @artist = new Artist @canvas, @grapicsContext

  # startLoop: Start the game loop.
  startLoop: ->
    # Set the information needed for the game loop.
    @loops = 0 # The amount of loops done.
    @skipTicks = 1000 / @fps # The game FPS converted into ms skip.
    @maxSkip = 10 # Maximum amount of frames skippable.
    @nextTick = new Date().getTime() # Scheduled time of next tick
    requestAnimationFrame @animationFrame

  # animationFrame: One frame of the game loop.
  animationFrame: ->
    # Reset the loops amount.
    @loops = 0

    # Loop until a redraw is needed.
    while new Date().getTime() > @nextTick and @loops < @maxSkip
      # Update the game.
      @gameLeveManager.levels[@level].update()

      # Get ready for the next loop.
      @nextTick += @skipTicks
      @loops++

    # Draw the game.
    @gameRenderer.render()

    # Play Current Music
    if @gameLevelManager.levels[@level].music
      @gameMediaManager.audio[@gameLevelManager.levels[@level].music].play()

    # Request the next frame.
    requestAnimationFrame @animationFrame

  playAudio: (aud) ->
    @gameMediaManager.audio[aud].play()

  changeLevels: (n) ->
    @stopMusic()
    @level = n
    @gameLevelManager.levels[n].initialize()

  stopMusic: ->
    # Loop through all audio.
    for i of @gameMediaManager.audio
      # Stop this audio.
      @gameMediaManager.audio[i].pause()
      @gameMediaManager.audio[i].currentTime = 0

  # Game properties with defaults.
  name: "The game" # Name of the game.
  canvas: null # Canvas object.
  canvasSelector: null # Selector of the canvas element.
  graphicsContext: null # The canvas's graphics context.
  width: 500 # The width of the canvas.
  height: 500 # The height of the canvas.
  fps: 60 # The FPS rate of the game.
  audioNeeded: [] # Needed audio.
  imagesNeeded: [] # Needed images.
  levelsNeeded: [] # Needed levels.
  level: 0 # Current level.
  keybindings: {}
