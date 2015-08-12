module.exports = {
    build: {
        dest: 'src/dashboard/tmp/libs.js',
        cssDest: 'src/dashboard/tmp/libs.css',
        includeDev: true,
        exclude: [
            'angular' // Included from CDN
        ]
    }
};
