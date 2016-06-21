import "PreTransferredStandardToken.sol";
import "PrivateServiceRegistry.sol";

contract PreTransferredStandardTokenFactory is PrivateServiceRegistry {
  function createPreTransferredStandardToken(address _firstTransferRecipient, uint _totalSupply) public returns (address tokeAddress) {
    tokeAddress = new PreTransferredStandardToken(_firstTransferRecipient, _totalSupply);
    register(tokeAddress);
  }
}
