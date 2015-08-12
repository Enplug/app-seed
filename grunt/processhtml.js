module.exports = {

    // Basically just copies the HTML file, leaving non-minified file versions
    build: {
        files: {
            'dist/index.html': 'src/index.html'
        }
    },

    // Replaces non-minified references with minified
    release: {
        files: {
            'dist/index.html': 'src/index.html'
        }
    }
};
