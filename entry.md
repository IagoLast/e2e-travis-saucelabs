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


Y con esto ya podemos ejecutar `nightwatch`, que controlará nuestro chrome y ejecutará los tests de forma automática.

```bash
MacBook-Pro-de-CARTO:e2e-travis-saucelabs iago$ $(npm bin)/nightwatch

[Basic] Test Suite
======================

Running:  basicTest
 ✔ Element <body> was visible after 45 milliseconds.
 ✔ Expected element <h1> to be present
 ✔ Expected element <h1> text to equal: "Hello WORLD"

OK. 3 assertions passed. (1.363s)
```

## Sauce Labs

Sauce labs es una herramienta gratis para open source que nos permite ejecutar pruebas de selenium contra diferentes plataformas de forma moderadamente sencilla.



### Configurando usuario y contraseña

Para utilizar `sauce-labs` tendremos que crearnos una cuenta, y editar nuestro archivo de configuración de nightwatch añadiendo
el puerto, el host y nuestro usuario y api-key.

Para **NO subir claves secretas a github** guardo mis variables de entorno en un archivo `.env` y las cargo mediante `dotenv` 


```javascript
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
```

### sauce-connect

Como nuestro servidor web esta en nuestra máquina local y no es accesible desde el exterior, necesitamos comunicar los servidores de 
sauce con nuestra web-app, para ello utilizaremos [sauce connect](https://wiki.saucelabs.com/display/DOCS/Sauce+Connect+Proxy), hay que bajarse el binario  y ejecutarlo pasandole como parametros usuario y api-key

    bin/sc -u <SAUCE_USERNAME> -k <SAUCE_ACCESS_KEY>

Si se ha ejecutado correctamente veremos que hay un tunel activo en el dashboard de `sauce`.

![Tunel activo]
(https://iagolast.files.wordpress.com/2017/10/screen-shot-2017-10-29-at-22-34-43.png)

Si ejecutamos de nuevo `nightwatch` este se ejecutará contra los servidores de sauce.


```bash

$(npm bin)/nightwatch

[Basic] Test Suite
======================

Running:  basicTest
 ✔ Element <body> was visible after 1013 milliseconds.
 ✔ Expected element <h1> to be present
 ✔ Expected element <h1> text to equal: "Hello WORLD"

OK. 3 assertions passed. (6.88s)


```