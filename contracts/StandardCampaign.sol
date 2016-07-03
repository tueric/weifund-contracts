import "Campaign.sol";

contract StandardCampaign is Campaign {
  function StandardCampaign(uint _expiry, uint _fundingGoal, address _beneficiary) {
    expiry = _expiry;
    fundingGoal = _fundingGoal;
    beneficiary = _beneficiary;
    created = now;
    owner = msg.sender;
  }
}
