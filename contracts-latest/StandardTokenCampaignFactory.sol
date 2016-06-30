import "StandardTokenCampaign.sol";
import "PrivateServiceRegistry.sol";
import "StandardToken.sol";

contract StandardTokenCampaignFactory is PrivateServiceRegistry {

  function createCampaign(uint _expiry, uint _fundingGoal, address _beneficiary, address _dispersalCalculator, address _token) public returns (address campaignAddress) {
    campaignAddress = new StandardTokenCampaign(_expiry,
      _fundingGoal,
      _beneficiary,
      _dispersalCalculator,
      _token);
    register(campaignAddress);
  }
}
