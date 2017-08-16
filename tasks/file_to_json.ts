import * as Grunt from 'grunt';

type TOptions = {
    removeExt: boolean;
    plainObject: boolean;
    prettify: boolean;
    parseJSON: boolean;
    separator: string;
};

type TJsonResult = {
    [path: string]: string | TJsonResult;
};

type TProcessFile = {
    target: string;
    filepath: string;
    ext: string;
};

function formatKey(filepath: string, options: TOptions): string {
    if (options.removeExt) {
        filepath = filepath.substr(0, filepath.lastIndexOf('.'))
    }

    if (options.plainObject) {
        filepath = filepath.replace(/\//g, options.separator);
    }

    return filepath;
}

function insertToObject(previous: TJsonResult, filepath: string, content: string) {
    const paths = filepath.split('/');
    let currentHandle = previous;
    while (paths.length > 1) {
        const path = paths.shift()!;
        if (!(path in currentHandle)) {
            currentHandle[path] = {};
        }
        currentHandle = currentHandle[path] as TJsonResult;
    }

    currentHandle[paths.shift()!] = content;

    return previous;
}

function formatContent(content: string, ext: string, options: TOptions): string {
    switch (ext) {
        case 'json':
            return options.parseJSON ? JSON.parse(content) : content;
    }

    return content;
}

export = function (grunt: IGrunt) {

    grunt.registerMultiTask('file_to_json', 'Embed files content to a JSON file', function () {

        const options: TOptions = this.options({
            removeExt: false,
            plainObject: true,
            prettify: false,
            parseJSON: false,
            separator: '/'            
        } as TOptions);

        this.files.forEach((file) => {
            let prefix = '';
            if ('cwd' in file) {
                // grunt.file.setBase((file as any).cwd);
                prefix = (file as any).cwd;
            }

            const srcFilesList = file.src!.map((filepath) => {
                const target = `${prefix}${filepath}`;
                if (!grunt.file.exists(target)) {
                    grunt.log.warn(`Source file ${target} not found.`);
                    return false;
                }
                if (!grunt.file.isFile(target)) {
                    grunt.log.verbose.warn(`Source ${target} is not a valid file.`);
                    return false;
                }
                return {
                    target,
                    filepath: formatKey(filepath, options),
                    ext: filepath.substr(filepath.lastIndexOf('.') + 1)
                };
            }).filter(Boolean);
            const srcFiles = srcFilesList.reduce((previous: TJsonResult, current: TProcessFile) => {

                    if (options.plainObject) {
                        previous[current.filepath] = formatContent(grunt.file.read(current.target), current.ext, options);
                    } else {
                        insertToObject(previous, current.filepath, formatContent(grunt.file.read(current.target), current.ext, options));
                    }

                    return previous;
                }, {});

            const pd = require('pretty-data').pd;
            const targetJSON = options.prettify ? pd.json(srcFiles) : pd.jsonmin(JSON.stringify(srcFiles));

            grunt.file.write(file.dest!, targetJSON);
            grunt.log.writeln(`${srcFilesList.length} file(s) embed to ${file.dest!}.`);
        });

    });

}