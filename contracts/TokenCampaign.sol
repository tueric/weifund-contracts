import "Campaign.sol";

contract TokenCampaign is Campaign {

  /// @notice the total amount of tokens owed to contributors
  /// @return A uint256 value of the tokens owned to contributors
  function totalTokensOwed() constant returns (uint256 amount) {}

  /// @notice the net total amount of tokens dispersed from the campaign contract
  /// @return A uint256 value of tokens dispersed
  function totalTokensDispersed() constant returns (uint256 amount) {}

  /// @notice the amount of tokens owed to the contributor
  /// @return A uint256 value of the total amount of tokens owned to the contributor
  function tokensOwnedTo(address _contributor) constant returns (uint256 amount) {}

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
