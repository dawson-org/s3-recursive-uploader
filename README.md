s3-recursive-uploader
=====================

recursively uploads files and directories to s3

### Usage

```js

import uploader from 's3-recursive-uploader';

uploader({
  source: `${__dirname}/public`,
  destination: 'my-bucket/assets', // or 'mybucket', no trailing /
  ignoreHidden: true, // default, ignoring files starting with '.'
  ignore: [] // passed to https://github.com/jergason/recursive-readdir
})
.then((stats) => console.log('all done:', stats.count))
.catch((err) => console.error('Error', err));

```
