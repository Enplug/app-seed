module.exports = {
    options: {
        singleQuotes: true
    },
    release: {
        files: {
            'dist/<%= project %>/js/app.js': ['tmp/<%= project %>/app.js']
        }
    }
};
