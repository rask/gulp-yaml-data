/**
 * gulp-yaml-data index.js
 *
 * @author Otto Rask <ojrask@gmail.com>
 */

var through = require('through2');
var PluginError = require('gulp-util/lib/PluginError');
var yaml = require('js-yaml');
var fs = require('fs');

module.exports = function (options)
{
    'use strict';

    // Defaults.
    options = Object.assign({
        property: 'data',
        override: false
    }, options);

    // Enforce src option. Either string or array is allowed.
    if (
        typeof options.src !== 'string' &&
        typeof options.src !== 'object' &&
        typeof options.src.isArray !== 'function'
    ) {
        throw new PluginError(
            'gulp-yaml-data',
            new TypeError('Invalid or missing sourceFile option given for gulp-yaml-data')
        );
    }

    // Read a YAML file to an object and return it.
    var readYamlFile = function (file) {
        return yaml.safeLoad(fs.readFileSync(file, 'utf8'));
    };

    // Transform current stream to include a YAML data file.
    var transformStream = function (file, enc, cb) {
        var yaml_files = options.src;

        if (typeof yaml_files === 'string') {
            yaml_files = [yaml_files];
        }

        var yaml_data = {};

        // Read all files in order, and override if later files contain same values.
        for (var i = 0; i < yaml_files.length; i++) {
            yaml_data = Object.assign(yaml_data, readYamlFile(yaml_files[i]));
        }

        var current_data = file[options.property];
        var new_data = null;

        // Merge with possible previous data.
        if (options.override) {
            new_data = Object.assign(current_data, yaml_data);
        } else {
            new_data = Object.assign(yaml_data, current_data);
        }

        file[options.property] = new_data;

        cb(null, file);
    };

    return through.obj(transformStream);
};
