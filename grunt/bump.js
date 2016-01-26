module.exports = {
    // options.versionType can be set dynamically via grunt-prompt
    options: {
        // Using all defaults, hard-coded here so if they change we aren't surprised
        files: ['package.json'],
        commit: 'true',
        commitMessage: 'Release v%VERSION%',
        commitFiles: ['package.json'],
        createTag: false,
        push: false
    }
};
