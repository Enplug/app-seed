module.exports = {
    options: {
        outputStyle: 'nested',
        sourceMap: true
    },
    build: {
        files: {
            'tmp/<%= project %>/css/app.css': 'src/<%= project %>/sass/app.scss'
        }
    }
};
