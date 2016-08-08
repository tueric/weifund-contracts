import "Owner.sol";

contract BalanceClaimInterface {
  /// @notice use `claimBalance` to selfdestruct this contract and claim all balance to the owner address
  function claimBalance();
}

contract BalanceClaim is Owner, BalanceClaimInterface {
  function BalanceClaim(address _owner) {
    owner = _owner;
  }

  function claimBalance() onlyowner {
    selfdestruct(owner);
  }
}
