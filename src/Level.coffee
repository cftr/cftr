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
# Level class: Stores a game level.
class Level

  constructor: (@game, url, finished) ->
    # Keep a reference to 'this'.
    that = @
    request = new XMLHttpRequest
    request.onload = ->
      that.parse @responseText finished

    request.open "get", url, true
    request.send()

  parse: (json, finished) ->
    @jsondata = JSON.parse json
    @name = @jsondata.name
    @music = @jsondata.music
    finished()

  initialize: ->
    @objects = []
    for i in @jsondata.objects
      separated = @jsondata.objects[i].split(":")
      @objects[i] =
        new window[separated[0] +
          # Args:   X coordinate  Y coordinate  Special Data Value
          "Object"](separated[1], separated[2], separated[3])

  update: ->
    for i in @objects
      ### Surrounds the collison detection as well because collision detection
      is pointless without an object update. ###
      if @objects[i].update
        # TODO: Optimize this collision loop.
        collisions = []
        for j in @objects
          if @checkIntersections @objects[i], @objects[j]
            collisons.push j
        @objects[i].update collisions

  checkIntersections: (a, b) ->
    return not (b.x > a.x + a.width or
           b.x + b.width < a.x or
           b.y + b.height > a.y or
           b.y < a.y + a.height)
