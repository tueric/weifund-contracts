const classes_module = require('./lib/classes.json');
const environments_module = require('./lib/environments.json');

function contractFactoryFunction(abi) {
  return function (web3) {
    return web3.eth.contract(abi);
  };
};

function deployedContractFunction(abi, address) {
  return function (web3) {
    return web3.eth.contract(abi).at(address);
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
  testnet: {
    CampaignRegistryContract: deployedContractFunction(JSON.parse(classes_module.CampaignRegistry.interface)),
    CampaignDataRegistryContract: deployedContractFunction(JSON.parse(classes_module.CampaignDataRegistry.interface)),
    StaffPicksContract: deployedContractFunction(JSON.parse(classes_module.StaffPicks.interface)),
    StandardRefundCampaignFactoryContract: deployedContractFunction(JSON.parse(classes_module.StandardRefundCampaignFactory.interface)),
  },
};
