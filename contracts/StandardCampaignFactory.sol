import "StandardCampaign.sol";
import "PrivateServiceRegistry.sol";
import "StandardToken.sol";

contract CampaignFactory is PrivateServiceRegistry {

  function createCampaign(uint _expiry, uint _fundingGoal, address _beneficiary) public returns (address campaignAddress) {
    campaignAddress = new StandardCampaign(_expiry, _fundingGoal, _beneficiary);
    register(campaignAddress);
  }
}
