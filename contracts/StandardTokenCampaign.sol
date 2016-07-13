import "TokenCampaign.sol";
import "StandardCampaign.sol";
import "Calculator.sol";
import "Token.sol";

contract StandardTokenCampaign is TokenCampaign, StandardCampaign {
  function () {
    throw;
  }

  function contributeMsgValue() {
    contributionCreated[msg.sender] = now;
    StandardCampaign.contributeMsgValue();
  }

  modifier senderContributionCreatedBeforeExpiry {
    if(contributionCreated[msg.sender] < expiry) {
      _
    }
  }

  function claimTokensOwed() reachedFundingGoal pastExpiry senderClaimNotMade senderContributionCreatedBeforeExpiry returns (address contributor, uint tokenAmountClaimed) {
    claimMade[msg.sender] = true;
    contributor = msg.sender;
    tokenAmountClaimed = calculator.calculateAmount(contributionBalances[contributor], contributionCreated[contributor]);
    if(token.transfer(contributor, tokenAmountClaimed)){
      TokensClaimed(contributor, tokenAmountClaimed);
    }
  }

  mapping(address => uint) public contributionCreated;
  Calculator calculator;
  Token token;
}
