module.exports = {
    options: {
        patterns: [
            {
                match: 'version',
                replacement: '<%= pkg.version %>'
            }
        ]
    },
    build: {
        files: [{ 'tmp/<%= project %>/js/templates.js': 'tmp/<%= project %>/js/templates.js' }]
    },
    release: {
        files: [{ 'dist/<%= project %>/index.html': 'dist/<%= project %>/index.html' }]
    }
};
