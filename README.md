# gulp-yaml-data

This Gulp plugin can be used to import metadata from YAML files into
a stream. This allows templates to read data from a wanted property in
the streamed file.

## Installation

    $ npm install --save-dev gulp-yaml-data
    
## Usage

This example shows how to convert Markdown to HTML, and use `gulp-wrap`
to generate a lodash template from the converted Markdown.

`markdown/index.md`

```markdown
# Index page

Hello world.
```

`config.yaml`

```yaml
site_title: Foo Bar
```

`gulpfile.js`

```js
var gulp = require('gulp');
var yamlData = require('gulp-yaml-data');
var md2html = require('gulp-markdown');
var wrap = require('gulp-wrap');

gulp.task('markdown', function ()
{
    // Read all template files which should be infused with
    return gulp.src('markdown/*.html')
    
        // Read data from config.yaml and set to a property named `data`
        .pipe(yamlData({
            property: 'data'
            src: 'config.yaml'
        })
        
        // Convert Markdown to HTML
        .pipe(md2html())
        
        // Wrap generated HTML to a HTML lodash template
        .pipe(wrap({
            src: 'templates/template.html'
        }))
        
        // Output to directory `website`
        .pipe(gulp.dest('website');
});
```

The template file referenced in `gulp-wrap` (`templates/template.html`)
could look a little something like this:

```html
<!DOCTYPE html>

<html>

    <head>
        <meta charset="utf-8">
        <title><%= site_title %></title>
    </head>
    
    <body>
        <%= contents %>
    </body>

</html>
```

When you run `gulp markdown` the following file should appear inside
`public/index.html`:

```html
<!DOCTYPE html>

<html>

    <head>
        <meta charset="utf-8">
        <title>Foo Bar</title>
    </head>
    
    <body>
        <h1>Index page</h1>
        
        <p>Hello world.</p>
    </body>

</html>
```

## Options

Pass in options as a JS object like so:

```js
var options = {
    property: 'data',
    src: 'file.yaml',
    override: false    
};

...
.pipe(yamlData(options)
...
```

### options.property

`property` marks the property to which to append the YAML data in the
file stream. See your templating module of choice for the data property
name to use.

Default: `'data'`

### options.src

`src` contains either a filename string on an array of filename strings.

Single file:

    src: 'config.yaml'

Multiple files:

    src: [
        'config.yaml',
        'config.local.yaml'
    ]

Files are read in order, and files that are listed later will overwrite
values which are already present in earlier files.

Default: not defined, you need to explicitly define this in your
gulpfile.

### options.override

In case the file stream already has data tied to `options.property`,
this option value determines whether the `gulp-yaml-data` data overrides
the data set in those. 

Default: `false`

## License

See LICENSE.md.
