contract PrivateServiceRegistry {

  modifier isRegisteredService(address _service) {
    if (services[ids[_service]] != address(0) && _service != address(0)) {
      _
    }
  }

  function () {
    throw;
  }

  function register(address _service) internal returns (uint serviceId) {
    if (isService(_service)) {
      throw;
    }

    serviceId = services.length++;
    services[serviceId] = _service;
    ids[_service] = serviceId;
    ServiceRegistered(_service);
  }

  function isService(address _service) isRegisteredService(_service) constant public returns (bool) {
    return true;
  }

  address[] public services;
  mapping(address => uint) public ids;

  event ServiceRegistered(address _service);
}
