# grunt-file-to-json
Take the content of all files and put them on a json file with filename as key.

## Why I wrote this plugin?
I need to embed the content of several files to one file for different purpose. The idea is to have some kind of bundle.

Today, this plugin exports directly in a JSON file, but with some improvement, this plugin should be able to export in different format and use some preprocessor for some file extension (minify JS/CSS for example).

## Getting Started
This plugin requires Grunt.

If you haven't used [Grunt](http://gruntjs.com/) before, be sure to check out this [Getting Started](http://gruntjs.com/getting-started) guide, as it explains how to create a [Gruntfile](http://gruntjs.com/sample-gruntfile) as well as install and use Grunt plugins. Once you're familiar with that process, you may install this plugin with this command:

```shell
npm install github://MasGaNo/grunt-file-to-json --save-dev
```

One the plugin has been installed, it may be enabled inside your Gruntfile with this line of JavaScript:

```js
grunt.loadNpmTasks('grunt-file-to-json');
```

## The task

### Overview
In your project's Gruntfile, add a section named `file_to_json` to the data object passed into `grunt.initConfig()`.

```js
grunt.initConfig({
  file_to_json: {
    options: {
        // removeExt: boolean | default: false
        // prettify: boolean | default: false
        // plainObject: boolean | default: true
        // separator: string | default: /
        // parseJSON: boolean | default: false
    },
    your_target: {
      /** contents like this:
        files: [
            {
                cwd: 
                src: ['*'],
                dest: 'saveThe/result.json'
            }
        ]
      */
    },
  },
})
```

### Options

#### options.removeExt
Type: `Boolean`
Default value: `false`

Remove the extension from the name of the key.

#### options.prettify
Type: `Boolean`
Default value: `false`

Determine if the JSON output should be prettify or not.

#### options.plainObject
Type: `Boolean`
Default value: `true`

If `true`, put all files in the root of the JSON and the name of the key include the subfolder.
If `false`, the object hierarchy follow the folder hierarchy.

#### options.separator
Type: `String`
Default value: `/`

Separator for subfolder.

*Note:*

*This option works only if `options.plainObject` is set to `true`*.

#### options.parseJSON
Type: `Boolean`
Default value: `false`

Convert JSON file to JSON object. If `false`, the application will get the JSON content as a text plain.

## Release History
1. First release.