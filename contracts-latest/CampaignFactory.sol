import "Campaign.sol";
import "PrivateServiceRegistry.sol";
import "StandardToken.sol";

contract CampaignFactory is PrivateServiceRegistry {
  function createCampaign(uint _goal,
    uint _expiry,
    uint _created,
    uint _amountRaised,
    uint _fundingGoal,
    uint _paidOut,
    address _beneficiary) public returns (address campaignAddress) {
    campaignAddress = new Campaign(_goal,
      _expiry,
      _created,
      _amountRaised,
      _fundingGoal,
      _paidOut,
      _beneficiary);
    register(campaignAddress);
  }
}
