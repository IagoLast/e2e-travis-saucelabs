require('dotenv').config(); // Carga la informacion secreta.

module.exports = {
    src_folders: ['test'], // Array de carpetas donde se encuentran los tests
    test_settings: {
        default: {
            desiredCapabilities: {
                browserName: 'chrome', // Navegador que va a ser controlado
            },
            selenium_port: 80, // Puerto en el que sauce sirve selenium
            selenium_host: 'ondemand.saucelabs.com', // Url de saucelabs
            username: process.env.SAUCE_USERNAME, // Nombre de usuario de saucelabs
            access_key: process.env.SAUCE_ACCESS_KEY, // Api key de sauce labs
        },
    }
};