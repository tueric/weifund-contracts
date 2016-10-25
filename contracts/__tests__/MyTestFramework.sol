import "dapple/test.sol";

contract MyTestFramework is Test {
    function assert(bool what, bytes error) {
      if(!what) {
        fail(error);
      }
    }
    function fail(bytes error) {
      logs(error);
      fail();
    }
    function log(bytes msg) {
      logs(msg);
    }
    function log(bytes msg, uint i) {
      logs(msg);
      log_named_uint("val:", i);
    }
}
