module.exports = {
    img: {
        expand: true,
        cwd: 'src',
        src: '*/img/**',
        dest: 'dist/',
        flatten: false,
        filter: 'isFile'
    },
    js: {
        expand: true,
        cwd: 'tmp',
        src: '*/js/app.js',
        dest: 'dist/',
        flatten: false,
        filter: 'isFile'
    }
};
