contract PrivateServiceRegistryInterface {

  /// @notice call `register` to register the service contract
  /// @param _service the address of the service contract
  /// @return the newly created uint256 id value of the service
  function register(address _service) internal returns (uint256 serviceId);

  /// @notice call `isService` to determine if the contract in question registered
  /// @param _service the address of the service contract
  /// @return a bool value stating whether the service was registered by the contract or not
  function isService(address _service) constant public returns (bool registered);

  /// @notice call `idOf` to determine the ID of the registered service
  /// @param _service the address of the service contract
  /// @return a uint256 value stating the ID of the registered service
  function idOf(address _service) constant public returns (uint256 id);

  /// @notice call `addressOf` to determine the service contract address
  /// @param _serviceId the address of the service contract
  /// @return the service contract address if any
  function addressOf(uint256 _serviceId) constant public returns (address service);

  event ServiceRegistered(address _service, uint256 _serviceId);
}

contract PrivateServiceRegistry is PrivateServiceRegistryInterface {

  function register(address _service) internal returns (uint256 serviceId) {
    if(isService(_service)) {
      throw;
    }

    serviceId = services.length++;
    services[serviceId] = _service;
    ids[_service] = serviceId;
    ServiceRegistered(_service, serviceId);
  }

  function isService(address _service) constant public returns (bool registered) {
    if(services[ids[_service]] != address(0) && _service != address(0)) {
      return true;
    }
  }

  function idOf(address _service) constant public returns (uint256 id) {
    return ids[_service];
  }

  function addressOf(uint256 _serviceId) constant public returns (address service) {
    return services[_serviceId];
  }

  address[] services;
  mapping(address => uint256) ids;
}
