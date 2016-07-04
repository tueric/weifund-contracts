import "ClaimProxy.sol";
import "owned.sol";

contract CampaignInterface {
  function contributeMsgValue() public returns (bool contributionMade);
  function payoutToBeneficiary() public returns (address claimProxyAddress);
  function claimRefundOwed() public returns (address claimProxyAddress);
  function numContributors() constant public returns (uint);
}

contract Campaign is owned, CampaignInterface {
  function () {
    contributeMsgValue();
  }

  function contributeMsgValue() public returns (bool contributionMade) {
    if(msg.value > 0
      && amountRaised + msg.value <= fundingGoal
      && !paidOut) {
      if(contributions[msg.sender].amount == 0) {
        contributors.push(msg.sender);
      }
      uint valueContributed = msg.value;
      amountRaised += valueContributed;
      contributions[msg.sender] = Contribution({
        amount: contributions[msg.sender].amount + valueContributed,
        claimed: false,
        created: now
      });
      ContributionMade(msg.sender, valueContributed, amountRaised);
      return true;
    } else {
      throw;
    }
  }

  function payoutToBeneficiary () public returns (address claimProxyAddress) {
    if(amountRaised >= fundingGoal
      && paidOut == false) {
      paidOut = true;
      claimProxyAddress = address(new ClaimProxy(beneficiary));
      if(claimProxyAddress.send(amountRaised)){
        BeneficiaryPayoutClaimed(claimProxyAddress, amountRaised, beneficiary);
      } else {
        throw;
      }
    } else {
      throw;
    }
  }

  function claimRefundOwed() public returns (address claimProxyAddress) {
    if(amountRaised < fundingGoal
      && !paidOut
      && now > expiry
      && contributions[msg.sender].amount > 0
      && contributions[msg.sender].claimed == false) {
      contributions[msg.sender].claimed = true;
      claimProxyAddress = address(new ClaimProxy(msg.sender));
      uint refundAmount = contributions[msg.sender].amount;
      if(claimProxyAddress.send(refundAmount)){
        RefundClaimed(claimProxyAddress, refundAmount, msg.sender);
      } else {
        throw;
      }
    } else {
      throw;
    }
  }

  function numContributors() constant public returns (uint) {
    return contributors.length;
  }

  event ContributionMade (address _contributorAddress, uint _contributionAmount, uint _amountRaised);
  event BeneficiaryPayoutClaimed (address _claimProxyAddress, uint _payoutAmount, address _beneficiaryTarget);
  event RefundClaimed (address _claimProxyAddress, uint _refundAmount, address _refundTarget);

  struct Contribution {
    uint amount;
    bool claimed;
    uint created;
  }

  uint public expiry;
  uint public created;
  uint public amountRaised;
  uint public fundingGoal;
  bool public paidOut;
  address public beneficiary;
  address[] public contributors;
  mapping(address => Contribution) public contributions;
}
