module.exports = {
    build: {
        options: {
            singleModule: true,
            module: '<%= pkg.name %>-templates',
            rename: function (moduleName) {
                return moduleName.replace('.html', '');
            }
        },
        src: ['src/templates/*.html'],
        dest: 'tmp/templates.js'
    }
};
