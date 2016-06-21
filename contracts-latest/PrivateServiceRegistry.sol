contract PrivateServiceRegistry {
  address[] public services;
  mapping(address => uint) public ids;

  function register(address _service) private return (uint serviceId) {
    if(isService(_service)) throw;

    serviceId = services.length++;
    services[serviceId] = _service;
    ids[_service] = serviceId;
  }

  function isService(address _service) constant public returns (bool) {
    if(services[ids[_service]] != address(0) && _service != address(0)) {
      return true;
    }
  }
}
