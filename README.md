# loopback-counts-where-mixin
A mixin to enable get count with condition of related models for a loopback Model.
It developed from [loopback-counts-mixin](https://github.com/exromany/loopback-counts-mixin)

## INSTALL

```
npm install --save loopback-counts-where-mixin
```
Or
```
yarn add loopback-counts-where-mixin
```

There are 2 ways to enable mixin:

### 1) server.js

In your server/server.js file add the following line before the boot(app, __dirname); line.

```js
...
var app = module.exports = loopback();
...
// Add Counts Mixin to loopback
require('loopback-counts-where-mixin')(app);

boot(app, __dirname, function(err) {
  'use strict';
  if (err) throw err;

  // start the server if `$ node server.js`
  if (require.main === module)
    app.start();
});
```

### 2) mixin sources

Add the mixins property to your server/model-config.json like the following:

```json
{
  "_meta": {
    "sources": [
      "loopback/common/models",
      "loopback/server/models",
      "../common/models",
      "./models"
    ],
    "mixins": [
      "loopback/common/mixins",
      "loopback/server/mixins",
      "../node_modules/loopback-counts-where-mixin",
      "../common/mixins",
      "./mixins"
    ]
  }
}
```

## CONFIG

To use with your Models add the `mixins` attribute to the definition object of your model config.

```json
{
  "name": "boy",
  "properties": {
    "title": "string"
  },
  "relations": {
    "girlfriends": {
      "type": "hasMany",
      "model": "girl"
    }
  },
  "mixins": {
    "CountsWhere": true
  }
}
```

## USAGE

In fetching data

```
filter: {
  ...,
  counts: ['girlfriends'],
  countsWhere: [{ body: 'sexy' }],
  countsAs: ['totalGirlfriend']
}
```

will return list of games with field `playersCount`

```json
[
  {
    "id": 1,
    "title": "Good Boy",
    "totalGirlfriend": 1
  },
  {
    "id": 2,
    "title": "Bad Boy",
    "totalGirlfriend": 42
  }
]
```

## LICENSE

MIT

