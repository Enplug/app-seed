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
        files: [{ 'src/<%= project %>/tmp/templates.js': 'src/<%= project %>/tmp/templates.js' }]
    },
    release: {
        files: [{ 'dist/<%= project %>/index.html': 'dist/<%= project %>/index.html' }]
    }
};
