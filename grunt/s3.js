module.exports = {
    options: {
        accessKeyId: '<%= aws.accessKeyId %>',
        secretAccessKey: '<%= aws.secretAccessKey %>',
        bucket: '[yourbucket]',
        cacheTTL: 0,
        overwrite: true
    },
    release: {
        cwd: 'dist/',
        src: ['**']
    }
};
