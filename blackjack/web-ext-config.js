module.exports = {
    ignoreFiles: [
        'official/*',
        'updates.json',
        'todo'
    ],
    // Global options:
    // Command options:
    lint: {
        selfHosted: true
    },
    build: {
        overwriteDest: true
    }
};
