import "Campaign.sol";
import "StandardToken.sol";
import "ClaimProxy.sol";

contract StandardTokenCampaign is Campaign {
  address public token;
  uint public tokenPrice;

  function StandardTokenCampaign(uint _goal, uint _expiry, uint _created, uint _amountRaised, uint _fundingGoal, uint _paidOut, uint _tokenPrice, address _beneficiary, address _token) {
    goal = _goal;
    expiry = _expiry;
    created = _created;
    amountRaised = _amountRaised;
    fundingGoal = _fundingGoal;
    paidOut = _paidOut;
    beneficiary = _beneficiary;
    created = now;
    creator = msg.sender;
    token = _token;
    tokenPrice = _tokenPrice;
  }

  function () {
    if(StandardToken(token).balanceOf(this) >= fundingGoal * tokenPrice) {
      contributeMsgValue();
    }
  }

  function payoutToBeneficiary() public returns (address claimProxyAddress) {
    if(StandardToken(token).balanceOf(this) >= fundingGoal * tokenPrice) {
      return Campaign.payoutToBeneficiary();
    }
  }

  function claimStandardTokensOwed() public returns (uint tokensIssuedToContributor) {
    if(amountRaised > fundingGoal
    && contributions[msg.sender] > 0
    && token != address(0)
    && contributorMadeClaim[msg.sender] == false) {
      contributorMadeClaim[msg.sender] = true;
      tokensIssuedToContributor = contibutions[msg.sender] * tokenPrice;
      StandardToken(token).transfer(msg.sender, tokensIssuedToContributor);
    } else {
      throw;
    }
  }
}
