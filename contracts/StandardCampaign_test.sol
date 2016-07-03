import "dapple/test.sol";
import "StandardCampaign.sol";
import "ClaimProxy.sol";

contract ContributorProxy {
  function contribute(address _campaign, uint _value) public {
    StandardCampaign(_campaign).contributeMsgValue.value(_value)();
  }

  function claimReward(address _claimProxy) public {
    ClaimProxy(_claimProxy).claimBalance();
  }
}

contract StandardCampaignTest is Test {
  StandardCampaign campaign;

  function test_campaignProperties() {
    uint expiry = now + 30 days;
    campaign = new StandardCampaign(expiry, 4500, msg.sender);
    assertEq(uint(campaign.expiry()), expiry);
    assertEq(uint(campaign.fundingGoal()), uint(4500));
    assertTrue(bool(campaign.beneficiary() == msg.sender));
    assertFalse(campaign.paidOut());
    assertEq(campaign.numContributors(), 0);
  }

  function test_validCampaignContributionViaFallback() {
    campaign = new StandardCampaign(now + 30 days, 4500, msg.sender);
    uint contributionValue = 500;
    campaign.call.gas(300000).value(contributionValue)();
    assertEq(campaign.balance, contributionValue);
    assertEq(campaign.amountRaised(), contributionValue);
    assertEq(campaign.numContributors(), 1);
  }

  function test_validCampaignContributionViaApi() {
    campaign = new StandardCampaign(now + 30 days, 4500, msg.sender);
    uint contributionValue = 1000;
    campaign.contributeMsgValue.value(contributionValue)();
    assertEq(campaign.balance, contributionValue);
    assertEq(campaign.amountRaised(), contributionValue);
    assertEq(campaign.numContributors(), 1);
  }

  function test_campaignNullContributionViaFallback() {
    campaign = new StandardCampaign(now + 30 days, 4500, msg.sender);
    uint contributionValue = 0;
    campaign.call.gas(300000).value(contributionValue)();
    assertEq(campaign.amountRaised(), contributionValue);
    assertEq(campaign.numContributors(), 0);
  }

  function test_campaignMultipleContributionsAndPayout() {
    ContributorProxy beneficiary = new ContributorProxy();
    campaign = new StandardCampaign(now + 30 days, 4500, address(beneficiary));
    assertTrue(campaign.contributeMsgValue.value(500)());
    address contributorAddress = campaign.contributors(0);
    assertEq(beneficiary.balance, 0);
    assertEq(campaign.numContributors(), 1);
    assertEq(campaign.contributions(contributorAddress), 500);
    assertEq(campaign.amountRaised(), 500);
    assertTrue(campaign.contributeMsgValue.value(3000)());
    assertEq(campaign.numContributors(), 1);
    assertEq(campaign.amountRaised(), 3500);
    assertEq(campaign.contributions(contributorAddress), 3500);
    ContributorProxy contributor2 = new ContributorProxy();
    address(contributor2).send(1000);
    contributor2.contribute(address(campaign), 1000);
    assertEq(contributor2.balance, 0);
    assertEq(campaign.numContributors(), 2);
    assertEq(campaign.amountRaised(), 4500);
    assertEq(campaign.contributions(address(contributor2)), 1000);
    address claimProxyAddress = campaign.payoutToBeneficiary();
    assertTrue(bool(claimProxyAddress != address(0)));
    assertEq(claimProxyAddress.balance, 4500);
    assertEq(beneficiary.balance, 0);
    beneficiary.claimReward(claimProxyAddress);
    assertEq(beneficiary.balance, 4500);
  }
}
