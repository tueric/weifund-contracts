import "../Campaign.sol";
import "../Owner.sol";

contract StandardCampaign is Owner, Campaign {
  enum Stages {
    CrowdfundOperational,
    CrowdfundFailure,
    CrowdfundSuccess
  }

  modifier atStageOr(uint256 _stage) {
    if (now < expiry) {
      stage = uint256(Stages.CrowdfundOperational);
    } else if(expiry > now && amountRaised >= fundingGoal) {
      stage = uint256(Stages.CrowdfundSuccess);
    } else {
      stage = uint256(Stages.CrowdfundFailure);
    }

    if (stage != _stage) {
      throw;
    }
    _
  }

  function () {
    throw;
  }

  function contributeMsgValue() atStageOr(uint(Stages.CrowdfundOperational)) returns (uint256 contributionID) {
    contributionID = contributions.length++;
    contributions[contributionID] = Contribution({
        sender: msg.sender,
        value: msg.value,
        created: now
    });
    contributionsBySender[msg.sender].push(contributionID);
    amountRaised += msg.value;
    ContributionMade(msg.sender);
  }

  function payoutToBeneficiary() atStageOr(uint(Stages.CrowdfundSuccess)) returns (uint256 amountClaimed) {
    amountClaimed = this.balance;
    if (!beneficiary.send(amountClaimed)) {
      throw;
    }
    BeneficiaryPayoutClaimed(beneficiary, amountClaimed);
  }

  function StandardCampaign(string _name,
    uint256 _expiry,
    uint256 _fundingGoal,
    address _beneficiary) {
    name = _name;
    expiry = _expiry;
    fundingGoal = _fundingGoal;
    beneficiary = _beneficiary;
    owner = msg.sender;
  }

  function totalContributions() public constant returns (uint256 amount) {
    return contributions.length;
  }

  function totalContributionsBySender(address _sender) public constant returns (uint256 amount) {
    return contributionsBySender[_sender].length;
  }

  struct Contribution {
    address sender;
    uint256 value;
    uint256 created;
  }

  uint256 public stage;
  uint256 public fundingGoal;
  uint256 public amountRaised;
  uint256 public expiry;
  address public beneficiary;
  Contribution[] public contributions;
  mapping(address => uint256[]) public contributionsBySender;

  string public name;
  string public contributeMethodABI = "contributeMsgValue():(uint256 contributionID)";
  string public payoutMethodABI = "payoutToBeneficiary():(uint256 amountClaimed)";
}
