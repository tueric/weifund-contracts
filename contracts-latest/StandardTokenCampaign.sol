import "Campaign.sol";
import "StandardToken.sol";

contract StandardTokenCampaign is Campaign {
  address public token;
  uint public tokenPrice;

  function StandardTokenCampaign(uint _expiry,
    uint _fundingGoal,
    address _beneficiary,
    uint _tokenPrice,
    address _token) {
    expiry = _expiry;
    fundingGoal = _fundingGoal;
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
