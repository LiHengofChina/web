/*
 * grunt-safety
 * https://github.com/tdp100/grunt-safety
 *
 * Copyright (c) 2015 tangdeping
 * Licensed under the MIT license.
 */

'use strict';

module.exports = function (grunt) {

    // Project configuration.
    grunt.initConfig({
        jshint: {
            all: [
                'Gruntfile.js',
                'tasks/*.js'
            ],
            options: {
                jshintrc: '.jshintrc'
            }
        },

        safety: {
            options: {},
            fixtures: ['build/fixtures/**/*.js']
        }
    });

    // Actually load this plugin's task(s).
    grunt.loadTasks('tasks');

    // These plugins provide necessary tasks.
    grunt.loadNpmTasks('grunt-contrib-jshint');

    // By default
    grunt.registerTask('default', ['jshint', 'safety']);
};
