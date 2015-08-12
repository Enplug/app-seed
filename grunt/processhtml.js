module.exports = {

    // Basically just copies the HTML file, leaving non-minified file versions
    build: {
        files: {
            'dist/<%= project %>/index.html': 'src/<%= project %>/index.html'
        }
    },

    // Replaces non-minified references with minified
    release: {
        files: {
            'dist/<%= project %>/index.html': 'src/<%= project %>/index.html'
        }
    }
};
