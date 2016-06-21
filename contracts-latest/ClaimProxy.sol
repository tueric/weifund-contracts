contract ClaimProxy {

  function ClaimProxy(address _implementor) {
    implementor = _implementor;
  }

  function claimBalance() {
    if(msg.sender == implementor) {
      if(implementor.send(this.balance) == false){
        throw;
      }
    }
  }

  address implementor;
}
