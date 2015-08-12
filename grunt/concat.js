module.exports = {
    js: {
        src: [
            'src/<%= project %>/tmp/libs.js',
            'src/<%= project %>/js/module.js',
            'src/<%= project %>/js/**/*.js',
            'src/<%= project %>/tmp/*.js'
        ],
        dest: 'src/<%= project %>/tmp/app.js',
        nonull: true
    },
    css: {
        src: [
            'src/<%= project %>/tmp/libs.css',
            'src/<%= project %>/tmp/app.css'
        ],
        dest: 'dist/<%= project %>/css/app.css',
        nonull: true
    }
};
