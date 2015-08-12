module.exports = {
    build: {
        dest: 'tmp/libs.js',
        cssDest: 'tmp/libs.css',
        includeDev: true,
        exclude: [
            'angular',
            'ng-file-upload',
            'ngDialog'
        ]
    }
};
