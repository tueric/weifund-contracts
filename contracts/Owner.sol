contract Owner {
  function Owner() {
    owner = msg.sender;
  }

  modifier onlyowner() {
    if (msg.sender != owner)
      throw;

    _
  }

  address public owner;
}
