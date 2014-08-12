'use strict';
var path = require('path');

var LIVERELOAD_PORT = 35729;
module.exports = function(grunt) {


    // 从node_modules目录加载模块文件
    // grunt.loadNpmTasks('grunt-contrib-jshint');
    // 这里用load-grunt-tasks加载模块了
    require('load-grunt-tasks')(grunt);
    var app = {
        dev: 'public/',
        dist: 'dist'
    };


    // 配置Grunt各种模块的参数
    grunt.initConfig({
        app: app,
        neuter: {
            app: {
                options: {
                    filepathTransform: function(filepath) {
                        return app.dev + filepath;
                    }
                },
                src: '<%= app.dev %>/neuter.js',
                dest: '<%= app.dev %>/app.all.js'
            }
        },
        watch: {
           neuter: {
            files: ['<%= app.dev %>/app/**'],
            tasks: ['neuter']
        },
        livereload: {
            options: {
                livereload: LIVERELOAD_PORT
            },
            files: [
            '<%= app.dev %>/**/*.css',
            '<%= app.dev %>/app.all.js',
            '<%= app.dev %>/views/**/*'
            ]
        },
    },
})

    grunt.registerTask('dev', ['watch']);

};