const test = require('ava');

const uploader = require('../');
const makeBucketKey = uploader.makeBucketKey;

test('makeBucketKey with a prefix', t => {
  const {bucket, key} = makeBucketKey(
    `${__dirname}/fixtures`,
    'mybucket/myprefix/',
    `${__dirname}/fixtures/10.txt`
  );
  t.is(bucket, 'mybucket');
  t.is(key, 'myprefix/10.txt');
});

test('makeBucketKey without a prefix', t => {
  const {bucket, key} = makeBucketKey(
    `${__dirname}/fixtures`,
    'mybucket',
    `${__dirname}/fixtures/10.txt`
  );
  t.is(bucket, 'mybucket');
  t.is(key, '10.txt');
});

test.cb('upload to bucket with prefix', t => {
  t.plan(1);

  uploader({
    source: `${__dirname}/fixtures`,
    destination: 'dawson-s3-recursive-uploader-example/assets/', // or 'mybucket'
    ignoreHidden: true, // default, ignoring files starting with '.'
    ignore: [] // passed to https://github.com/jergason/recursive-readdir
  })
    .then(meta => {
      t.is(meta.count, 20, 'should have uploaded 20 files');
      t.end();
    })
    .catch(err => {
      t.fail(err.message);
      t.end();
    });
});

test.cb('upload to bucket without prefix', t => {
  t.plan(1);

  uploader({
    source: `${__dirname}/fixtures`,
    destination: 'dawson-s3-recursive-uploader-example', // or 'mybucket', no trailing /
    ignoreHidden: true, // default, ignoring files starting with '.'
    ignore: [] // passed to https://github.com/jergason/recursive-readdir
  })
    .then(meta => {
      t.is(meta.count, 20, 'should have uploaded 20 files');
      t.end();
    })
    .catch(err => {
      t.fail(err.message);
      t.end();
    });
});
