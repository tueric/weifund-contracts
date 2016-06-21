import "StandardToken.sol";

contract PreTransferredStandardToken is StandardToken {

  function PreTransferredStandardToken(address _firstTransferRecipient, uint _totalSupply) {
    balances[_firstTransferRecipient] = _totalSupply;
    totalSupply = _totalSupply;
  }
}
