module.exports = {
    options: {
        outputStyle: 'nested',
        sourceMap: true
    },
    build: {
        files: {
            'tmp/app.css': 'src/sass/app.scss'
        }
    }
};
