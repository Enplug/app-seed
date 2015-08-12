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
        dest: 'src/<%= project %>/tmp/templates.js'
    }
};
