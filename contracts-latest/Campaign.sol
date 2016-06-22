import "StandardToken.sol";
import "ClaimProxy.sol";
import "owned.sol";

contract Campaign is owned {

  function Campaign(uint _expiry, uint _fundingGoal, address _beneficiary) {
    expiry = _expiry;
    fundingGoal = _fundingGoal;
    beneficiary = _beneficiary;
    created = now;
    owner = msg.sender;
  }

  function () {
    contributeMsgValue();
  }

  function contributeMsgValue() private {
    if(msg.value > 0
      && amountRaised < fundingGoal
      && amountRaised + msg.value < fundingGoal
      && paidOut == false) {
      if(contributions[msg.sender] == 0) {
        contributors.push(msg.sender);
      }

      amountRaised += msg.value;
      contributions[msg.sender] = msg.value;
      ContributionMade(msg.sender, msg.value, amountRaised);
    } else {
      throw;
    }
  }

  function payoutToBeneficiary () public returns (address claimProxyAddress) {
    if(amountRaised >= fundingGoal
      && msg.sender == beneficiary
      && paidOut == false) {
      paidOut = true;
      address claimProxyAddress = new ClaimProxy(beneficiary);
      if(claimProxyAddress.send(amountRaised)){
        BeneficiaryPayout(claimProxyAddress, amountRaised, beneficiary);
      } else {
        throw;
      }
    } else {
      throw;
    }
  }

  function claimRefundOwed () public returns (address claimProxyAddress) {
    if(amountRaised < fundingGoal
      && paidOut != true
      && now > expiry
      && contributions[msg.sender] > 0
      && contributorMadeClaim[msg.sender] == false) {
      contributorMadeClaim[msg.sender] = true;
      address claimProxyAddress = new ClaimProxy(msg.sender);
      uint refundAmount = contributions[msg.sender];
      if(claimProxyAddress.send(refundAmount)){
        RefundClaimed(claimProxyAddress, refundAmount, msg.sender);
      } else {
        throw;
      }
    } else {
      throw;
    }
  }

  event ContributionMade (address _contributorAddress, uint _contributionAmount, uint _amountRaised);
  event BeneficiaryPayoutClaimed (address _claimProxyAddress, uint _payoutAmount, address _beneficiaryTarget);
  event RefundClaimed (address _claimProxyAddress, uint _refundAmount, address _refundTarget);

  uint public expiry;
  uint public owner;
  uint public created;
  uint public amountRaised;
  uint public fundingGoal;
  bool public paidOut;
  address public beneficiary;
  address[] public contributors;
  mapping(address => uint) public contributions;
  mapping(address => bool) public contributorMadeClaim;
}
