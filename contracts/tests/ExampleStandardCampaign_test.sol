import "dapple/test.sol";
import "examples/ExampleStandardCampaign.sol";

contract BeneficiaryProxy {
}

contract ContributorProxy {
  address campaign;

  function ContributorProxy(address _campaign) {
    campaign = _campaign;
  }

  function contributeToCampaign(uint _amount) {
    ExampleStandardCampaign(campaign).contributeMsgValue.value(_amount)();
  }
}

contract ExampleStandardCampaignTests is Test {
  ExampleStandardCampaign campaign;
  BeneficiaryProxy beneficiary;

  function setUp() {
    beneficiary = new BeneficiaryProxy();
  }

  function setupFreshCampaign() {
    // setup fresh campaign
    uint expiry = now + 3 weeks;
    campaign = new ExampleStandardCampaign(expiry, beneficiary);
  }

  function test_campaignProperties() {
    uint expiry = now + 3 weeks;
    campaign = new ExampleStandardCampaign(expiry, beneficiary);

    // expiry property is fine
    assertEq(campaign.expiry(), expiry);

    // expiry property is fine
    assertEq(campaign.beneficiary(), beneficiary);

    // expiry property is fine
    assertEq(campaign.fundingGoal(), uint(0));

    //string memory defaultContirbuteString = "contributeMsgValue()";

    // expiry property is fine
    //assertEq(campaign.contributeMethodABI(), defaultContirbuteString);
  }

  function setupContributionProxy(address _campaign) returns (address _proxyAddress) {
    _proxyAddress = address(new ContributorProxy(_campaign));
    _proxyAddress.send(500000);
  }

  function test_validCampaignContributions() {
    setupFreshCampaign();
    uint contributionAmount = 5000;
    ContributorProxy contributor1 = ContributorProxy(setupContributionProxy(address(campaign)));

    // test contribution amount
    assertEq(campaign.balance, uint(0));

    // send funds to campaign
    contributor1.contributeToCampaign(contributionAmount);

    // test contribution amount
    assertEq(campaign.balance, contributionAmount);
    assertEq(campaign.contributionBalances(address(contributor1)), contributionAmount);

    // send funds to campaign
    contributor1.contributeToCampaign(contributionAmount);

    // test contribution amount
    assertEq(campaign.balance, contributionAmount * 2);
    assertEq(campaign.contributionBalances(address(contributor1)), contributionAmount * 2);

    // send funds to campaign
    contributor1.contributeToCampaign(contributionAmount);

    // test contribution amount
    assertEq(campaign.balance, contributionAmount * 3);
    assertEq(campaign.contributionBalances(address(contributor1)), contributionAmount * 3);
  }

  function test_fallbackFunction() {
    setupFreshCampaign();

    // check balance
    assertEq(uint(campaign.balance), uint(0));

    // send ether to campaign via send method
    campaign.send(45060);

    // check balance
    assertEq(uint(campaign.balance), uint(0));

    // send more ether
    campaign.send(33932);

    // check balance
    assertEq(uint(campaign.balance), uint(0));

    // use call to send more ether
    campaign.call.value(39329)();

    // check balance
    assertEq(uint(campaign.balance), uint(0));
  }

  function testThrow_invalidEarlyCampaignPayout() {
    setupFreshCampaign();

    // setup contributor
    ContributorProxy contributor1 = ContributorProxy(setupContributionProxy(address(campaign)));

    // check beneficiary balance
    contributor1.contributeToCampaign(49484);

    // balance beneficiary should be zero
    assertEq(beneficiary.balance, uint(0));

    // attempt beneficiary payout
    address claimProxy = campaign.payoutToBeneficiary();

    // balance beneficiary should be zero
    assertEq(claimProxy.balance, uint(0));
  }

  function testThrow_invalidEarlyCampaignPayoutSpam() {
    setupFreshCampaign();

    // setup contributor
    ContributorProxy contributor1 = ContributorProxy(setupContributionProxy(address(campaign)));

    // check beneficiary balance
    contributor1.contributeToCampaign(49394);

    // balance beneficiary should be zero
    assertEq(beneficiary.balance, uint(0));

    // attempt beneficiary payout
    address claimProxy = campaign.payoutToBeneficiary();

    // balance beneficiary should be zero
    assertEq(claimProxy.balance, uint(0));

    // attempt beneficiary payout
    campaign.payoutToBeneficiary();

    // balance beneficiary should be zero
    assertEq(claimProxy.balance, uint(0));

    // attempt beneficiary payout
    campaign.payoutToBeneficiary();

    // balance beneficiary should be zero
    assertEq(claimProxy.balance, uint(0));

    // attempt beneficiary payout
    campaign.payoutToBeneficiary();

    // balance beneficiary should be zero
    assertEq(claimProxy.balance, uint(0));
  }

  function test_validCampaignPayout() {
    uint expiry = 0;
    uint campaignAmountRaised = 5000;
    campaign = new ExampleStandardCampaign(expiry, beneficiary);

    // setup contributor
    ContributorProxy contributor1 = ContributorProxy(setupContributionProxy(address(campaign)));

    // contribute to campaign
    contributor1.contributeToCampaign(campaignAmountRaised);

    // attempt beneficiary payout
    address claimProxy = campaign.payoutToBeneficiary();

    // balance beneficiary should be zero
    assertEq(claimProxy.balance, uint(campaignAmountRaised));
  }

  function test_validDoubleCampaignPayoutSpam() {
    uint expiry = 0;
    uint campaignAmountRaised = 5000;
    campaign = new ExampleStandardCampaign(expiry, beneficiary);

    // setup contributor
    ContributorProxy contributor1 = ContributorProxy(setupContributionProxy(address(campaign)));

    // contribute to campaign
    contributor1.contributeToCampaign(campaignAmountRaised);

    // attempt beneficiary payout
    address claimProxy = campaign.payoutToBeneficiary();

    // balance beneficiary should be zero
    assertEq(claimProxy.balance, uint(campaignAmountRaised));

    // contribute to campaign
    contributor1.contributeToCampaign(campaignAmountRaised);

    // attempt beneficiary payout
    address claimProxy2 = campaign.payoutToBeneficiary();

    // balance beneficiary should be zero
    assertEq(claimProxy2.balance, uint(campaignAmountRaised));
  }

  function test_validCampaignMultipleContributions() {
    setupFreshCampaign();
    uint contributionAmount = 3500;
    uint checkAmount = 0;

    // create several contributors
    ContributorProxy contributor1 = ContributorProxy(setupContributionProxy(address(campaign)));
    ContributorProxy contributor2 = ContributorProxy(setupContributionProxy(address(campaign)));
    ContributorProxy contributor3 = ContributorProxy(setupContributionProxy(address(campaign)));
    ContributorProxy contributor4 = ContributorProxy(setupContributionProxy(address(campaign)));
    ContributorProxy contributor5 = ContributorProxy(setupContributionProxy(address(campaign)));

    // send funds to campaign
    contributor1.contributeToCampaign(contributionAmount);
    checkAmount += contributionAmount;
    // send funds to campaign
    contributor2.contributeToCampaign(contributionAmount);
    checkAmount += contributionAmount;
    // send funds to campaign
    contributor3.contributeToCampaign(contributionAmount);
    checkAmount += contributionAmount;
    // send funds to campaign
    contributor4.contributeToCampaign(contributionAmount);
    checkAmount += contributionAmount;
    // send funds to campaign
    contributor2.contributeToCampaign(contributionAmount);
    checkAmount += contributionAmount;
    // send funds to campaign
    contributor4.contributeToCampaign(contributionAmount);
    checkAmount += contributionAmount;

    // send funds to campaign
    contributor3.contributeToCampaign(contributionAmount);
    checkAmount += contributionAmount;
    // send funds to campaign
    contributor5.contributeToCampaign(contributionAmount);
    checkAmount += contributionAmount;
    // send funds to campaign
    contributor3.contributeToCampaign(contributionAmount);
    checkAmount += contributionAmount;
    // send funds to campaign
    contributor2.contributeToCampaign(contributionAmount);
    checkAmount += contributionAmount;
    // send funds to campaign
    contributor2.contributeToCampaign(contributionAmount);
    checkAmount += contributionAmount;
    // send funds to campaign
    contributor1.contributeToCampaign(contributionAmount);
    checkAmount += contributionAmount;

    // check balance
    assertEq(campaign.balance, checkAmount);
  }
}
