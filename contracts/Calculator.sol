contract Calculator {
  
  /// @notice call `calculateAmount` when determining token amount to be dispersed
  /// @param _txValue the transaction (msg.value) value contributed
  /// @param _txCreated when the transaction/contribution was created
  /// @return the amount of tokens to be dispered
  function calculateAmount(uint _txValue, uint _txCreated) public constant returns (uint amount);
}
