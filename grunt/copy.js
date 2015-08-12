module.exports = {
    img: {
        expand: true,
        cwd: 'src/img/',
        src: '**',
        dest: 'dist/img/',
        flatten: true,
        filter: 'isFile'
    },
    js: {
        files: {
            'dist/js/app.js': 'tmp/app.js'
        }
    }
};
