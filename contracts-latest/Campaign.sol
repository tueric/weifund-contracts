import "StandardToken.sol";
import "ClaimProxy.sol";

contract Campaign {
  uint public goal;
  uint public expiry;
  uint public creator;
  uint public created;
  uint public amountRaised;
  uint public fundingGoal;
  bool public paidOut;
  address public beneficiary;
  address[] public contributors;
  mapping(address => uint) public contributions;
  mapping(address => bool) public contributorMadeClaim;

  function Campaign(uint _goal, uint _expiry, uint _created, uint _amountRaised, uint _fundingGoal, uint _paidOut, address _beneficiary) {
    goal = _goal;
    expiry = _expiry;
    created = _created;
    tokenPrice = _tokenPrice;
    amountRaised = _amountRaised;
    fundingGoal = _fundingGoal;
    paidOut = _paidOut;
    beneficiary = _beneficiary;
    created = now;
    creator = msg.sender;
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
      claimProxyAddress.send(amountRaised);
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
      claimProxyAddress.send(contributions[msg.sender]);
    } else {
      throw;
    }
  }
}
