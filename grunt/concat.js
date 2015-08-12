module.exports = {
    js: {
        src: [
            'tmp/<%= project %>/libs.js',
            'src/<%= project %>/js/module.js',
            'src/<%= project %>/js/**/*.js',
            'tmp/<%= project %>/*.js'
        ],
        dest: 'tmp/<%= project %>/app.js',
        nonull: true
    },
    css: {
        src: [
            'tmp/<%= project %>/libs.css',
            'tmp/<%= project %>/app.css'
        ],
        dest: 'dist/<%= project %>/css/app.css',
        nonull: true
    }
};
