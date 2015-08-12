module.exports = {
    options: {
        outputStyle: 'nested',
        sourceMap: true
    },
    build: {
        files: {
            'src/<%= project %>/tmp/app.css': 'src/<%= project %>/sass/app.scss'
        }
    }
};
