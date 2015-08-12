module.exports = {
    project: {
        options: {
            questions: [
                {
                    config: 'project',
                    type: 'list',
                    message: 'Are you working on the app or dashboard?',
                    choices: [
                        {
                            value: 'app',
                            name: 'App (src/app/*)'
                        },
                        {
                            value: 'dashboard',
                            name: 'Dashboard (src/dashboard/*)'
                        }
                    ]
                }
            ]
        }
    }
};
