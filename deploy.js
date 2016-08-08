const config = require('./ethdeploy.config');
const deployer = require('ethdeploy');
const buildFileLocation = './lib/environments.json';
const fs = require('fs');

// run deployer
deployer(config, function(deployerError, deployerResult) {
  if (deployerError) {
    log(`Error during contract deployment!`);
  } else {
    // build string build object
    const stringBuildObject = JSON.stringify(deployerResult, null, 2);

    // build environments fileory
    fs.writeFile(buildFileLocation, stringBuildObject, 'utf8', function(writeBuildFileError, writeBuildFileResult) {

      // exist with success
      if(!writeBuildFileError && typeof writeBuildFileResult === 'undefined') {
        process.exit();
      }
    });
  }
});
