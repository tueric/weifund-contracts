import "StandardToken.sol";
import "IssuedToken.sol";
import "Owned.sol";

contract IssuedStandardToken is Owned, IssuedToken, StandardToken {
  function issueTokens(address _recipient, uint _amount) onlyowner returns (bool tokensIssued) {
    balances[_recipient] = _amount;
    totalSupply += _amount;
  }
}
