/*!
 * http://timpietrusky.com
 * @author Tim Pietrusky
 */

'use strict';

/**
 * Grunt module
 */
module.exports = function (grunt) {

  /**
   * Dynamically load npm tasks
   */
  require('matchdep').filterDev('grunt-*').forEach(grunt.loadNpmTasks);

  /**
   * FireShell Grunt config
   */
  grunt.initConfig({

    pkg: grunt.file.readJSON('package.json'),





    /**
     * Set project info
     */
    project: {
      src: 'src',
      app: 'app',
      index: 'app.html',
      css: [
        '<%= project.src %>/scss/style.scss'
      ],
      js: [
        '<%= project.src %>/js/vendor/webfont.min.1.4.7.js',
        '<%= project.src %>/js/vendor/angular/angular.min.js',
        '<%= project.src %>/js/core/controllers.js',
        '<%= project.src %>/js/scripts.js'
      ],
      js_hint: [
        '<%= project.src %>/js/core/controllers.js',
        '<%= project.src %>/js/scripts.js'
      ]
    },





    /**
     * Project banner
     * Dynamically appended to CSS/JS files
     * Inherits text from package.json
     */
    tag: {
      banner: '/*!\n' +
              ' * <%= pkg.name %>\n' +
              ' * <%= pkg.title %>\n' +
              ' * <%= pkg.url %>\n' +
              ' * @author <%= pkg.author %>\n' +
              ' * @version <%= pkg.version %>\n' +
              ' * Copyright <%= pkg.copyright %>. <%= pkg.license %> licensed.\n' +
              ' */\n'
    },





    /**
     * Runs tasks against changed watched files
     * https://github.com/gruntjs/grunt-contrib-watch
     * Watching development files and run concat/compile tasks
     * Livereload the browser once complete
     */
    watch: {
      js: {
        files: '<%= project.src %>/js/{,*/}*.js',
        tasks: ['concat:dev', 'jshint']
      },

      html: {
        files: [
          '<%= project.src %>/{,*/}*.html',
        ],
        tasks: ['copy']
      }
    },





    /**
     * JSHint
     * https://github.com/gruntjs/grunt-contrib-jshint
     * Manage the options inside .jshintrc file
     */
    jshint: {
      files: '<%= project.js_hint %>',
      options: {
        jshintrc: '.jshintrc'
      }
    },





    /**
     * Concatenate JavaScript files
     * https://github.com/gruntjs/grunt-contrib-concat
     * Imports all .js files and appends project banner
     */
    concat: {
      options: {
        stripBanners: true,
        nonull: true,
        banner: '<%= tag.banner %>'
      },
      dev: {
        files: {
          '<%= project.app %>/js/scripts.min.js': '<%= project.js %>'
        }
      }
    },





    /**
     * Uglify (minify) JavaScript files
     * https://github.com/gruntjs/grunt-contrib-uglify
     * Compresses and minifies all JavaScript files into one
     */
    uglify: {
      options: {
        banner: "<%= tag.banner %>"
      },
      dist: {
        files: {
          '<%= project.app %>/js/scripts.min.js': '<%= project.js %>'
        }
      }
    },





    /**
     * Compile Sass/SCSS files
     * https://github.com/gruntjs/grunt-contrib-sass
     * Compiles all Sass/SCSS files and appends project banner
     */
    compass: {
      dev: {
        options: {
          sassDir: '<%= project.src %>/scss',
          cssDir: '<%= project.app %>/css',
          watch: true,
          outputStyle: 'expanded',
          environment: 'development'
        }
      },
      dist: {
        options: {
          sassDir: '<%= project.src %>/scss',
          cssDir: '<%= project.app %>/css',
          outputStyle: 'compressed',
          environment: 'production'
        }
      }
    },





    /* 
     * We use "compass watch" and "watch" at the same time
     */
    concurrent: {
        target1: ['compass:dev', 'watch']
    },





    /*
     * Copy folder/files from src to dest
     * 
     * https://github.com/gruntjs/grunt-contrib-copy
     */
    copy: {
      main: {
        expand: true,
        flatten: true,
        filter: 'isFile',
        cwd: '<%= project.src %>',
        src: '<%= project.index %>', 
        dest: '<%= project.app %>/'
      }
    }





  });





  /**
   * Default task
   * Run `grunt` on the command line
   */
  grunt.registerTask('default', [
    'copy',
    'concat:dev',
    'jshint',
    'concurrent:target1'
  ]);





  /**
   * Build task
   * Run `grunt build` on the command line
   * Then compress all JS/CSS files
   */
  grunt.registerTask('build', [
    'compass:dist',
    'jshint',
    'uglify',
    'copy'
  ]);
};