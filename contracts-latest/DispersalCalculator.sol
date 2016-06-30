contract DispersalCalculatorInterface {
  function amount(uint _weiValue) returns (uint dispersalAmount) {}
}

contract DispersalCalculator is DispersalCalculatorInterface {
  function DispersalCalculator(uint[] _settings) {
    settings = _settings;
  }

  enum Dispersal {
    Expiry,
    Multiplier,
    Divisor
  }

  function amount(uint _weiValue) returns (uint dispersalAmount) {
    if(settings[uint(Dispersal.Expiry)] <= now) {
      return _weiValue * settings[uint(Dispersal.Multiplier)] / settings[uint(Dispersal.Divisor)];
    }
  }

  uint[] settings;
}
