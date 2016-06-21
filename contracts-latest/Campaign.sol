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
      if(claimProxyAddress.send(amountRaised) == false){
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
      if(claimProxyAddress.send(contributions[msg.sender]) == false){
        throw;
      }
    } else {
      throw;
    }
  }

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
