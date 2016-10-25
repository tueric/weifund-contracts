import "dapple/test.sol";
import "StaffPicks.sol";
import "__tests__/MyTestFramework.sol";

contract TestableStaffPicks is StaffPicks {
  function TestableStaffPicks() {
    owner = msg.sender;
  }
}

contract StaffPicksTest is MyTestFramework {
  TestableStaffPicks staffPicks;
    
  function testPass_createStaffPicks() {
    staffPicks = new TestableStaffPicks();
    assert(address(staffPicks) != 0x0, "StaffPicks could not be instantiated");
  }
  
  function testPass_registerValidAddress() {
    testPass_createStaffPicks();
    
    staffPicks.register(0x01);
    assert(staffPicks.activePicks(0x01) == true, "StaffPicks could not register a valid address in activePicks");
    assert(staffPicks.pickedCampaigns(0) == 0x01, "StaffPicks did not place valid address in pickedCampaigns");
  }
  
  function testThrow_registerInvalidAddress() {
    testPass_registerValidAddress();
    
    staffPicks.register(0x0); 
    assert(staffPicks.activePicks(0x0) == true, "StaffPicks should not be able to register address 0x0 in activePicks");
    assert(staffPicks.pickedCampaigns(1) == 0x0, "StaffPicks should not be able to add 0x0 to pickedCampaigns");
    log("Staff picks successfully registered address 0x0 when it should not be able to");
  }

  function testPass_unregisterCampaign() {
    testPass_registerValidAddress();

    assert(staffPicks.activePicks(0x01) == true, "Expected setup for unregister not available");
    assert(staffPicks.pickedCampaigns(0) == 0x01, "Expected setup for campaign in pickedCampaigns is not available");
    staffPicks.unregister(0x01);
    assert(staffPicks.activePicks(0x01) == false, "Could not unregister campaign from activePicks");
    assert(staffPicks.pickedCampaigns(0) == 0x01, "Campaign that was previously in pickedCampaigns is no longer available");
  }
}
