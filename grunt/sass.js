module.exports = {
    options: {
        outputStyle: 'nested',
        sourceMap: true
    },
    build: {
        files: {
            'tmp/<%= project %>/app.css': 'src/<%= project %>/sass/app.scss'
        }
    }
};
