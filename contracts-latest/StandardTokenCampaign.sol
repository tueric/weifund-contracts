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
    creator = msg.sender;
    token = _token;
    dispersal = DispersalCalculator(_dispersalCalculator);
  }

  function () {
    if(StandardToken(token).balanceOf(this) >= fundingGoal * tokenPrice) {
      contributeMsgValue();
    }
  }

  function claimStandardTokensOwed() public returns (uint tokenAmountClaimed) {
    if(amountRaised >= fundingGoal
      && contributions[msg.sender] > 0
      && token != address(0)
      && contributorMadeClaim[msg.sender] == false) {
      contributorMadeClaim[msg.sender] = true;
      tokenAmountClaimed = dispersal.amount(contibutions[msg.sender]);

      if(StandardToken(token).transfer(msg.sender, tokenAmountClaimed)){
        StandardTokensClaimed(tokenAmountClaimed, msg.sender);
      }
    } else {
      throw;
    }
  }

  event StandardTokensClaimed(uint _tokenAmountClaimed, uint _claimRecipient);

  address public token;
  DispersalCalculator public dispersal;
}
