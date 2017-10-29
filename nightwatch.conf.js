const TRAVIS_JOB_NUMBER = process.env.TRAVIS_JOB_NUMBER; // Variable de entorno definida automaticamente por travis
require('dotenv').config();

module.exports = {
    src_folders: ['test'],
    test_settings: {
        default: {
            desiredCapabilities: {
                browserName: 'chrome',
                build: `build-${TRAVIS_JOB_NUMBER}`, // <----- importante para travis
                'tunnel-identifier': TRAVIS_JOB_NUMBER, // <----- importante para travis
            },
            selenium_port: 80,
            selenium_host: 'ondemand.saucelabs.com',
            username: process.env.SAUCE_USERNAME,
            access_key: process.env.SAUCE_ACCESS_KEY,
        },
        firefox55: {
            desiredCapabilities: {
                browserName: 'firefox',
                version: 55,
            }
        },
        ie11: {
            desiredCapabilities: {
                browserName: 'internet explorer',
                version: 11
            }
        },
        edge15: {
            desiredCapabilities: {
                browserName: 'MicrosoftEdge',
                version: 15,
            }
        },
    }
};