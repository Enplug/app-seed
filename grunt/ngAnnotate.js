module.exports = {
    options: {
        singleQuotes: true
    },
    release: {
        files: {
            'dist/<%= project %>/js/app.js': ['src/<%= project %>/tmp/app.js']
        }
    }
};
