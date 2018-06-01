/* global module:true */

module.exports = function(grunt) {
    'use strict';

    // Change any strings in the content that match ${some string here} to the value specified in replacements.json
    var resolveFileContent = function resolveFileContent(content) {
        // The file which has replacements in JSON format
        var replacementFilePath = 'replacements.json',
            resolvedContent = content,
            // The build version
            buildVersion = grunt.file.readJSON('package.json').version,
            // The build date
            buildDate = new Date(),
            buildUser = (function() {
                if ('win32' === process.platform) {
                    return process.env.USERNAME;
                } else if ('linux' === process.platform) {
                    return process.env.USER;
                } else {
                    return 'unknown';
                }
            }()),
            // The replacements read in from the file
            replacements = (function() {
                // If the file is not present, _replacements will be null
                if (grunt.file.exists(replacementFilePath) && grunt.file.isFile(replacementFilePath)) {
                    return grunt.file.readJSON(replacementFilePath);
                }
            }());

        // The default resolvers (build user, version and date)
        resolvedContent = resolvedContent.replace(new RegExp('\\${build.user}', 'gi'), buildUser);
        resolvedContent = resolvedContent.replace(new RegExp('\\${build.version}', 'gi'), buildVersion);
        resolvedContent = resolvedContent.replace(new RegExp('\\${build.date}', 'gi'), buildDate);

        // If the replacements file exists, use the key/value pairs from there
        if (replacements) {
            for (var key in replacements) {
                resolvedContent = resolvedContent.replace(new RegExp('\\${' + key + '}', 'gi'), replacements[key]);
            }
        }

        // Return the resolved content
        return resolvedContent;
    };

    grunt.initConfig({
        uglify: {
            options: {
                sourceMap: true
            },
            dist: {
                files: {
                    'dist/ChromeExtensionSettingsManager.min.js': ['dist/ChromeExtensionSettingsManager.js']
                }
            }
        },
        jshint: {
            options: {
                jshintrc: '.jshintrc',
                reporterOutput: ''
            },
            source: {
                files: {
                    src: ['src/ChromeExtensionSettingsManager.js']
                }
            },
            // Only lint the unmin file
            dist: {
                files: {
                    src: ['dist/ChromeExtensionSettingsManager.js']
                }
            }
        },
        copy: {
            options: {
                process: resolveFileContent
            },
            dist: {
                files: [
                    {
                        expand: true,
                        cwd: 'src/',
                        src: ['**/*.js'],
                        dest: 'dist/',
                        filter: 'isFile'
                    }
                ]
            }
        }

    });


    // Load NPM tasks
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-contrib-uglify');


    // Register tasks
    grunt.registerTask('dist', ['jshint:source', 'copy:dist', 'uglify:dist', 'jshint:dist']);


    // Default task
    grunt.registerTask('default', 'dist');
};
