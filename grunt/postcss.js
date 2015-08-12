module.exports = {
    options: {
        map: false,
        processors: [
            require('autoprefixer-core')({ browsers: 'last 2 versions' })
        ]
    },
    build: {
        src: 'dist/css/*.css'
    }
};
