import "Owned.sol";

contract ClaimProxyInterface {
  /// @notice use `claimBalance` to selfdestruct this contract and claim all balance to the owner address
  function claimBalance();
}

contract ClaimProxy is Owned, ClaimProxyInterface {
  function ClaimProxy(address _owner) {
    owner = _owner;
  }

  function claimBalance() onlyowner {
    selfdestruct(owner);
  }
}
