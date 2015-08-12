module.exports = {
    options: {
        accessKeyId: '<%= aws.accessKeyId %>',
        secretAccessKey: '<%= aws.secretAccessKey %>',
        bucket: 'login.enplug.com',
        cacheTTL: 0,
        overwrite: true
    },
    index: {
        cwd: 'dist/',
        src: 'index.html'
    },
    release: {
        cwd: 'dist/',
        src: ['**', '!index.html']
    }
};
