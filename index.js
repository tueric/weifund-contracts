const classes_module = require('./lib/classes.json');
const environments_module = {
  testnet: {
    StaffPicks: {
      address: '0x2de8ffc2a818f375669a0bf178cb4f6a89da597b',
    },
    CampaignRegistry: {
      address: '0x93700217d32474d1637b4ddd04eb67b6adecf01a',
    },
    CampaignDataRegistry: {
      address: '0x51ec7392def0584ccfd5ff29f35c0d286ad0373d',
    },
    StandardRefundCampaignFactory: {
      address: '0xffb9adf430ed7a2d535eb3bd40981f1d8367bb8c',
    },
  },
};

function contractFactoryFunction(abi) {
  return function (web3) {
    return web3.eth.contract(abi);
  };
};

function contractFunction(abi, contractName) {
  return function (web3, environment) {
    if (typeof environments_module[environment] === 'undefined'
     || typeof environments_module[environment][contractName] === 'undefined') {
      throw new Error(`WeiFund Contracts Error: contract environment '${environment} not available for contract '${contractName}'. Please choose an enviromment that is available.`);
    }

    return web3.eth.contract(abi).at(environments_module[environment][contractName].address);
  };
};

module.exports = {
  classes: classes_module,
  environments: environments_module,
  factories: {
    StaffPicks: contractFactoryFunction(JSON.parse(classes_module.StaffPicks.interface)),
    StandardCampaign: contractFactoryFunction(JSON.parse(classes_module.StandardCampaign.interface)),
    Campaign: contractFactoryFunction(JSON.parse(classes_module.Campaign.interface)),
    Token: contractFactoryFunction(JSON.parse(classes_module.Token.interface)),
    Owned: contractFactoryFunction(JSON.parse(classes_module.Owner.interface)),
    CampaignRegistry: contractFactoryFunction(JSON.parse(classes_module.CampaignRegistry.interface)),
    CampaignDataRegistry: contractFactoryFunction(JSON.parse(classes_module.CampaignDataRegistry.interface)),
    StandardRefundCampaignFactory: contractFactoryFunction(JSON.parse(classes_module.StandardRefundCampaignFactory.interface)),
  },
  CampaignRegistry: contractFunction(JSON.parse(classes_module.CampaignRegistry.interface), 'CampaignRegistry'),
  CampaignDataRegistry: contractFunction(JSON.parse(classes_module.CampaignDataRegistry.interface), 'CampaignDataRegistry'),
  StaffPicks: contractFunction(JSON.parse(classes_module.StaffPicks.interface), 'StaffPicks'),
  StandardRefundCampaignFactory: contractFunction(JSON.parse(classes_module.StandardRefundCampaignFactory.interface), 'StandardRefundCampaignFactory'),
};
