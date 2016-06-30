import "PrivateServiceRegistry.sol";
import "DispersalCalculator.sol";

contract DispersalCalculatorFactory is PrivateServiceRegistry {
  function createDispersalCalculator(uint[] _settings) returns (address dispersalCalculator) {
    dispersalCalculator = new DispersalCalculator(_settings);
    register(dispersalCalculator);
  }
}
