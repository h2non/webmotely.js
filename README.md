# webmotely [![Build Status](https://secure.travis-ci.org/webmotely/webmotely.js.png?branch=master)][travis]

> This project is a proof of concept

Webmotely JavaScript client (proof of concept)

## Installation

#### Node.js

```bash
npm install webmotely --save
```

#### Browser

Via Bower package manager
```bash
bower install webmotely --save
```

Or loading the script remotely
```html
<script src="//cdn.rawgit.com/h2non/webmotely/0.1.1/webmotely.js"></script>
```

### Environments

It [works](http://kangax.github.io/compat-table/es5/) in any ES5 compliant engine

- Chrome >= 5
- Firefox >= 3
- Safari >= 5
- Opera >= 12
- IE >= 9

## Basic usage

```js
var webmotely = require('webmotely')
```

```js
// to do
```

## API

## Development

Only [node.js](http://nodejs.org) is required for development

Clone/fork this repository
```
$ git clone https://github.com/h2non/webmotely.git && cd webmotely
```

Install package dependencies
```
$ npm install
```

Compile code
```
$ make compile
```

Run tests
```
$ make test
```

Browser sources bundle generation
```
$ make browser
```

Release a new version
```
$ make release
```

## License

[MIT](http://opensource.org/licenses/MIT) - Tomas Aparicio

[travis]: http://travis-ci.org/webmotely/webmotely.js
[npm]: http://npmjs.org/package/webmotely.js
