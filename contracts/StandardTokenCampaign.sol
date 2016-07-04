import "Campaign.sol";
import "StandardToken.sol";
import "DispersalCalculator.sol";

contract StandardTokenCampaignInterface {
  function claimTokensOwed() public returns (uint tokenAmountClaimed);
}

contract StandardTokenCampaign is StandardTokenCampaignInterface,Campaign {
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
    uint tokensToDisperse = dispersal.amount(msg.value, created);
    if(StandardToken(token).balanceOf(this) >= (tokensToDisperse + tokensToBeDispersed)
      && tokensToDisperse > 0) {
      if(Campaign.contributeMsgValue()){
        tokensOwed[msg.sender] = tokensToDisperse;
        tokensToBeDispersed += tokensToDisperse;
      }
    } else {
      throw;
    }
  }

  function claimTokensOwed() public returns (uint tokenAmountClaimed) {
    if(amountRaised >= fundingGoal
      && contributions[msg.sender].amount > 0
      && token != address(0)
      && !contributions[msg.sender].claimed) {
      contributions[msg.sender].claimed = true;

      if(StandardToken(token).transfer(msg.sender, tokensOwed[msg.sender])){
        TokensClaimed(tokenAmountClaimed, msg.sender);
      }
    } else {
      throw;
    }
  }

  event TokensClaimed(uint _tokenAmountClaimed, address _claimRecipient);

  mapping(address => uint) public tokensOwed;
  uint public tokensToBeDispersed;
  address public token;
  DispersalCalculator public dispersal;
}
