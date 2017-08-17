"use strict";
var pluginMaps = {
    htmlminifier: 'htmlminifier'
};
var pluginCache = {};
var extForPlugins = {};
function formatKey(filepath, options) {
    if (options.removeExt) {
        filepath = filepath.substr(0, filepath.lastIndexOf('.'));
    }
    if (options.plainObject) {
        filepath = filepath.replace(/\//g, options.separator);
    }
    return filepath;
}
function insertToObject(previous, filepath, content) {
    var paths = filepath.split('/');
    var currentHandle = previous;
    while (paths.length > 1) {
        var path = paths.shift();
        if (!(path in currentHandle)) {
            currentHandle[path] = {};
        }
        currentHandle = currentHandle[path];
    }
    currentHandle[paths.shift()] = content;
    return previous;
}
function formatContent(content, ext, options, grunt, target) {
    switch (ext) {
        case 'json':
            return options.parseJSON ? JSON.parse(content) : content;
    }
    if (ext in extForPlugins) {
        content = extForPlugins[ext].reduce(function (content, pluginName) {
            grunt.log.verbose.writeln("Apply plugin " + pluginName + " for " + target + ".");
            return pluginCache[pluginName](content, options.plugins[pluginName].options);
        }, content);
    }
    return content;
}
function checkPlugin(options, grunt) {
    if (!('plugins' in options)) {
        return;
    }
    Object.keys(options.plugins).map(function (plugin) {
        if (!(plugin in pluginMaps)) {
            return grunt.log.error("Plugin " + plugin + " was not found.");
        }
        var pluginConf = options.plugins[plugin];
        pluginCache[plugin] = require("./plugins/" + pluginMaps[plugin]);
        pluginConf.ext.map(function (ext) {
            if (!(ext in extForPlugins)) {
                extForPlugins[ext] = [];
            }
            extForPlugins[ext].push(plugin);
        });
        grunt.log.verbose.writeln("Added plugin " + plugin + " for " + pluginConf.ext.join(', ') + " file(s).");
    });
}
module.exports = function (grunt) {
    grunt.registerMultiTask('file_to_json', 'Embed files content to a JSON file', function () {
        var options = this.options({
            removeExt: false,
            plainObject: true,
            prettify: false,
            parseJSON: false,
            separator: '/'
        });
        checkPlugin(options, grunt);
        this.files.forEach(function (file) {
            var prefix = '';
            if ('cwd' in file) {
                // grunt.file.setBase((file as any).cwd);
                prefix = file.cwd;
            }
            var srcFilesList = file.src.map(function (filepath) {
                var target = "" + prefix + filepath;
                if (!grunt.file.exists(target)) {
                    grunt.log.warn("Source file " + target + " not found.");
                    return false;
                }
                if (!grunt.file.isFile(target)) {
                    grunt.log.verbose.warn("Source " + target + " is not a valid file.");
                    return false;
                }
                return {
                    target: target,
                    filepath: formatKey(filepath, options),
                    ext: filepath.substr(filepath.lastIndexOf('.') + 1)
                };
            }).filter(Boolean);
            var srcFiles = srcFilesList.reduce(function (previous, current) {
                if (options.plainObject) {
                    previous[current.filepath] = formatContent(grunt.file.read(current.target), current.ext, options, grunt, current.target);
                }
                else {
                    insertToObject(previous, current.filepath, formatContent(grunt.file.read(current.target), current.ext, options, grunt, current.target));
                }
                return previous;
            }, {});
            var pd = require('pretty-data').pd;
            var targetJSON = options.prettify ? pd.json(srcFiles) : pd.jsonmin(JSON.stringify(srcFiles));
            grunt.file.write(file.dest, targetJSON);
            grunt.log.writeln(srcFilesList.length + " file(s) embed to " + file.dest + ".");
        });
    });
};
