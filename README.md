# open-blobbed

## Why?

Because `open` and some of it's dependencies require a newer Node.js version, and we're using Node 8.x

## How to

Bump `open` if needed in `package.json`: https://github.com/Stremio/open-blobbed/blob/master/package.json#L12

Then:
```
npm i
npm start
```

This will webpack and babel `open` to `./index.js` which is then used as the entry point for this module, removing the newer Node.js requirement.

Now commit the new pre-built version of `open` (`index.js`) and use `open-blobbed` from this repository instead of `open` itself.