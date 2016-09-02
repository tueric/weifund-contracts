import "examples/StandardRefundCampaign.sol";
import "PrivateServiceRegistry.sol";

contract StandardRefundCampaignFactory is PrivateServiceRegistry {
  function newStandardRefundCampaign(string _name,
    uint256 _expiry,
    uint256 _fundingGoal,
    address _beneficiary) returns (address _campaignAddress) {
    _campaignAddress = address(new StandardRefundCampaign(_name, _expiry, _fundingGoal, _beneficiary, msg.sender));
    register(_campaignAddress);
  }
}
