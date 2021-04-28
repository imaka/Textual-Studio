const fs = require('fs');
const argv = require('yargs').argv;

const environment = argv.environment ? `.${argv.environment}` : '';

const targetPath = `./src/environments/environment${environment}.ts`;

fs.readFile(targetPath, 'utf8', function(readError, data) {
  if (readError) {
    return console.log(readError);
  }
  let result = data;

  if (process.env.CONTENTFUL_SPACE) {
    console.log('Updating SPACE');

    result = result.replace(/(space:\s*')(.*)(',?)/g, `$1${process.env.CONTENTFUL_SPACE}$3`);
  }
  if (process.env.CONTENTFUL_ACCESS_TOKEN) {
    console.log('Updating ACCESS_TOKEN');

    result = result.replace(/(access_token:\s*')(.*)(',?)/g, `$1${process.env.CONTENTFUL_ACCESS_TOKEN}$3`);
  }
  if (process.env.CONTENTFUL_PRESETS) {
    console.log('Updating PRESETS');

    result = result.replace(/(presets:\s*')(.*)(',?)/g, `$1${process.env.CONTENTFUL_PRESETS}$3`);
  }
  if (process.env.SENTRY_DSN) {
    console.log('Updating SENTRY_DSN');

    result = result.replace(/(sentry_dsn:\s*')(.*)(',?)/g, `$1${process.env.SENTRY_DSN}$3`);
  }

  fs.writeFile(targetPath, result, 'utf8', function(writeError) {
    if (writeError) {
      return console.log(writeError);
    }
  });
});
