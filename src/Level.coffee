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
