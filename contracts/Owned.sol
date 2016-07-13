contract Owned {
  function Owned() {
    owner = msg.sender;
  }

  modifier onlyowner() {
    if (msg.sender == owner)
      _
  }

  address public owner;
}
