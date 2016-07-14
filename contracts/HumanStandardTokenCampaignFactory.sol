import "HumanStandardTokenCampaign.sol";
import "PrivateServiceRegistry.sol";

contract HumanStandardTokenCampaignFactory is PrivateServiceRegistry {
  function createHumanStandardTokenCampaign(string _name,
    address _token,
    address _dispersalCalculator,
    address _beneficiary,
    uint256 _fundingGoal,
    uint256 _expiry) returns (address humanStandardTokenCampaign) {
      humanStandardTokenCampaign = address(new HumanStandardTokenCampaign(_name,
        _token,
        _dispersalCalculator,
        _beneficiary,
        _fundingGoal,
        _expiry));
      register(humanStandardTokenCampaign);
    }
}
