module.exports = {
    build: {
        dest: 'tmp/<%= project %>/libs.js',
        cssDest: 'tmp/<%= project %>/libs.css',
        includeDev: true,
        exclude: [
            'angular' // Included from CDN
        ]
    }
};
