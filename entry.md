Normalmente no pienso en la compatibilidad entre navegadores de mis side-projects y los haga por diversión y para aprender algo por lo que con que funcionen en mi máquina me llega.

Por desgracia el mundo laboral es más complicado y si queremos ser medianamente serios lo mínimo que deberíamos dar es una **lista de navegadores compatibles**.

En este artículo voy a hablar sobre como crear un entorno de integración continua con tests e2e utilizando [Travis](travis-ci.org), [Nightwatch](http://nightwatchjs.org/) y [SauceLabs](https://saucelabs.com/) 

## Aplicación de ejemplo.

La aplicación que vamos a probar, es una web-app que simplemente muestra `Hello World` utilizando características de `es6` como  `const` o string literals.

```html
<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    <title>Document</title>

</head>

<body>
    <script>
        const name = 'WORLD';
        const helloElement = document.createElement('h1');
        helloElement.innerText = `Hello ${name}`;
        document.body.appendChild(helloElement);
    </script>
</body>

</html>
```

## Sirviendo la app en local

Con [serve](https://github.com/zeit/serve) se puede crear un servidor web facilmente de forma que se puede probar una app en local.

Se puede instalar escribiendo:


    yarn add --dev serve


Con el comando `serve` creo un servidor web que sirve el `index.html` de mi web-app en el puerto `5000`.

```

 $(npm bin)/serve

   ┌──────────────────────────────────────────────────┐
   │                                                  │
   │   Serving!                                       │
   │                                                  │
   │   - Local:            http://localhost:5000      │
   │   - On Your Network:  http://192.168.0.13:5000   │
   │                                                  │
   │   Copied local address to clipboard!             │
   │                                                  │
   └──────────────────────────────────────────────────┘

```

Efectivamente, abriendo chrome en `http://localhost:5000` puedo ver mi aplicación funcionando correctamente.

![Screenshot 1]
(https://iagolast.files.wordpress.com/2017/10/chrome.png)
<img src="https://iagolast.files.wordpress.com/2017/10/chrome.png" alt="chrome.png" width="681" height="335" class="alignnone size-full wp-image-799"/>


## Configurando Nightwatch.js

Lo habitual es que por cada cambio que haga en mi app, vuelva a abrir el navegador y comprobar a mano que todo funciona correctamente,
[Nightwatch.js](http://nightwatchjs.org/) es una herramienta que permite automatizar este proceso de forma que podemos dedicar ese tiempo a otras cosas más útiles.

Para instalar nightwatch basta con escribir

```
    yarn add --dev nightwatch
```

También voy a crear un archivo de configuración (nightwatch.conf.js) y un archivo con un test (test.js).

```javascript
// nightwatch.conf.js

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
```


```javascript
// test/basic.js

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
    // Finish browser session.
    browser.end();
  },
};

```

Para ejecutar las pruebas en local, hace falta tener un servidor de selenium corriendo junto con un [Browser Driver](http://nightwatchjs.org/gettingstarted#browser-drivers-setup).

En mac se puede instalar selenium mediante:

    brew install selenium-server-standalone

Y el driver de chrome:

    brew install chromedriver


Con esto instalado podemos ejecutar los tests, para ello en una pestaña del terminal ejecutamos el servidor de selenium

    selenium-server


