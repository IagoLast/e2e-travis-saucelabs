const after = require('./sauce-feedback');
module.exports = {
    basicTest: function (browser) { // Define a simple test
        // Navigate to web-app url
        browser.url('http://localhost:5000');
        // Wait the page to be loaded
        browser.waitForElementVisible('body', 1000);
        // Expect to have a h1 element
        browser.expect.element('h1').to.be.present;
        // Expect the element to have text Hello WORLD
        browser.expect.element('h1').text.to.equal('Hello WORLD');
    },
    after: after,
};
