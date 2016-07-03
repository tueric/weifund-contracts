import "dapple/test.sol";
import "StandardTokenCampaignFactory.sol";
import "HumanStandardTokenFactory.sol";

contract StandardTokenCampaignTest is Test {
  HumanStandardTokenFactory tokenFactory;
  StandardTokenCampaignFactory campaignFactory;

  function setUp() {
    tokenFactory = new HumanStandardTokenFactory();
    campaignFactory = new StandardTokenCampaignFactory();
  }
}
