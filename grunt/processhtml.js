module.exports = {

    // Basically just copies the HTML file, leaving non-minified file versions
    build: {
        expand: true,
        cwd: 'src',
        src: '*/index.html',
        flatten: false,
        dest: 'dist/',
        filter: 'isFile'
    },

    // Replaces non-minified references with minified
    release: {
        files: {
            'dist/<%= project %>/index.html': 'src/<%= project %>/index.html'
        }
    }
};
