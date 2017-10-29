module.exports = {
    src_folders: ['test'], // Array de carpetas donde se encuentran los tests
    test_settings: {
        default: {
            desiredCapabilities: {
                browserName: 'chrome', // Navegador que va a ser controlado
            }
        },
    }
};
