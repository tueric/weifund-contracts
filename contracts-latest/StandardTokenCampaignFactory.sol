import "StandardTokenCampaign.sol";
import "PrivateServiceRegistry.sol";
import "StandardToken.sol";

contract StandardTokenCampaignFactory is PrivateServiceRegistry {
  function createCampaign(uint _goal,
    uint _expiry,
    uint _created,
    uint _amountRaised,
    uint _fundingGoal,
    uint _paidOut,
    uint _tokenPrice,
    address _beneficiary,
    address _token) public returns (address campaignAddress) {
    campaignAddress = new StandardTokenCampaign(_goal,
      _expiry,
      _created,
      _amountRaised,
      _fundingGoal,
      _paidOut,
      _tokenPrice,
      _beneficiary,
      _token);
    register(campaignAddress);
  }
}
