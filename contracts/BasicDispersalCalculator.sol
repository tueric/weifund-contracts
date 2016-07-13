import "Calculator.sol";

contract BasicDispersalCalculator is Calculator {
  function BasicDispersalCalculator(uint _expiry, uint _multiplier, uint _divisor) {
    expiry = _expiry;
    multiplier = _multiplier;
    divisor = _divisor;
  }

  function calculateAmount(uint _txValue, uint _txCreated) public constant returns (uint amount) {
    if(expiry <= now) {
      return _txValue * multiplier / divisor;
    }
  }

  uint public expiry;
  uint public multiplier;
  uint public divisor;
}
