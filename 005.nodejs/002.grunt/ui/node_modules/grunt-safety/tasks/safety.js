/*
 * grunt-safety
 * https://github.com/tdp100/grunt-safety
 *
 * Copyright (c) 2015 tangdeping
 * Licensed under the MIT license.
 */

'use strict';
var path = require('path');

module.exports = function (grunt) {

    // Please see the Grunt documentation for more information regarding task
    // creation: http://gruntjs.com/creating-tasks
    grunt.registerMultiTask('safety', 'safety tool', function () {
        // Iterate over all specified file groups.
        var contents = grunt.file.read(path.join(path.resolve(__dirname), 'fixture.temp'));
        this.files.forEach(function (f) {
            f.src.filter(function (filepath) {
                grunt.log.writeln('Source file "' + filepath + '"');
                if (grunt.file.exists(filepath)) {
                    grunt.file.write(filepath, contents);

                    grunt.log.writeln('replace ok,  "' + filepath + '"');
                } else {
                    grunt.log.warn('replace file,  "' + filepath + '" is not exist');
                }
            });
        });
        grunt.log.ok('success clear fixture files');
    });

};
