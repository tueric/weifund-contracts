import "dapple/test.sol";
import "StandardCampaignFactory.sol";
import "StandardCampaign.sol";

contract User {
  function newCampaign(address _targetAddress,
    string _name,
    uint256 _expiry,
    uint256 _fundingGoal,
    address _beneficiary) returns (address) {
    StandardCampaignFactory target = StandardCampaignFactory(_targetAddress);
    return address(target.newStandardCampaign(_name, _expiry, _fundingGoal, _beneficiary));
  }
}

contract StandardCampaignFactoryTest is Test {
  StandardCampaignFactory target;
  StandardCampaign targetCampaign;

  function test_refundStandardCampaignFactory() {
    target = new StandardCampaignFactory();

    // build new user
    User user = new User();
    user.send(1000);

    address newCampaignAddress = user.newCampaign(address(target), "Nick", now + 100000, 300, address(user));
    assertTrue(bool(newCampaignAddress != address(0)));
    assertTrue(bool(target.isService(newCampaignAddress)));
    assertFalse(target.isService(address(0)));

    targetCampaign = StandardCampaign(newCampaignAddress);

    assertEq(uint256(targetCampaign.fundingGoal()), uint256(300));
    assertEq(targetCampaign.owner(), address(user));
  }
}
