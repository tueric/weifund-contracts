contract Campaign {

  /// @notice use to determine the beneficiary destination for the campaign
  /// @return the beneficiary address that will receive the campaign payout
  function beneficiary() constant returns(address) {}

  /// @notice the time at which the campaign fails or succeeds
  /// @return the uint unix timestamp at which time the campaign expires
  function expiry() constant returns(uint256 timestamp) {}

  /// @notice the goal the campaign must reach in order for it to succeed
  /// @return the campaign funding goal specified in wei as a uint256
  function fundingGoal() constant returns(uint256 amount) {}

  /// @notice was the campaign proceedes paid out to the beneficiary
  /// @return a bool value that specifies whether the campaign was paid out or not
  function paidOut() constant returns(bool successfully) {}

  /// @notice the amount contributed by a contributor specified in wei
  /// @return a uint256 value that specifies the amount of ether sent by a single contributor
  function amountContributedBy(address _contributor) constant returns (uint256 amountContributed);

  /// @notice has the contributor claimed their refund or reward
  /// @return a bool value: did the contributor make thier reward/refund claim or not
  function claimMadeBy(address _contributor) constant returns (bool claimWasMade);

  /// @notice the main campaign contribution method
  function contributeMsgValue();

  /// @notice payout the campaign contract balance to the beneficiary via a ClaimProxy contract
  /// @return the address of the ClaimProxy contract, that the beneficiary can claim the funds from
  function payoutToBeneficiary() returns (address claimProxy);

  /// @notice claim the refund owed to the msg.sender address via a claim proxy
  /// @return the address of the newly created ClaimProxy at which the funds are made available and the amount refunded to the ClaimProxy contract
  function claimRefundOwed() returns (address claimProxy, uint256 refundAmount);

  event ContributionMade (address _contributor);
  event BeneficiaryPayoutClaimed (address _claimProxy, uint256 _payoutAmount);
  event ContributorRefundClaimed (address _claimProxy, uint256 _refundAmount, address _contributor);
}
