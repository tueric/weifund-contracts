import "HumanStandardCampaign.sol";
import "IssuedToken.sol";

/// @title An example token issuance campaign
/// @author WeiFund <mail@weifund.io>
contract ExampleIssuedStandardTokenCampaign is HumanStandardCampaign {

  /*
   *  External contracts
   */
  IssuedToken issuedToken;
  address foundersAddress;

  /*
   *  Constants
   */
  uint constant CROWDFUNDING_PERIOD = 4 weeks;

  /*
   *  Human Properties
   */
  string public name = "Custom Token Issuance Campaign";
  string public contributeMethodABI = "contributeMsgValue(uint founderTokens)";

  /*
   *  Contract functions
   */
  /// @dev Allows to fund campaign in exchange for issued tokens.
  /// @param founderTokens Number of tokens created for founders.
  function contributeMsgValue(uint founderTokens) crowdfundHasNotExpired returns (bool) {
    uint backerTokens;
    // Value of tokens increases over time
    // For first two weeks ETH and GDT exchange 1:1
    if (now < expiry - (2 weeks)) {
      backerTokens = msg.value;
    }
    // For the following week value of GDT increases linearly
    else if (now < expiry - (3 weeks)) {
      backerTokens = msg.value * 100000 / (100000 + 50000 * (expiry - 2 weeks) / 1 weeks);
    }
    // For last week ETH and GDT exchange 1.5:1
    else {
      backerTokens = msg.value * 10 / 15;
    }
    // Cannot create more founder tokens than backer tokens
    if (backerTokens < founderTokens) {
      founderTokens = backerTokens;
    }
    if (!issuedToken.issueTokens(msg.sender, backerTokens) || !issuedToken.issueTokens(foundersAddress, founderTokens)) {
      throw;
    }

    ContributionMade(msg.sender);
    return true;
  }

  /// @dev Setup function sets external contracts' addresses.
  /// @param _beneficiary address.
  /// @param _foundersAddress founders address.
  /// @param _issuedTokenAddress token address.
  function setup(address _beneficiary, address _foundersAddress, address _issuedTokenAddress) onlyowner returns (bool) {
    if (beneficiary == 0 || foundersAddress == 0 || address(issuedToken) == 0) {
      beneficiary = _beneficiary;
      foundersAddress = _foundersAddress;
      issuedToken = IssuedToken(_issuedTokenAddress);
      return true;
    }
    return false;
  }

  /// @dev Contract constructor function sets expiry and the owner
  function ExampleIssuedStandardTokenCampaign() {
    expiry = now + CROWDFUNDING_PERIOD;
    owner = msg.sender;
  }
}
