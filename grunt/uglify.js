module.exports = {
    options: {
        mangle: true
    },
    release: {
        files: {
            'dist/js/app.min.js': 'dist/js/app.js'
        }
    }
};
