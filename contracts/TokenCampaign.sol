import "Campaign.sol";

contract TokenCampaign is Campaign {

  /// @notice the latest time at which sender `_contributor` made a contribution
  /// @param _contributor The contributor address
  /// @return The latest time (specified as a uint256 unix timestamp) a contributor made a contribution
  function contributionCreated(address _contributor) constant returns (uint256 created) {}

  /// @notice get address of the dispersal calculator service contract used
  /// @return The dispersal calculator target address
  function calculator() constant returns (address target) {}

  /// @notice get address of the token service contract used
  /// @return The token service contract address
  function token() constant returns (address target) {}

  /// @notice send `tokenAmountClaimed` in tokens to `contributor` for pickup by contributor `msg.sender`
  /// @return The address of the `contributor` account and the `tokenAmountClaimed` by the contributor `msg.sender`
  function claimTokensOwed() returns (address contributor, uint256 tokenAmountClaimed);

  event TokensClaimed(address _contributor, uint256 _tokenAmountClaimed);
}
