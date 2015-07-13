module.exports = (grunt) ->
  grunt.initConfig
    pkg: grunt.file.readJSON 'package.json'

    coffee:
      compile:
        files:
          'build/cftr.js': ['src/*.coffee', 'src/**.coffee']
        options:
          bare: true

    uglify:
      options:
        banner: '''
        /*!
          <%= pkg.name %>
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

        '''
        screwIE8: true
      build:
        src: 'build/cftr.js'
        dest: 'cftr.js'

    watch:
      scripts:
        files: ['src/**']
        tasks: 'default'

  grunt.loadNpmTasks 'grunt-contrib-coffee'
  grunt.loadNpmTasks 'grunt-contrib-uglify'
  grunt.loadNpmTasks 'grunt-contrib-watch'

  grunt.registerTask 'default', ['coffee', 'uglify']
