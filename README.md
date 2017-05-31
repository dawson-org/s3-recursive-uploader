s3-recursive-uploader
=====================

recursively uploads files and directories to s3

[![npm version](https://badge.fury.io/js/s3-recursive-uploader.svg)](https://badge.fury.io/js/s3-recursive-uploader) 
[![Build Status](https://travis-ci.org/dawson-org/s3-recursive-uploader.svg?branch=master)](https://travis-ci.org/dawson-org/s3-recursive-uploader) 
[![Greenkeeper badge](https://badges.greenkeeper.io/dawson-org/s3-recursive-uploader.svg)](https://greenkeeper.io/)

### Usage

```js

import uploader from 's3-recursive-uploader';

uploader({
  source: `${__dirname}/public`,
  destination: 'my-bucket/assets/', // or 'mybucket' (trailing / is mandatory iff specifying a prefix)
  ignoreHidden: true, // default, ignoring files starting with '.'
  ignore: [], // passed to https://github.com/jergason/recursive-readdir
  acl: 'public-read' // access policy for files. Defaults to 'private'. Passed to aws-sdk
})
.then((stats) => console.log('all done:', stats.count))
.catch((err) => console.error('Error', err));

```

## Contributors

Thanks goes to these wonderful people ([emoji key](https://github.com/kentcdodds/all-contributors#emoji-key)):

<!-- ALL-CONTRIBUTORS-LIST:START - Do not remove or modify this section -->
| [<img src="https://avatars0.githubusercontent.com/u/950086?v=3" width="100px;"/><br /><sub>Simone Lusenti</sub>](https://twitter.com/Lanzone31)<br />[💬](#question-lusentis "Answering Questions") [💻](https://github.com/dawson-org/s3-recursive-uploader/commits?author=lusentis "Code") [📖](https://github.com/dawson-org/s3-recursive-uploader/commits?author=lusentis "Documentation") [👀](#review-lusentis "Reviewed Pull Requests") [⚠️](https://github.com/dawson-org/s3-recursive-uploader/commits?author=lusentis "Tests") [🔧](#tool-lusentis "Tools") |
| :---: |
<!-- ALL-CONTRIBUTORS-LIST:END -->

This project follows the [all-contributors](https://github.com/kentcdodds/all-contributors) specification. Contributions of any kind welcome!