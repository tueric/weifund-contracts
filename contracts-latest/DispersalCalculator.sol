contract DispersalCalculatorInterface {
  function amount(uint _weiValue) returns (uint dispersalAmount) {}
}

contract DispersalCalculator is DispersalCalculatorInterface {
  function DispersalCalculator(uint _expiry, uint _multiplier, uint _divisor) {
    expiry = _expiry;
    multiplier = _multiplier;
    divisor = _divisor;
  }

  function amount(uint _weiValue) returns (uint dispersalAmount) {
    if(expiry <= now) {
      return _weiValue * multiplier / divisor;
    }
  }

  uint public expiry;
  uint public multiplier;
  uint public divisor;
}
