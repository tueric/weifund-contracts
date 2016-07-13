import "StandardTokenCampaign.sol";
import "Calculator.sol";
import "Token.sol";
import "Named.sol";

contract HumanStandardTokenCampaign is Named, StandardTokenCampaign {
  function HumanStandardTokenCampaign(string _name,
    address _token,
    address _dispersalCalculator,
    address _beneficiary,
    uint256 _fundingGoal,
    uint256 _expiry) {
    name = _name;
    beneficiary = _beneficiary;
    fundingGoal = _fundingGoal;
    expiry = _expiry;
    token = Token(_token);
    calculator = Calculator(_dispersalCalculator);
    owner = msg.sender;
  }
}
