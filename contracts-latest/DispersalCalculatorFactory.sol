import "PrivateServiceRegistry.sol";
import "DispersalCalculator.sol";

contract DispersalCalculatorFactory is PrivateServiceRegistry {
  function createDispersalCalculator(uint _expiry, uint _multiplier, uint _divisor) returns (address dispersalCalculator) {
    dispersalCalculator = new DispersalCalculator(_expiry, _multiplier, _divisor);
    register(dispersalCalculator);
  }
}
