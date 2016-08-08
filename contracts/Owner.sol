contract Owner {
  function Owner() {
    owner = msg.sender;
  }

  modifier onlyowner() {
    if (msg.sender == owner)
      _
  }

  address public owner;
}
