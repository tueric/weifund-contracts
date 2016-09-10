contract Owner {
  function Owner() {
    // set the owner as the sender, if owner constructor used
    owner = msg.sender;
  }

  modifier onlyowner() {
    // only allow a message sender than is the owner
    if (msg.sender == owner) {
      _
    }
  }

  address public owner;
}
