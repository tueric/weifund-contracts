contract PrivateServiceRegistry {

  function register(address _service) internal returns (uint serviceId) {
    if(isService(_service)) throw;

    serviceId = services.length++;
    services[serviceId] = _service;
    ids[_service] = serviceId;
    ServiceRegistered(_service, serviceId);
  }

  function isService(address _service) constant public returns (bool) {
    if(services[ids[_service]] != address(0) && _service != address(0)) {
      return true;
    }
  }

  event ServiceRegistered(address _service, uint _serviceId);
  address[] public services;
  mapping(address => uint) public ids;
}
