'use strict';

module.exports = function (grunt) {
    grunt.initConfig({
        file_to_json: {
            default: {
                options: {
                    removeExt: false,
                    prettify: true,
                    plainObject: true,
                    separator: '_',
                    parseJSON: false,
                    plugins: {
                        htmlminifier: {
                            ext: ['html', 'ejs'],
                            options: {
                                collapseWhitespace: true,
                                minifyCSS: true,
                                minifyJS: true,
                                removeComments: true
                            }
                        }
                    }
                },
                files: [
                    {
                        cwd: 'test/fixtures/',
                        src: ['**/*', '*'],
                        dest: 'test/export.json'
                    }
                ]
            }
        }
    });

    grunt.loadTasks('tasks');

    grunt.registerTask('default', ['file_to_json']);

}
