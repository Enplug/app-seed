module.exports = {
    build: {
        options: {
            singleModule: true,
            module: '<%= pkg.name %>-templates',
            rename: function (moduleName) {
                return moduleName.replace('.html', '');
            }
        },
        src: ['src/<%= project %>/templates/*.html'],
        dest: 'tmp/<%= project %>/js/templates.js'
    }
};
