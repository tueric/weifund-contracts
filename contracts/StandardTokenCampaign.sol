import "Campaign.sol";
import "StandardToken.sol";
import "DispersalCalculator.sol";

contract StandardTokenCampaign is Campaign {
  function StandardTokenCampaign(uint _expiry,
    uint _fundingGoal,
    address _beneficiary,
    address _dispersalCalculator,
    address _token) {
    expiry = _expiry;
    fundingGoal = _fundingGoal;
    beneficiary = _beneficiary;
    created = now;
    owner = msg.sender;
    token = _token;
    dispersal = DispersalCalculator(_dispersalCalculator);
  }

  function contributeMsgValue() public returns (bool contributionMade) {
    if(StandardToken(token).balanceOf(this) >= dispersal.amount(fundingGoal)) {
      return Campaign.contributeMsgValue();
    } else {
      throw;
    }
  }

  function claimStandardTokensOwed() public returns (uint tokenAmountClaimed) {
    if(amountRaised >= fundingGoal
      && contributions[msg.sender] > 0
      && token != address(0)
      && contributorMadeClaim[msg.sender] == false) {
      contributorMadeClaim[msg.sender] = true;
      tokenAmountClaimed = dispersal.amount(contributions[msg.sender]);

      if(StandardToken(token).transfer(msg.sender, tokenAmountClaimed)){
        StandardTokensClaimed(tokenAmountClaimed, msg.sender);
      }
    } else {
      throw;
    }
  }

  event StandardTokensClaimed(uint _tokenAmountClaimed, address _claimRecipient);

  address public token;
  DispersalCalculator public dispersal;
}
