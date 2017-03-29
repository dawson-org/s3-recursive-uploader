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
  ignore: [] // passed to https://github.com/jergason/recursive-readdir
})
.then((stats) => console.log('all done:', stats.count))
.catch((err) => console.error('Error', err));

```
