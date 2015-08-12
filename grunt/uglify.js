module.exports = {
    options: {
        mangle: true
    },
    release: {
        files: {
            'dist/<%= project %>/js/app.min.js': 'dist/<%= project %>/js/app.js'
        }
    }
};
