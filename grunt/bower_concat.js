module.exports = {
    build: {
        dest: 'tmp/<%= project %>/js/libs.js',
        cssDest: 'tmp/<%= project %>/css/libs.css',
        includeDev: true,
        exclude: [
            'angular' // Included from CDN
        ]
    }
};
