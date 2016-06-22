import "Campaign.sol";
import "StandardToken.sol";

contract StandardTokenCampaign is Campaign {

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

  function claimStandardTokensOwed() public returns (uint tokenAmountClaimed) {
    if(amountRaised > fundingGoal
      && contributions[msg.sender] > 0
      && token != address(0)
      && contributorMadeClaim[msg.sender] == false) {
      contributorMadeClaim[msg.sender] = true;
      tokenAmountClaimed = contibutions[msg.sender] * tokenPrice;
      StandardTokensClaimed(tokenAmountClaimed, msg.sender);

      StandardToken(token).transfer(msg.sender, tokenAmountClaimed);
    } else {
      throw;
    }
  }

  event StandardTokensClaimed(uint _tokenAmountClaimed, uint _claimRecipient);

  address public token;
  uint public tokenPrice;
}
