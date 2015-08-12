module.exports = {
    js: {
        src: [
            'tmp/<%= project %>/js/libs.js',
            'src/<%= project %>/js/module.js',
            'src/<%= project %>/js/**/*.js',
            'tmp/<%= project %>/js/*.js'
        ],
        dest: 'tmp/<%= project %>/js/app.js',
        nonull: true
    },
    css: {
        src: [
            'tmp/<%= project %>/css/libs.css',
            'tmp/<%= project %>/css/app.css'
        ],
        dest: 'dist/<%= project %>/css/app.css',
        nonull: true
    }
};
