contract AssesmentRegistry {
  function register(address _service, uint256 _assesmentRanking, bytes _assesmentData) {
    if (assesments[msg.sender][_service].lastAssessed == 0) {
      serviceVettors[_service].push(msg.sender);
      servicesAssessedBy[msg.sender].push(_service);
    }

    assesments[msg.sender][_service] = Assesment({
      ranking: _assesmentRanking,
      data: _assesmentData,
      lastAssessed: now
    });
  }

  struct Assesment {
    uint256 ranking;
    bytes data;
    uint256 lastAssessed;
  }

  mapping(address => mapping(address => Assesment)) public assesments;
  mapping(address => address[]) public serviceVettors;
  mapping(address => address[]) public servicesAssessedBy;
}
