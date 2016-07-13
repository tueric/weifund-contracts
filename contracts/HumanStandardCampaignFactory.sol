import "HumanStandardCampaign.sol";
import "PrivateServiceRegistry.sol";

contract HumanStandardCampaignFactory is PrivateServiceRegistry {
  function createHumanStandardCampaign(string _name,
    address _beneficiary,
    uint256 _fundingGoal,
    uint256 _expiry) returns (address humanStandardCampaign) {
      humanStandardCampaign = address(new HumanStandardCampaign(_name,
        _beneficiary,
        _fundingGoal,
        _expiry));
    }
}
