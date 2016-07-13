import "Campaign.sol";
import "ClaimProxy.sol";
import "Owned.sol";

contract StandardCampaign is Owned, Campaign {
  function () {
    throw;
  }

  modifier reachedFundingGoal {
    if(this.balance >= fundingGoal) {
      _
    }
  }

  modifier pastExpiry {
    if(now > expiry) {
      _
    }
  }

  modifier unreachedFundingGoal {
    if(this.balance < fundingGoal) {
      _
    }
  }

  modifier senderClaimNotMade {
    if(claimMade[msg.sender] == false) {
      _
    }
  }

  function contributeMsgValue() {
    contributionBalances[msg.sender] += msg.value;
    ContributionMade(msg.sender);
  }

  function payoutToBeneficiary() reachedFundingGoal pastExpiry returns (address claimProxy) {
    paidOut = true;
    claimProxy = address(new ClaimProxy(beneficiary));
    BeneficiaryPayoutClaimed(claimProxy, this.balance);
    if(!claimProxy.send(this.balance)) {
      throw;
    }
  }

  function claimRefundOwed() unreachedFundingGoal senderClaimNotMade pastExpiry returns (address claimProxy, uint refundAmount) {
    claimMade[msg.sender] = true;
    claimProxy = address(new ClaimProxy(msg.sender));
    refundAmount = contributionBalances[msg.sender];
    if(!claimProxy.send(refundAmount)) {
      throw;
    }
    ContributorRefundClaimed(claimProxy, refundAmount, msg.sender);
  }

  function amountContributedBy(address _contributor) constant returns (uint amountContributed) {
    return contributionBalances[_contributor];
  }

  function claimMadeBy(address _contributor) constant returns (bool claimWasMade) {
    return claimMade[_contributor];
  }

  address public beneficiary;
  uint public fundingGoal;
  bool public paidOut;
  uint public expiry;
  mapping(address => uint) contributionBalances;
  mapping(address => bool) claimMade;
}
