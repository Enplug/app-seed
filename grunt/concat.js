module.exports = {
    js: {
        src: [
            'tmp/libs.js',
            'src/js/module.js',
            'src/js/**/*.js',
            'tmp/*.js'
        ],
        dest: 'tmp/app.js',
        nonull: true
    },
    css: {
        src: [
            'tmp/libs.css',
            'tmp/app.css'
        ],
        dest: 'dist/css/app.css',
        nonull: true
    }
};
