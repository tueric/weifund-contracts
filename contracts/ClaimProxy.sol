import "owned.sol";

contract ClaimProxyInterface {
  function claimBalance();
}

contract ClaimProxy is owned {
  function ClaimProxy(address _owner) {
    owner = _owner;
  }

  function claimBalance() onlyowner {
    if(owner.send(this.balance)){
      suicide(owner);
    }
  }
}
