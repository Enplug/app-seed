module.exports = {
    options: {
        map: false, // will point to sass task css map
        processors: [
            require('autoprefixer')({ browsers: 'last 2 versions' })
        ]
    },
    build: {
        src: 'dist/<%= project %>/css/*.css'
    }
};
