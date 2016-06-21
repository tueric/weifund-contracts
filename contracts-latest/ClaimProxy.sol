contract ClaimProxy {
  address implementor;

  function ClaimProxy(address _implementor) {
    implementor = _implementor;
  }

  function claimBalance() {
    if(msg.sender == implementor) {
      implementor.send(this.balance);
    }
  }
}
