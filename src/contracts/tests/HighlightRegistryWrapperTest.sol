pragma solidity ^0.4.3;

import "HighlightRegistry.sol";

contract HighlightRegistryWrapper is HighlightRegistry {
    function HighlightRegistryWrapper () {
        owner = msg.sender;
    }
}
