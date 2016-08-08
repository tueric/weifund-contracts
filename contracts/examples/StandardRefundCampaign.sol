import "examples/StandardCampaign.sol";
import "../BalanceClaim.sol";

contract StandardRefundCampaign is StandardCampaign {

  modifier validRefundClaim(uint256 _contributionID) {
    Contribution refundContribution = contributions[_contributionID];

    if(refundsClaimed[_contributionID] // refund is not claimed
      && refundContribution.sender == msg.sender){ // refund contributor
      throw;
    }
    _
  }

  function claimRefundOwed(uint256 _contributionID) atStageOr(uint(Stages.CrowdfundFailure)) validRefundClaim(_contributionID) returns (address balanceClaim) {
    Contribution refundContribution = contributions[_contributionID];
    balanceClaim = address(new BalanceClaim(refundContribution.sender));
    if (balanceClaim.send(refundContribution.value)){
      refundsClaimed[_contributionID] = true;
      RefundPayoutClaimed(balanceClaim, refundContribution.value);
    } else {
      throw;
    }
  }

  mapping(uint256 => bool) public refundsClaimed;
  string public refundMethodABI = "claimRefundOwed(uint256 _contributionID):(address balanceClaim)";
}
