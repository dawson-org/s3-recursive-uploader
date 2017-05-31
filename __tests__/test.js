const test = require('ava');
const {S3} = require('aws-sdk');
const s3 = new S3();

const uploader = require('../');
const makeBucketKey = uploader.makeBucketKey;

const BUCKET_NAME = process.env.BUCKET_NAME;

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
    destination: `${BUCKET_NAME}/assets/`, // or 'mybucket'
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

test.cb('upload to bucket with public-read acl', t => {
  t.plan(1);

  uploader({
    source: `${__dirname}/fixtures-public`,
    destination: `${BUCKET_NAME}/assets/`, // or 'mybucket'
    ignoreHidden: true, // default, ignoring files starting with '.'
    ignore: [], // passed to https://github.com/jergason/recursive-readdir
    acl: 'public-read' // Access policy for files. Defaults to 'private'. Passed to aws-sdk
  })
    .then(() => {
      return s3.getObjectAcl({
        Bucket: BUCKET_NAME,
        Key: `assets/public.txt`
      })
        .promise()
        .then(meta => {
          meta.Grants.forEach(grant => {
            if (grant.Permission === 'READ') {
              t.deepEqual(grant, {
                Grantee: {
                  Type: 'Group',
                  URI: 'http://acs.amazonaws.com/groups/global/AllUsers'
                },
                Permission: 'READ'
              });
            }
          });
          t.end();
        });
    })
    .catch(err => {
      t.fail(err.message);
      t.end();
    });
});

test.cb('upload to bucket with private acl if not specified', t => {
  t.plan(1);

  uploader({
    source: `${__dirname}/fixtures`,
    destination: `${BUCKET_NAME}/assets/`, // or 'mybucket'
    ignoreHidden: true, // default, ignoring files starting with '.'
    ignore: [] // passed to https://github.com/jergason/recursive-readdir
  })
    .then(() => {
      return s3.getObjectAcl({
        Bucket: BUCKET_NAME,
        Key: `assets/1.txt`
      })
        .promise()
        .then(meta => {
          meta.Grants.forEach(grant => {
            t.not(grant.Permission, 'READ');
          });
          t.end();
        });
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
    destination: `${BUCKET_NAME}`, // or 'mybucket', no trailing /
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
