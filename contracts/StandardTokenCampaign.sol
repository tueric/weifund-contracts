import "TokenCampaign.sol";
import "StandardCampaign.sol";
import "Calculator.sol";
import "Token.sol";

contract StandardTokenCampaign is TokenCampaign, StandardCampaign {
  modifier beforeExpiry {
    if(now < expiry) {
      _
    }
  }

  function contributeMsgValue() beforeExpiry {
    uint dispersalAmount = calculator.calculateAmount(msg.value, now);

    if(token.balanceOf(address(this)) >= (dispersalAmount + totalTokensOwed)) {
      totalTokensOwed += dispersalAmount;
      tokensOwed[msg.sender] += dispersalAmount;
      StandardCampaign.contributeMsgValue();
    }
  }

  function claimTokensOwed() reachedFundingGoal pastExpiry senderClaimNotMade returns (address contributor, uint tokenAmountClaimed) {
    claimMade[msg.sender] = true;
    contributor = msg.sender;
    if(msg.sender == owner) {
      tokenAmountClaimed = token.balanceOf(address(this)) + tokensOwed[msg.sender] - totalTokensOwed - totalTokensDispersed;
    } else {
      tokenAmountClaimed = tokensOwed[msg.sender];
    }
    totalTokensDispersed += tokenAmountClaimed;
    if(token.transfer(contributor, tokenAmountClaimed)){
      TokensClaimed(contributor, tokenAmountClaimed);
    }
  }

  function tokensOwedTo(address _contributor) constant returns (uint256 amount) {
    return tokensOwed[_contributor];
  }

  Token token;
  Calculator calculator;
  mapping(address => uint) tokensOwed;
  uint public totalTokensOwed;
  uint public totalTokensDispersed;
}
