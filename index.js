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
    StaffPicks: contractFactoryFunction(JSON.parse(classes.StaffPicks.interface)),
    StandardCampaign: contractFactoryFunction(JSON.parse(classes.StandardCampaign.interface)),
    Campaign: contractFactoryFunction(JSON.parse(classes.Campaign.interface)),
    Token: contractFactoryFunction(JSON.parse(classes.Token.interface)),
    Owned: contractFactoryFunction(JSON.parse(classes.Owner.interface)),
    CampaignRegistry: contractFactoryFunction(JSON.parse(classes.CampaignRegistry.interface)),
    CampaignDataRegistry: contractFactoryFunction(JSON.parse(classes.CampaignDataRegistry.interface)),
    StandardRefundCampaignFactory: contractFactoryFunction(JSON.parse(classes.StandardRefundCampaignFactory.interface)),
  },
  testnet: {
    CampaignRegistryContract: deployedContractFunction(JSON.parse(classes.CampaignRegistry.interface)),
    CampaignDataRegistryContract: deployedContractFunction(JSON.parse(classes.CampaignDataRegistry.interface)),
    StaffPicksContract: deployedContractFunction(JSON.parse(classes.StaffPicks.interface)),
    StandardRefundCampaignFactoryContract: deployedContractFunction(JSON.parse(classes.StandardRefundCampaignFactory.interface)),
  },
};
