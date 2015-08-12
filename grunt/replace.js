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
        files: [{ 'tmp/<%= project %>/templates.js': 'tmp/<%= project %>/templates.js' }]
    },
    release: {
        files: [{ 'dist/<%= project %>/index.html': 'dist/<%= project %>/index.html' }]
    }
};
