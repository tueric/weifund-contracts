import "Campaign.sol";
import "ClaimProxy.sol";
import "Owned.sol";

contract StandardCampaign is Owned, Campaign {
  // assume default standard campaign contribute msg value abi
  string public contributeMethodABI = "contributeMsgValue()";

  /// @dev Fallback function always fails.
  function () {
    throw;
  }

  /*
   *  Modifiers
   */
  modifier crowdfundHasNotExpired() {
    // Check crowdfunding is not over.
    if (now < expiry) {
      throw;
    }
    _
  }

  modifier crowdfundHasExpired() {
    // Check crowdfunding period is over.
    if (now > expiry) {
      throw;
    }
    _
  }

  modifier crowdfundHasReachedFundingGoal() {
    // Check if crowdfund has reached it's funding goal
    if (this.balance > fundingGoal) {
      throw;
    }
    _
  }

  /// @dev Allows to withdraw funding to beneficiary ClaimProxy contract after campaign expires
  function payoutToBeneficiary() crowdfundHasExpired returns (address claimProxy) {
    claimProxy = address(new ClaimProxy(beneficiary));
    BeneficiaryPayoutClaimed(claimProxy, this.balance);
    if(!claimProxy.send(this.balance)) {
      throw;
    }
  }
}
