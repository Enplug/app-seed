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
        files: [{ 'tmp/templates.js': 'tmp/templates.js' }]
    },
    release: {
        files: [{ 'dist/index.html': 'dist/index.html' }]
    }
};
