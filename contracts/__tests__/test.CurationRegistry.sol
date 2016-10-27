import "dapple/test.sol";
import "CurationRegistry.sol";
import "__tests__/MyTestFramework.sol";

contract TestCurationRegistry is MyTestFramework, CurationRegistryEvents {
  CurationRegistry curationRegistry;
  
  function testPass_createCurationRegistry() {
    curationRegistry = new CurationRegistry();
    assert(address(curationRegistry) != 0x0, "Could not instantiate curationRegistry");
  }

  function testPass_approveService() {
    testPass_createCurationRegistry();

    expectEventsExact(curationRegistry);
    
    curationRegistry.approve(0x01);

    CampaignApproved(address(this), 0x01);
  }

  function testPass_curatorIdOf() {
    testPass_approveService();

    assert(curationRegistry.curatorIDOf(address(this)) == 0, "Did not get expected curator id zero for this testing class");
  }

  function testPass_curatorAddressOf() {
    testPass_curatorIdOf();

    assert(curationRegistry.curatorAddressOf(0) == address(this), "CurationRegistry does not have testing class address at the correct index, expected this address to have id zero");
    assert(curationRegistry.curatorAddressOf(curationRegistry.curatorIDOf(address(this))) == address(this), "CurationRegistry does not have testing class address at the correct index");
  }

  function testPass_serviceApprovedBy() {
    testPass_curatorAddressOf();

    assert(curationRegistry.serviceApprovedBy(address(this), 0x01) == true, "Could not verify that the 0x01 service was approved by this testing contract");
  }

  function testPass_serviceAddressOf() {
    fail("No method in CurationRegistry that returns approval id in order to verify that the method serviceAddressOf(address _curator, uint _approvalID) is correct");
  }

}