const fs = require('fs');

const AWS = require('aws-sdk');
const mime = require('mime-types');
const readdir = require('recursive-readdir');
const async = require('async');
const eachLimit = async.eachLimit;

const UPLOAD_CONCURRENCY = 10;
const log = process.env.S3_RECURSIVE_UPLOADER_DEBUG
  ? console.log.bind(console)
  : () => {};

const makeBucketKey = (root, destination, path) => {
  const bucket = destination.split('/')[0];
  const prefix = (destination.replace(bucket, '') || '/').substr(1);
  const key = `${prefix}${path.replace(root + '/', '')}`;
  return { bucket, key };
};

const uploadFileFactory = (s3, root, destination) => (path, callback) => {
  const { bucket, key } = makeBucketKey(root, destination, path);
  s3.upload(
    {
      Bucket: bucket,
      Key: key,
      Body: fs.createReadStream(path),
      ContentType: mime.lookup(path) || 'application/octet-stream'
    },
    err => {
      if (err) {
        return callback(err);
      }
      log('uploaded', key);
      callback(null);
    }
  );
};

function upload (opts, callback) {
  const source = opts.source;
  const destination = opts.destination; // bucket[/prefix]
  const ignoreList = opts.ignore || [];
  const ignoreHidden = opts.ignoreHidden || true;

  if (opts.source[0] !== '/') {
    return callback(
      new Error('s3-recursive-uploader: source path must be absolute')
    );
  }

  if (ignoreHidden) {
    ignoreList.push('.*');
  }

  const s3 = new AWS.S3({});
  const uploader = uploadFileFactory(s3, source, destination);

  readdir(source, ignoreList, function (err, files) {
    if (err) {
      return callback(err);
    }
    eachLimit(files, UPLOAD_CONCURRENCY, uploader, err => {
      callback(err, {count: files.length});
    });
  });
}

module.exports = function (opts) {
  return new Promise((resolve, reject) => {
    upload(opts, (err, result) => {
      if (err) {
        return reject(err);
      }
      resolve(result);
    });
  });
};

module.exports.makeBucketKey = makeBucketKey;
