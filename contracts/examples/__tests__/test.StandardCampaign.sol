import "dapple/test.sol";
import "examples/StandardCampaign.sol";

contract User {
  function newCampaign(string _name,
    uint256 _expiry,
    uint256 _fundingGoal,
    address _beneficiary) returns (address) {
    return address(new StandardCampaign(_name, _expiry, _fundingGoal, _beneficiary, msg.sender));
  }

  function newContribution(address _campaign, uint256 _value) returns (uint) {
    StandardCampaign target = StandardCampaign(_campaign);
    return target.contributeMsgValue.value(_value)();
  }
}

contract StandardCampaignTest is Test {
  StandardCampaign target;
  string campaignName = "Nicks Campaign";
  string standardCampaignContributeMethodABI = "contributeMsgValue():(uint256 contributionID)";
  string standardCampaignPayoutMethodABI = "payoutToBeneficiary():(uint256 amountClaimed)";

  function test_standardCampaignDeploymentAndUse() {
    // build new user
    User user = new User();
    user.send(1000);

    // setup campaign data
    uint256 expiry = now + 1 weeks;
    uint256 fundingGoal = 1000;
    address beneficiary = address(user);

    // start new campaign
    target = StandardCampaign(user.newCampaign(campaignName, expiry, fundingGoal, beneficiary));
    assertEq(target.stage(), uint256(0));
    assertEq(target.amountRaised(), uint256(0));
    assertEq(target.fundingGoal(), fundingGoal);
    assertEq(target.expiry(), expiry);
    assertEq(target.beneficiary(), beneficiary);
    assertEq(target.totalContributions(), uint256(0));
    assertEq(target.owner(), address(user));

    // new contribution
    assertEq(user.newContribution(address(target), 250), uint256(0));
    assertEq(uint256(target.balance), uint256(250));
    assertEq(uint256(user.balance), uint256(750));

    // test everything again for varience
    assertEq(target.stage(), uint256(0));
    assertEq(target.fundingGoal(), fundingGoal);
    assertEq(target.expiry(), expiry);
    assertEq(target.beneficiary(), beneficiary);

    // expect varience from..
    assertEq(target.amountRaised(), uint256(250));
    assertEq(target.totalContributions(), uint256(1));

    // new contribution number 2
    assertEq(user.newContribution(address(target), 250), uint256(1));
    assertEq(uint256(target.balance), uint256(500));
    assertEq(uint256(user.balance), uint256(500));

    // test everything again for varience
    assertEq(target.stage(), uint256(0));
    assertEq(target.fundingGoal(), fundingGoal);
    assertEq(target.expiry(), expiry);
    assertEq(target.beneficiary(), beneficiary);

    // expect varience from..
    assertEq(target.amountRaised(), uint256(500));
    assertEq(target.totalContributions(), uint256(2));
  }
}
