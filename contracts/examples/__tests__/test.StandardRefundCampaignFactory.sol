import "dapple/test.sol";
import "examples/StandardRefundCampaignFactory.sol";

contract User {
  function newCampaign(address _targetAddress,
    string _name,
    uint256 _expiry,
    uint256 _fundingGoal,
    address _beneficiary) returns (address) {
    StandardRefundCampaignFactory target = StandardRefundCampaignFactory(_targetAddress);
    return address(target.newStandardRefundCampaign(_name, _expiry, _fundingGoal, _beneficiary));
  }
}

contract StandardCampaignTest is Test {
  StandardRefundCampaignFactory target;

  function test_refundStandardRefundCampaignFactory() {
    // build new user
    User user = new User();
    user.send(1000);
    address newCampaignAddress = user.newCampaign(address(target), "Nick", now + 100000, 300, msg.sender);
  }
}
