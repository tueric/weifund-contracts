import "dapple/test.sol";
import "StandardCampaignFactory.sol";
import "StandardCampaign.sol";
import "__tests__/MyTestFramework.sol";

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

contract StandardCampaignFactoryTest is MyTestFramework {
  StandardCampaignFactory target;
  StandardCampaign targetCampaign;

  function test_standardCampaignFactory() {
    target = new StandardCampaignFactory();

    // build new user
    User user = new User();
    user.send(1000);

    address newCampaignAddress = user.newCampaign(address(target), "Nick", now + 100000, 300, address(user));
    assert(newCampaignAddress != address(0), "Campaign was created with address 0x0");
    assert(target.isService(newCampaignAddress) == true, "Factory did not accept new campaign as a service");
    assert(target.isService(address(0)) == false, "Factory accepted a service with address 0x0");

    targetCampaign = StandardCampaign(newCampaignAddress);

    assert(uint256(targetCampaign.fundingGoal()) == uint256(300), "Campaign does not have expected funding goal");
    assert(targetCampaign.owner() == address(user), "Campaign owner is not as expected");
  }
}
