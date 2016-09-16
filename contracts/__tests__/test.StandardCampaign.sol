import "dapple/test.sol";
import "StandardCampaign.sol";

contract User {
  function newCampaign(string _name,
    uint256 _expiry,
    uint256 _fundingGoal,
    address _beneficiary) returns (address) {
    return address(new StandardCampaign(_name, _expiry, _fundingGoal, _beneficiary, address(this)));
  }

  function newTestableCampaign(string _name,
    uint256 _expiry,
    uint256 _fundingGoal,
    address _beneficiary) returns (address) {
    return address(new TestableStandardCampaign(_name, _expiry, _fundingGoal, _beneficiary, address(this)));
  }

  function newContribution(address _campaign, uint256 _value) returns (uint) {
    StandardCampaign target = StandardCampaign(_campaign);
    return target.contributeMsgValue.value(_value)();
  }
}

// A contract that can be used to extend an existing class with a given timestamp
contract TestableTimeElement {
  // timestamp that will hold an abstract timestamp
  uint public debug_timestamp;

  // retrieve the testing timestamp, this can be overwridden further by the testable class
  function getTime() public constant returns (uint) {
    return debug_timestamp;
  }
  // set the testing timestamp
 function setTime(uint timestamp) {
    debug_timestamp = timestamp;
  }
  // add an amount of time to the testing timestamp
  function addTime(uint time) {
    setTime(getTime() + time);
  }
}

contract TestableStandardCampaign is StandardCampaign {
  function TestableStandardCampaign(string _name,
    uint256 _expiry,
    uint256 _fundingGoal,
    address _beneficiary,
    address _owner) StandardCampaign(_name,
    _expiry,
    _fundingGoal,
    _beneficiary,
    _owner)
    {
  }

  function setExpiry(uint _expiry) {
    expiry = _expiry;
  }

  function addTimeToExpiry(uint _timeToAdd) {
    expiry = expiry + _timeToAdd;
  }

  function setFundingGoal(uint256 _fundingGoal) {
    fundingGoal = _fundingGoal;
  }
}

contract TestableStandardCampaignTest is Test {
  TestableStandardCampaign target;
  User user ;
  string campaignName = "TestableStandardCampaign test - modifiable Standard Campaign";
  string standardCampaignContributeMethodABI = "contributeMsgValue():(uint256 contributionID)";
  string standardCampaignPayoutMethodABI = "payoutToBeneficiary():(uint256 amountClaimed)";

  // there are 3 main cases dependent on expiry and funding goal
  // 1 - campaign still active - test contribution
  // 2 - campaign expired, goal reached - test payoutToBeneficiary, dependent on case 1
  // 3 - campaign expired, goal not reached - test claimRefundOwed, dependent on case 1
  function test_testableStandardCampaignDeploymentAndUse() {
    // build new user
    user = new User();
    user.send(1000);

    // setup campaign data
    uint256 expiry = now + 1 weeks;
    uint256 fundingGoal = 1000;
    address beneficiary = address(user);

    // start new campaign
    target = TestableStandardCampaign(user.newTestableCampaign(campaignName, expiry, fundingGoal, beneficiary));

    // test modifiable test class - expiry date
    assertEq(target.expiry(), expiry);
    target.setExpiry(0);
    assertEq(target.expiry(), 0);
    target.setExpiry(expiry);
    assertEq(target.expiry(), expiry);

    // test modifiable test class - funding goal
    assertEq(target.fundingGoal(), fundingGoal);
    target.setFundingGoal(0);
    assertEq(target.fundingGoal(), 0);
    target.setFundingGoal(fundingGoal);
    assertEq(target.fundingGoal(), fundingGoal);
  }

  function test_testableStandardCase1() {

    // prepare a testable campaign
    test_testableStandardCampaignDeploymentAndUse();

    // Case 1 - new contribution
    assertEq(user.newContribution(address(target), 250), uint256(0));
    assertEq(uint256(target.balance), uint256(250));
    assertEq(uint256(user.balance), uint256(750));

    // expect change in campaign amountraised and total contributions
    assertEq(target.amountRaised(), uint256(250));
    assertEq(target.totalContributions(), uint256(1));
  }

  // test case 2 - that a payout can occur if the campaign expires and reaches its funding goal
  function test_testableStandardCase2() {

    // prepare a testable campaign with a single contribution
    test_testableStandardCase1();

    // Case 2
    target.setExpiry(1);
    target.setFundingGoal(1);
    uint256 originalBeneficiaryBalance = target.beneficiary().balance;
    assertTrue(originalBeneficiaryBalance > 0);
    uint256 payout = target.payoutToBeneficiary();
    assertTrue(payout > 0);
    assertEq(payout, target.amountRaised());
    assertEq(target.balance, 0);
    assertEq(originalBeneficiaryBalance + target.amountRaised(), target.beneficiary().balance);        

  }

  // test case 3 - that a refund can occur if the campaign expires and does not reach its funding goal
  function test_testableStandardCase3() {

    // prepare a testable campaign with a single contribution
    test_testableStandardCase1();

    // Case 2
    target.setExpiry(1);
    target.setFundingGoal(1000000000);
    uint256 campaignOriginalBalance = target.balance;
    assertTrue(campaignOriginalBalance > 0);
    BalanceClaim balanceClaim = BalanceClaim(target.claimRefundOwed(0)); // we know that it is contribution id 0 because at this point there is exactly one contribution
    assertEq(balanceClaim.balance, campaignOriginalBalance);
    assertEq(target.balance, 0);

    // from here we can test balance claim
    // already tested in test.BalanceClaim.sol
  }

  // test - that no contribution is permitted if past expiry
  function test_testableContributionCaseExpectFailure() {

    // prepare a testable campaign
    test_testableStandardCampaignDeploymentAndUse();

    // expire the campaign with a funding goal that can be reached
    target.setExpiry(0);
    target.setFundingGoal(1);

    // attempt a contribution to the expired campaign, the following line fails
    user.newContribution(address(target), 250);

    // following should not be reached
    assertEq(target.balance, 0);

  }


  // test - that a payout is possible to execute even if no contribution was ever made
  function test_testablePayoutCaseShouldBeFailure() {
    // prepare a testable campaign
    test_testableStandardCampaignDeploymentAndUse();

    // ensure that the campaign has no money
    assertEq(target.amountRaised(), 0);
    assertEq(target.balance, 0);

    // expire the campaign
    target.setExpiry(1);
    // set the funding goal to zero
    target.setFundingGoal(0);

    // the following fails - is it due to the attempt to send 0 ether?
    // there should probably be a check in the campaign to payout if amountRaised is greater than zero
    uint256 payout = target.payoutToBeneficiary();
    assertEq(payout, 0);
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
