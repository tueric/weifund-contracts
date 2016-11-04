// require web3
import Web3 from 'web3';
import classes from './lib/classes.json';

// contract environments
const environments = {
  testnet: {
    HighlightRegistry: {
      address: '0x2de8ffc2a818f375669a0bf178cb4f6a89da597b',
    },
    CampaignRegistry: {
      address: '0x93700217d32474d1637b4ddd04eb67b6adecf01a',
    },
    CampaignDataRegistry: {
      address: '0x51ec7392def0584ccfd5ff29f35c0d286ad0373d',
    },
    StandardCampaignFactory: {
      address: '0xffb9adf430ed7a2d535eb3bd40981f1d8367bb8c',
    },
  },
};

// throw error
function throwError(error) {
  throw new Error(`WeiFundContracts Error: ${error}`);
}

// validate options object
function checkOptionsObject(options) {
  // check options object
  if (typeof options !== 'object') {
    throwError('WeiFund options object must be an object.');
  }

  // check options provider
  if (typeof options.provider !== 'object') {
    throwError(`options.provider must be an object, currently ${typeof options.provider}`);
  }

  // check options.network for string
  if (typeof options.network !== 'string') {
    throwError(`options.network must be a string, currently ${typeof options.network}`);
  }

  // check network
  if (options.network !== 'testnet') {
    throwError(`only network 'testnet' supported, not ${options.network}`);
  }
}

// build contract instance against network
function assignContractInstances(environment, inputObject, environmentsObject) {
  const outputObject = Object.assign({}, inputObject);
  const environmentObject = environmentsObject[environment];

  // move through environment object, contractName
  Object.keys(environmentObject).forEach((contractName) => {
    outputObject[contractName].instance = () => outputObject[contractName].at(environmentObject[contractName].address);
  });

  // output object
  return outputObject;
}

// default module export
export default function WeiFundContracts(options) {
  // check options object
  checkOptionsObject(options);

  // establish web3 object
  const web3 = new Web3(options.provider);

  // return outputObject
  const outputObject = assignContractInstances(options.network, {
    classes,
    HighlightRegistry: web3.eth.contract(JSON.parse(classes.HighlightRegistry.interface)),
    StandardCampaign: web3.eth.contract(JSON.parse(classes.StandardCampaign.interface)),
    Campaign: web3.eth.contract(JSON.parse(classes.Campaign.interface)),
    Token: web3.eth.contract(JSON.parse(classes.Token.interface)),
    Owned: web3.eth.contract(JSON.parse(classes.Owner.interface)),
    CampaignRegistry: web3.eth.contract(JSON.parse(classes.CampaignRegistry.interface)),
    CampaignDataRegistry: web3.eth.contract(JSON.parse(classes.CampaignDataRegistry.interface)),
    StandardCampaignFactory: web3.eth.contract(JSON.parse(classes.StandardCampaignFactory.interface)),
  }, environments);

  // return output object
  return outputObject;
}
