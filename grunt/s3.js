module.exports = {
    options: {
        accessKeyId: '<%= aws.accessKeyId %>',
        secretAccessKey: '<%= aws.secretAccessKey %>',
        bucket: '[yourbucket]',
        cacheTTL: 0,
        overwrite: true,

        // Auto-config buckets
        createBucket: true,
        enableWeb: true,
        access: 'public-read',
        region: 'us-east-1',
    },
    release: {
        cwd: 'dist/',
        src: ['<%= project %>/**']
    }
};
