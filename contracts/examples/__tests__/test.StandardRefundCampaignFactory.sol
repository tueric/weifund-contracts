import "dapple/test.sol";
import "examples/StandardRefundCampaignFactory.sol";
import "examples/StandardRefundCampaign.sol";

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

contract StandardRefundCampaignFactoryTest is Test {
  StandardRefundCampaignFactory target;
  StandardRefundCampaign targetCampaign;

  function test_refundStandardRefundCampaignFactory() {
    target = new StandardRefundCampaignFactory();

    // build new user
    User user = new User();
    user.send(1000);

    address newCampaignAddress = user.newCampaign(address(target), "Nick", now + 100000, 300, address(user));
    assertTrue(bool(newCampaignAddress != address(0)));
    assertTrue(bool(target.isService(newCampaignAddress)));
    assertFalse(target.isService(address(0)));

    targetCampaign = StandardRefundCampaign(newCampaignAddress);

    assertEq(uint256(targetCampaign.fundingGoal()), uint256(300));
    assertEq(targetCampaign.owner(), address(user));
  }
}
