'use strict';

// For geth
if (typeof dapple === 'undefined') {
  var dapple = {};
}

if (typeof web3 === 'undefined' && typeof Web3 === 'undefined') {
  var Web3 = require('web3');
}

dapple['weifund-contracts'] = (function builder () {
  var environments = {};

  function ContractWrapper (headers, _web3) {
    if (!_web3) {
      throw new Error('Must supply a Web3 connection!');
    }

    this.headers = headers;
    this._class = _web3.eth.contract(headers.interface);
  }

  ContractWrapper.prototype.deploy = function () {
    var args = new Array(arguments);
    args[args.length - 1].data = this.headers.bytecode;
    return this._class.new.apply(this._class, args);
  };

  var passthroughs = ['at', 'new'];
  for (var i = 0; i < passthroughs.length; i += 1) {
    ContractWrapper.prototype[passthroughs[i]] = (function (passthrough) {
      return function () {
        return this._class[passthrough].apply(this._class, arguments);
      };
    })(passthroughs[i]);
  }

  function constructor (_web3, env) {
    if (!env) {
      env = {};
    }
    while (typeof env !== 'object') {
      if (!(env in environments)) {
        throw new Error('Cannot resolve environment name: ' + env);
      }
      env = environments[env];
    }

    if (typeof _web3 === 'undefined') {
      if (!env.rpcURL) {
        throw new Error('Need either a Web3 instance or an RPC URL!');
      }
      _web3 = new Web3(new Web3.providers.HttpProvider(env.rpcURL));
    }

    this.headers = {
      'BasicDispersalCalculator': {
        'interface': [
          {
            'constant': true,
            'inputs': [],
            'name': 'multiplier',
            'outputs': [
              {
                'name': '',
                'type': 'uint256'
              }
            ],
            'type': 'function'
          },
          {
            'constant': true,
            'inputs': [],
            'name': 'divisor',
            'outputs': [
              {
                'name': '',
                'type': 'uint256'
              }
            ],
            'type': 'function'
          },
          {
            'constant': true,
            'inputs': [
              {
                'name': '_txValue',
                'type': 'uint256'
              },
              {
                'name': '_txCreated',
                'type': 'uint256'
              }
            ],
            'name': 'calculateAmount',
            'outputs': [
              {
                'name': 'amount',
                'type': 'uint256'
              }
            ],
            'type': 'function'
          },
          {
            'constant': true,
            'inputs': [],
            'name': 'expiry',
            'outputs': [
              {
                'name': '',
                'type': 'uint256'
              }
            ],
            'type': 'function'
          },
          {
            'inputs': [
              {
                'name': '_expiry',
                'type': 'uint256'
              },
              {
                'name': '_multiplier',
                'type': 'uint256'
              },
              {
                'name': '_divisor',
                'type': 'uint256'
              }
            ],
            'type': 'constructor'
          }
        ],
        'bytecode': '60606040526040516060806101a3833981016040528080519060200190919080519060200190919080519060200190919050505b8260006000508190555081600160005081905550806002600050819055505b505050610140806100636000396000f360606040526000357c0100000000000000000000000000000000000000000000000000000000900480631b3ed7221461005a5780631f2dc5ef1461007d578063cbcd5582146100a0578063e184c9be146100d557610058565b005b61006760048050506100f8565b6040518082815260200191505060405180910390f35b61008a6004805050610101565b6040518082815260200191505060405180910390f35b6100bf600480803590602001909190803590602001909190505061010a565b6040518082815260200191505060405180910390f35b6100e26004805050610137565b6040518082815260200191505060405180910390f35b60016000505481565b60026000505481565b600042600060005054111515610130576002600050546001600050548402049050610131565b5b92915050565b6000600050548156'
      },
      'Calculator': {
        'interface': [
          {
            'constant': true,
            'inputs': [
              {
                'name': '_txValue',
                'type': 'uint256'
              },
              {
                'name': '_txCreated',
                'type': 'uint256'
              }
            ],
            'name': 'calculateAmount',
            'outputs': [
              {
                'name': 'amount',
                'type': 'uint256'
              }
            ],
            'type': 'function'
          }
        ],
        'bytecode': ''
      },
      'Campaign': {
        'interface': [
          {
            'constant': true,
            'inputs': [
              {
                'name': '_contributor',
                'type': 'address'
              }
            ],
            'name': 'claimMadeBy',
            'outputs': [
              {
                'name': 'claimWasMade',
                'type': 'bool'
              }
            ],
            'type': 'function'
          },
          {
            'constant': true,
            'inputs': [],
            'name': 'beneficiary',
            'outputs': [
              {
                'name': '',
                'type': 'address'
              }
            ],
            'type': 'function'
          },
          {
            'constant': false,
            'inputs': [],
            'name': 'claimRefundOwed',
            'outputs': [
              {
                'name': 'claimProxy',
                'type': 'address'
              },
              {
                'name': 'refundAmount',
                'type': 'uint256'
              }
            ],
            'type': 'function'
          },
          {
            'constant': true,
            'inputs': [
              {
                'name': '_contributor',
                'type': 'address'
              }
            ],
            'name': 'amountContributedBy',
            'outputs': [
              {
                'name': 'amountContributed',
                'type': 'uint256'
              }
            ],
            'type': 'function'
          },
          {
            'constant': true,
            'inputs': [],
            'name': 'paidOut',
            'outputs': [
              {
                'name': 'successfully',
                'type': 'bool'
              }
            ],
            'type': 'function'
          },
          {
            'constant': true,
            'inputs': [],
            'name': 'fundingGoal',
            'outputs': [
              {
                'name': 'amount',
                'type': 'uint256'
              }
            ],
            'type': 'function'
          },
          {
            'constant': false,
            'inputs': [],
            'name': 'payoutToBeneficiary',
            'outputs': [
              {
                'name': 'claimProxy',
                'type': 'address'
              }
            ],
            'type': 'function'
          },
          {
            'constant': false,
            'inputs': [],
            'name': 'contributeMsgValue',
            'outputs': [],
            'type': 'function'
          },
          {
            'constant': true,
            'inputs': [],
            'name': 'expiry',
            'outputs': [
              {
                'name': 'timestamp',
                'type': 'uint256'
              }
            ],
            'type': 'function'
          },
          {
            'anonymous': false,
            'inputs': [
              {
                'indexed': false,
                'name': '_contributor',
                'type': 'address'
              }
            ],
            'name': 'ContributionMade',
            'type': 'event'
          },
          {
            'anonymous': false,
            'inputs': [
              {
                'indexed': false,
                'name': '_claimProxy',
                'type': 'address'
              },
              {
                'indexed': false,
                'name': '_payoutAmount',
                'type': 'uint256'
              }
            ],
            'name': 'BeneficiaryPayoutClaimed',
            'type': 'event'
          },
          {
            'anonymous': false,
            'inputs': [
              {
                'indexed': false,
                'name': '_claimProxy',
                'type': 'address'
              },
              {
                'indexed': false,
                'name': '_refundAmount',
                'type': 'uint256'
              },
              {
                'indexed': false,
                'name': '_contributor',
                'type': 'address'
              }
            ],
            'name': 'ContributorRefundClaimed',
            'type': 'event'
          }
        ],
        'bytecode': ''
      },
      'CampaignDataRegistry': {
        'interface': [
          {
            'constant': false,
            'inputs': [
              {
                'name': '_campaign',
                'type': 'address'
              },
              {
                'name': '_data',
                'type': 'bytes'
              }
            ],
            'name': 'register',
            'outputs': [],
            'type': 'function'
          },
          {
            'constant': true,
            'inputs': [
              {
                'name': '_campaign',
                'type': 'address'
              }
            ],
            'name': 'storedDate',
            'outputs': [
              {
                'name': 'dataStored',
                'type': 'bytes'
              }
            ],
            'type': 'function'
          },
          {
            'constant': true,
            'inputs': [
              {
                'name': '_campaignID',
                'type': 'uint256'
              }
            ],
            'name': 'campaignById',
            'outputs': [
              {
                'name': 'campaign',
                'type': 'address'
              }
            ],
            'type': 'function'
          },
          {
            'anonymous': false,
            'inputs': [
              {
                'indexed': false,
                'name': '_campaign',
                'type': 'address'
              }
            ],
            'name': 'CampaignDataRegistered',
            'type': 'event'
          }
        ],
        'bytecode': '6060604052610501806100126000396000f360606040526000357c01000000000000000000000000000000000000000000000000000000009004806324b8fbf61461004f5780638f212f80146100ae57806398bf6de8146101325761004d565b005b6100ac6004808035906020019091908035906020019082018035906020019191908080601f016020809104026020016040519081016040528093929190818152602001838380828437820191505050505050909091905050610174565b005b6100c460048080359060200190919050506103cf565b60405180806020018281038252838181518152602001915080519060200190808383829060006004602084601f0104600f02600301f150905090810190601f1680156101245780820380516001836020036101000a031916815260200191505b509250505060405180910390f35b61014860048080359060200190919050506104b7565b604051808273ffffffffffffffffffffffffffffffffffffffff16815260200191505060405180910390f35b813373ffffffffffffffffffffffffffffffffffffffff168173ffffffffffffffffffffffffffffffffffffffff16638da5cb5b604051817c01000000000000000000000000000000000000000000000000000000000281526004018090506020604051808303816000876161da5a03f115610002575050506040518051906020015073ffffffffffffffffffffffffffffffffffffffff1614156103c95781600060005060008573ffffffffffffffffffffffffffffffffffffffff1681526020019081526020016000206000509080519060200190828054600181600116156101000203166002900490600052602060002090601f016020900481019282601f1061028c57805160ff19168380011785556102bd565b828001600101855582156102bd579182015b828111156102bc57825182600050559160200191906001019061029e565b5b5090506102e891906102ca565b808211156102e457600081815060009055506001016102ca565b5090565b50506001600050805480600101828181548183558181151161033c5781836000526020600020918201910161033b919061031d565b80821115610337576000818150600090555060010161031d565b5090565b5b5050509190906000526020600020900160005b85909190916101000a81548173ffffffffffffffffffffffffffffffffffffffff02191690830217905550507fa379e02b459108b2afd707cd51f2570af1704e78a9573cb9d18baff224b60ab383604051808273ffffffffffffffffffffffffffffffffffffffff16815260200191505060405180910390a15b505b5050565b6020604051908101604052806000815260200150600060005060008373ffffffffffffffffffffffffffffffffffffffff1681526020019081526020016000206000508054600181600116156101000203166002900480601f0160208091040260200160405190810160405280929190818152602001828054600181600116156101000203166002900480156104a65780601f1061047b576101008083540402835291602001916104a6565b820191906000526020600020905b81548152906001019060200180831161048957829003601f168201915b505050505090506104b2565b919050565b6000600160005082815481101561000257906000526020600020900160005b9054906101000a900473ffffffffffffffffffffffffffffffffffffffff1690506104fc565b91905056'
      },
      'CampaignDataRegistryInterface': {
        'interface': [
          {
            'constant': false,
            'inputs': [
              {
                'name': '_campaign',
                'type': 'address'
              },
              {
                'name': '_data',
                'type': 'bytes'
              }
            ],
            'name': 'register',
            'outputs': [],
            'type': 'function'
          },
          {
            'constant': true,
            'inputs': [
              {
                'name': '_campaign',
                'type': 'address'
              }
            ],
            'name': 'storedDate',
            'outputs': [
              {
                'name': 'data',
                'type': 'bytes'
              }
            ],
            'type': 'function'
          },
          {
            'constant': true,
            'inputs': [
              {
                'name': '_campaignID',
                'type': 'uint256'
              }
            ],
            'name': 'campaignById',
            'outputs': [
              {
                'name': 'campaign',
                'type': 'address'
              }
            ],
            'type': 'function'
          },
          {
            'anonymous': false,
            'inputs': [
              {
                'indexed': false,
                'name': '_campaign',
                'type': 'address'
              }
            ],
            'name': 'CampaignDataRegistered',
            'type': 'event'
          }
        ],
        'bytecode': ''
      },
      'ClaimProxy': {
        'interface': [
          {
            'constant': false,
            'inputs': [],
            'name': 'claimBalance',
            'outputs': [],
            'type': 'function'
          },
          {
            'constant': true,
            'inputs': [],
            'name': 'owner',
            'outputs': [
              {
                'name': '',
                'type': 'address'
              }
            ],
            'type': 'function'
          },
          {
            'inputs': [
              {
                'name': '_owner',
                'type': 'address'
              }
            ],
            'type': 'constructor'
          }
        ],
        'bytecode': '60606040526040516020806101cf833981016040528080519060200190919050505b5b33600060006101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908302179055505b80600060006101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908302179055505b50610146806100896000396000f360606040526000357c01000000000000000000000000000000000000000000000000000000009004806330509bca146100445780638da5cb5b1461005357610042565b005b610051600480505061008c565b005b6100606004805050610120565b604051808273ffffffffffffffffffffffffffffffffffffffff16815260200191505060405180910390f35b600060009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff163373ffffffffffffffffffffffffffffffffffffffff16141561011d57600060009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16ff5b5b565b600060009054906101000a900473ffffffffffffffffffffffffffffffffffffffff168156'
      },
      'ClaimProxyInterface': {
        'interface': [
          {
            'constant': false,
            'inputs': [],
            'name': 'claimBalance',
            'outputs': [],
            'type': 'function'
          }
        ],
        'bytecode': ''
      },
      'HumanStandardCampaign': {
        'interface': [
          {
            'constant': true,
            'inputs': [],
            'name': 'name',
            'outputs': [
              {
                'name': '',
                'type': 'string'
              }
            ],
            'type': 'function'
          },
          {
            'constant': true,
            'inputs': [
              {
                'name': '_contributor',
                'type': 'address'
              }
            ],
            'name': 'claimMadeBy',
            'outputs': [
              {
                'name': 'claimWasMade',
                'type': 'bool'
              }
            ],
            'type': 'function'
          },
          {
            'constant': true,
            'inputs': [],
            'name': 'beneficiary',
            'outputs': [
              {
                'name': '',
                'type': 'address'
              }
            ],
            'type': 'function'
          },
          {
            'constant': false,
            'inputs': [],
            'name': 'claimRefundOwed',
            'outputs': [
              {
                'name': 'claimProxy',
                'type': 'address'
              },
              {
                'name': 'refundAmount',
                'type': 'uint256'
              }
            ],
            'type': 'function'
          },
          {
            'constant': true,
            'inputs': [
              {
                'name': '_contributor',
                'type': 'address'
              }
            ],
            'name': 'amountContributedBy',
            'outputs': [
              {
                'name': 'amountContributed',
                'type': 'uint256'
              }
            ],
            'type': 'function'
          },
          {
            'constant': true,
            'inputs': [],
            'name': 'paidOut',
            'outputs': [
              {
                'name': '',
                'type': 'bool'
              }
            ],
            'type': 'function'
          },
          {
            'constant': true,
            'inputs': [],
            'name': 'fundingGoal',
            'outputs': [
              {
                'name': '',
                'type': 'uint256'
              }
            ],
            'type': 'function'
          },
          {
            'constant': true,
            'inputs': [],
            'name': 'owner',
            'outputs': [
              {
                'name': '',
                'type': 'address'
              }
            ],
            'type': 'function'
          },
          {
            'constant': false,
            'inputs': [],
            'name': 'payoutToBeneficiary',
            'outputs': [
              {
                'name': 'claimProxy',
                'type': 'address'
              }
            ],
            'type': 'function'
          },
          {
            'constant': false,
            'inputs': [],
            'name': 'contributeMsgValue',
            'outputs': [],
            'type': 'function'
          },
          {
            'constant': true,
            'inputs': [],
            'name': 'expiry',
            'outputs': [
              {
                'name': '',
                'type': 'uint256'
              }
            ],
            'type': 'function'
          },
          {
            'inputs': [
              {
                'name': '_name',
                'type': 'string'
              },
              {
                'name': '_beneficiary',
                'type': 'address'
              },
              {
                'name': '_fundingGoal',
                'type': 'uint256'
              },
              {
                'name': '_expiry',
                'type': 'uint256'
              }
            ],
            'type': 'constructor'
          },
          {
            'anonymous': false,
            'inputs': [
              {
                'indexed': false,
                'name': '_contributor',
                'type': 'address'
              }
            ],
            'name': 'ContributionMade',
            'type': 'event'
          },
          {
            'anonymous': false,
            'inputs': [
              {
                'indexed': false,
                'name': '_claimProxy',
                'type': 'address'
              },
              {
                'indexed': false,
                'name': '_payoutAmount',
                'type': 'uint256'
              }
            ],
            'name': 'BeneficiaryPayoutClaimed',
            'type': 'event'
          },
          {
            'anonymous': false,
            'inputs': [
              {
                'indexed': false,
                'name': '_claimProxy',
                'type': 'address'
              },
              {
                'indexed': false,
                'name': '_refundAmount',
                'type': 'uint256'
              },
              {
                'indexed': false,
                'name': '_contributor',
                'type': 'address'
              }
            ],
            'name': 'ContributorRefundClaimed',
            'type': 'event'
          }
        ],
        'bytecode': '6060604052604051610da5380380610da5833981016040528080518201919060200180519060200190919080519060200190919080519060200190919050505b5b33600160006101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908302179055505b8360006000509080519060200190828054600181600116156101000203166002900490600052602060002090601f016020900481019282601f106100bb57805160ff19168380011785556100ec565b828001600101855582156100ec579182015b828111156100eb5782518260005055916020019190600101906100cd565b5b50905061011791906100f9565b8082111561011357600081815060009055506001016100f9565b5090565b505082600260006101000a81548173ffffffffffffffffffffffffffffffffffffffff02191690830217905550816003600050819055508060056000508190555033600160006101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908302179055505b50505050610c0f806101966000396000f3606060405236156100ab576000357c01000000000000000000000000000000000000000000000000000000009004806306fdde03146100bc578063084a93c81461013757806338af3eed14610165578063394ec89d1461019e578063509239c0146101de5780635c76ca2d1461020a5780637a3a0e841461022f5780638da5cb5b14610252578063a63c7ba21461028b578063db0251e9146102c4578063e184c9be146102d3576100ab565b6100ba5b6100b76102f6565b5b565b005b6100c96004805050610382565b60405180806020018281038252838181518152602001915080519060200190808383829060006004602084601f0104600f02600301f150905090810190601f1680156101295780820380516001836020036101000a031916815260200191505b509250505060405180910390f35b61014d6004808035906020019091905050610423565b60405180821515815260200191505060405180910390f35b610172600480505061046b565b604051808273ffffffffffffffffffffffffffffffffffffffff16815260200191505060405180910390f35b6101ab6004805050610491565b604051808373ffffffffffffffffffffffffffffffffffffffff1681526020018281526020019250505060405180910390f35b6101f46004808035906020019091905050610677565b6040518082815260200191505060405180910390f35b61021760048050506106b5565b60405180821515815260200191505060405180910390f35b61023c60048050506106c8565b6040518082815260200191505060405180910390f35b61025f60048050506106d1565b604051808273ffffffffffffffffffffffffffffffffffffffff16815260200191505060405180910390f35b61029860048050506106f7565b604051808273ffffffffffffffffffffffffffffffffffffffff16815260200191505060405180910390f35b6102d160048050506102f6565b005b6102e06004805050610868565b6040518082815260200191505060405180910390f35b34600660005060003373ffffffffffffffffffffffffffffffffffffffff1681526020019081526020016000206000828282505401925050819055507f97a3367c201ad38e0d37322fd0ffa1b93457541ae8baf20eb9aa50bb83fcabef33604051808273ffffffffffffffffffffffffffffffffffffffff16815260200191505060405180910390a15b565b60006000508054600181600116156101000203166002900480601f01602080910402602001604051908101604052809291908181526020018280546001816001161561010002031660029004801561041b5780601f106103f05761010080835404028352916020019161041b565b820191906000526020600020905b8154815290600101906020018083116103fe57829003601f168201915b505050505081565b6000600760005060008373ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060009054906101000a900460ff169050610466565b919050565b600260009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1681565b600060006003600050543073ffffffffffffffffffffffffffffffffffffffff163110156106725760001515600760005060003373ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060009054906101000a900460ff161515141561067157600560005054421115610670576001600760005060003373ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060006101000a81548160ff02191690830217905550336040516101cf80610871833901808273ffffffffffffffffffffffffffffffffffffffff168152602001915050604051809103906000f091508150600660005060003373ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060005054905080508173ffffffffffffffffffffffffffffffffffffffff16600082604051809050600060405180830381858888f1935050505015156105fc57610002565b7fd7774e62dd5deeb86bef491aca99a5d9f79b683438c8a8195ca8269900694447828233604051808473ffffffffffffffffffffffffffffffffffffffff1681526020018381526020018273ffffffffffffffffffffffffffffffffffffffff168152602001935050505060405180910390a15b5b5b5b9091565b6000600660005060008373ffffffffffffffffffffffffffffffffffffffff1681526020019081526020016000206000505490506106b0565b919050565b600460009054906101000a900460ff1681565b60036000505481565b600160009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1681565b60006003600050543073ffffffffffffffffffffffffffffffffffffffff163110151561086457600560005054421115610863576001600460006101000a81548160ff02191690830217905550600260009054906101000a900473ffffffffffffffffffffffffffffffffffffffff166040516101cf80610a40833901808273ffffffffffffffffffffffffffffffffffffffff168152602001915050604051809103906000f0905080507f22c1e24047f1e0c1af6f78290547f44645cdd2ad4d06b09115a162e41460c4d5813073ffffffffffffffffffffffffffffffffffffffff1631604051808373ffffffffffffffffffffffffffffffffffffffff1681526020018281526020019250505060405180910390a18073ffffffffffffffffffffffffffffffffffffffff1660003073ffffffffffffffffffffffffffffffffffffffff1631604051809050600060405180830381858888f19350505050151561086257610002565b5b5b5b90565b600560005054815660606040526040516020806101cf833981016040528080519060200190919050505b5b33600060006101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908302179055505b80600060006101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908302179055505b50610146806100896000396000f360606040526000357c01000000000000000000000000000000000000000000000000000000009004806330509bca146100445780638da5cb5b1461005357610042565b005b610051600480505061008c565b005b6100606004805050610120565b604051808273ffffffffffffffffffffffffffffffffffffffff16815260200191505060405180910390f35b600060009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff163373ffffffffffffffffffffffffffffffffffffffff16141561011d57600060009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16ff5b5b565b600060009054906101000a900473ffffffffffffffffffffffffffffffffffffffff16815660606040526040516020806101cf833981016040528080519060200190919050505b5b33600060006101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908302179055505b80600060006101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908302179055505b50610146806100896000396000f360606040526000357c01000000000000000000000000000000000000000000000000000000009004806330509bca146100445780638da5cb5b1461005357610042565b005b610051600480505061008c565b005b6100606004805050610120565b604051808273ffffffffffffffffffffffffffffffffffffffff16815260200191505060405180910390f35b600060009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff163373ffffffffffffffffffffffffffffffffffffffff16141561011d57600060009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16ff5b5b565b600060009054906101000a900473ffffffffffffffffffffffffffffffffffffffff168156'
      },
      'HumanStandardCampaignFactory': {
        'interface': [
          {
            'constant': true,
            'inputs': [
              {
                'name': '_serviceId',
                'type': 'uint256'
              }
            ],
            'name': 'addressOf',
            'outputs': [
              {
                'name': 'service',
                'type': 'address'
              }
            ],
            'type': 'function'
          },
          {
            'constant': false,
            'inputs': [
              {
                'name': '_name',
                'type': 'string'
              },
              {
                'name': '_beneficiary',
                'type': 'address'
              },
              {
                'name': '_fundingGoal',
                'type': 'uint256'
              },
              {
                'name': '_expiry',
                'type': 'uint256'
              }
            ],
            'name': 'createHumanStandardCampaign',
            'outputs': [
              {
                'name': 'humanStandardCampaign',
                'type': 'address'
              }
            ],
            'type': 'function'
          },
          {
            'constant': true,
            'inputs': [
              {
                'name': '_service',
                'type': 'address'
              }
            ],
            'name': 'idOf',
            'outputs': [
              {
                'name': 'id',
                'type': 'uint256'
              }
            ],
            'type': 'function'
          },
          {
            'constant': true,
            'inputs': [
              {
                'name': '_service',
                'type': 'address'
              }
            ],
            'name': 'isService',
            'outputs': [
              {
                'name': 'registered',
                'type': 'bool'
              }
            ],
            'type': 'function'
          },
          {
            'anonymous': false,
            'inputs': [
              {
                'indexed': false,
                'name': '_service',
                'type': 'address'
              },
              {
                'indexed': false,
                'name': '_serviceId',
                'type': 'uint256'
              }
            ],
            'name': 'ServiceRegistered',
            'type': 'event'
          }
        ],
        'bytecode': '606060405261115f806100126000396000f360606040526000357c01000000000000000000000000000000000000000000000000000000009004806311a800bc1461005a5780634a638c6b1461009c578063d94fe83214610137578063e9d8dbfd1461016357610058565b005b6100706004808035906020019091905050610191565b604051808273ffffffffffffffffffffffffffffffffffffffff16815260200191505060405180910390f35b61010b6004808035906020019082018035906020019191908080601f0160208091040260200160405190810160405280939291908181526020018383808284378201915050505050509090919080359060200190919080359060200190919080359060200190919050506101db565b604051808273ffffffffffffffffffffffffffffffffffffffff16815260200191505060405180910390f35b61014d6004808035906020019091905050610292565b6040518082815260200191505060405180910390f35b61017960048080359060200190919050506102d0565b60405180821515815260200191505060405180910390f35b6000600060005082815481101561000257906000526020600020900160005b9054906101000a900473ffffffffffffffffffffffffffffffffffffffff1690506101d6565b919050565b600084848484604051610da5806103ba83390180806020018573ffffffffffffffffffffffffffffffffffffffff1681526020018481526020018381526020018281038252868181518152602001915080519060200190808383829060006004602084601f0104600f02600301f150905090810190601f1680156102735780820380516001836020036101000a031916815260200191505b5095505050505050604051809103906000f0905080505b949350505050565b6000600160005060008373ffffffffffffffffffffffffffffffffffffffff1681526020019081526020016000206000505490506102cb565b919050565b6000600073ffffffffffffffffffffffffffffffffffffffff166000600050600160005060008573ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060005054815481101561000257906000526020600020900160005b9054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16141580156103a65750600073ffffffffffffffffffffffffffffffffffffffff168273ffffffffffffffffffffffffffffffffffffffff1614155b156103b457600190506103b5565b5b919050566060604052604051610da5380380610da5833981016040528080518201919060200180519060200190919080519060200190919080519060200190919050505b5b33600160006101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908302179055505b8360006000509080519060200190828054600181600116156101000203166002900490600052602060002090601f016020900481019282601f106100bb57805160ff19168380011785556100ec565b828001600101855582156100ec579182015b828111156100eb5782518260005055916020019190600101906100cd565b5b50905061011791906100f9565b8082111561011357600081815060009055506001016100f9565b5090565b505082600260006101000a81548173ffffffffffffffffffffffffffffffffffffffff02191690830217905550816003600050819055508060056000508190555033600160006101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908302179055505b50505050610c0f806101966000396000f3606060405236156100ab576000357c01000000000000000000000000000000000000000000000000000000009004806306fdde03146100bc578063084a93c81461013757806338af3eed14610165578063394ec89d1461019e578063509239c0146101de5780635c76ca2d1461020a5780637a3a0e841461022f5780638da5cb5b14610252578063a63c7ba21461028b578063db0251e9146102c4578063e184c9be146102d3576100ab565b6100ba5b6100b76102f6565b5b565b005b6100c96004805050610382565b60405180806020018281038252838181518152602001915080519060200190808383829060006004602084601f0104600f02600301f150905090810190601f1680156101295780820380516001836020036101000a031916815260200191505b509250505060405180910390f35b61014d6004808035906020019091905050610423565b60405180821515815260200191505060405180910390f35b610172600480505061046b565b604051808273ffffffffffffffffffffffffffffffffffffffff16815260200191505060405180910390f35b6101ab6004805050610491565b604051808373ffffffffffffffffffffffffffffffffffffffff1681526020018281526020019250505060405180910390f35b6101f46004808035906020019091905050610677565b6040518082815260200191505060405180910390f35b61021760048050506106b5565b60405180821515815260200191505060405180910390f35b61023c60048050506106c8565b6040518082815260200191505060405180910390f35b61025f60048050506106d1565b604051808273ffffffffffffffffffffffffffffffffffffffff16815260200191505060405180910390f35b61029860048050506106f7565b604051808273ffffffffffffffffffffffffffffffffffffffff16815260200191505060405180910390f35b6102d160048050506102f6565b005b6102e06004805050610868565b6040518082815260200191505060405180910390f35b34600660005060003373ffffffffffffffffffffffffffffffffffffffff1681526020019081526020016000206000828282505401925050819055507f97a3367c201ad38e0d37322fd0ffa1b93457541ae8baf20eb9aa50bb83fcabef33604051808273ffffffffffffffffffffffffffffffffffffffff16815260200191505060405180910390a15b565b60006000508054600181600116156101000203166002900480601f01602080910402602001604051908101604052809291908181526020018280546001816001161561010002031660029004801561041b5780601f106103f05761010080835404028352916020019161041b565b820191906000526020600020905b8154815290600101906020018083116103fe57829003601f168201915b505050505081565b6000600760005060008373ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060009054906101000a900460ff169050610466565b919050565b600260009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1681565b600060006003600050543073ffffffffffffffffffffffffffffffffffffffff163110156106725760001515600760005060003373ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060009054906101000a900460ff161515141561067157600560005054421115610670576001600760005060003373ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060006101000a81548160ff02191690830217905550336040516101cf80610871833901808273ffffffffffffffffffffffffffffffffffffffff168152602001915050604051809103906000f091508150600660005060003373ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060005054905080508173ffffffffffffffffffffffffffffffffffffffff16600082604051809050600060405180830381858888f1935050505015156105fc57610002565b7fd7774e62dd5deeb86bef491aca99a5d9f79b683438c8a8195ca8269900694447828233604051808473ffffffffffffffffffffffffffffffffffffffff1681526020018381526020018273ffffffffffffffffffffffffffffffffffffffff168152602001935050505060405180910390a15b5b5b5b9091565b6000600660005060008373ffffffffffffffffffffffffffffffffffffffff1681526020019081526020016000206000505490506106b0565b919050565b600460009054906101000a900460ff1681565b60036000505481565b600160009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1681565b60006003600050543073ffffffffffffffffffffffffffffffffffffffff163110151561086457600560005054421115610863576001600460006101000a81548160ff02191690830217905550600260009054906101000a900473ffffffffffffffffffffffffffffffffffffffff166040516101cf80610a40833901808273ffffffffffffffffffffffffffffffffffffffff168152602001915050604051809103906000f0905080507f22c1e24047f1e0c1af6f78290547f44645cdd2ad4d06b09115a162e41460c4d5813073ffffffffffffffffffffffffffffffffffffffff1631604051808373ffffffffffffffffffffffffffffffffffffffff1681526020018281526020019250505060405180910390a18073ffffffffffffffffffffffffffffffffffffffff1660003073ffffffffffffffffffffffffffffffffffffffff1631604051809050600060405180830381858888f19350505050151561086257610002565b5b5b5b90565b600560005054815660606040526040516020806101cf833981016040528080519060200190919050505b5b33600060006101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908302179055505b80600060006101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908302179055505b50610146806100896000396000f360606040526000357c01000000000000000000000000000000000000000000000000000000009004806330509bca146100445780638da5cb5b1461005357610042565b005b610051600480505061008c565b005b6100606004805050610120565b604051808273ffffffffffffffffffffffffffffffffffffffff16815260200191505060405180910390f35b600060009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff163373ffffffffffffffffffffffffffffffffffffffff16141561011d57600060009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16ff5b5b565b600060009054906101000a900473ffffffffffffffffffffffffffffffffffffffff16815660606040526040516020806101cf833981016040528080519060200190919050505b5b33600060006101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908302179055505b80600060006101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908302179055505b50610146806100896000396000f360606040526000357c01000000000000000000000000000000000000000000000000000000009004806330509bca146100445780638da5cb5b1461005357610042565b005b610051600480505061008c565b005b6100606004805050610120565b604051808273ffffffffffffffffffffffffffffffffffffffff16815260200191505060405180910390f35b600060009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff163373ffffffffffffffffffffffffffffffffffffffff16141561011d57600060009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16ff5b5b565b600060009054906101000a900473ffffffffffffffffffffffffffffffffffffffff168156'
      },
      'HumanStandardToken': {
        'interface': [
          {
            'constant': true,
            'inputs': [],
            'name': 'name',
            'outputs': [
              {
                'name': '',
                'type': 'string'
              }
            ],
            'type': 'function'
          },
          {
            'constant': false,
            'inputs': [
              {
                'name': '_spender',
                'type': 'address'
              },
              {
                'name': '_value',
                'type': 'uint256'
              }
            ],
            'name': 'approve',
            'outputs': [
              {
                'name': 'success',
                'type': 'bool'
              }
            ],
            'type': 'function'
          },
          {
            'constant': true,
            'inputs': [],
            'name': 'totalSupply',
            'outputs': [
              {
                'name': '',
                'type': 'uint256'
              }
            ],
            'type': 'function'
          },
          {
            'constant': false,
            'inputs': [
              {
                'name': '_from',
                'type': 'address'
              },
              {
                'name': '_to',
                'type': 'address'
              },
              {
                'name': '_value',
                'type': 'uint256'
              }
            ],
            'name': 'transferFrom',
            'outputs': [
              {
                'name': 'success',
                'type': 'bool'
              }
            ],
            'type': 'function'
          },
          {
            'constant': true,
            'inputs': [],
            'name': 'decimals',
            'outputs': [
              {
                'name': '',
                'type': 'uint8'
              }
            ],
            'type': 'function'
          },
          {
            'constant': true,
            'inputs': [],
            'name': 'version',
            'outputs': [
              {
                'name': '',
                'type': 'string'
              }
            ],
            'type': 'function'
          },
          {
            'constant': true,
            'inputs': [
              {
                'name': '_owner',
                'type': 'address'
              }
            ],
            'name': 'balanceOf',
            'outputs': [
              {
                'name': 'balance',
                'type': 'uint256'
              }
            ],
            'type': 'function'
          },
          {
            'constant': true,
            'inputs': [],
            'name': 'symbol',
            'outputs': [
              {
                'name': '',
                'type': 'string'
              }
            ],
            'type': 'function'
          },
          {
            'constant': false,
            'inputs': [
              {
                'name': '_to',
                'type': 'address'
              },
              {
                'name': '_value',
                'type': 'uint256'
              }
            ],
            'name': 'transfer',
            'outputs': [
              {
                'name': 'success',
                'type': 'bool'
              }
            ],
            'type': 'function'
          },
          {
            'constant': false,
            'inputs': [
              {
                'name': '_spender',
                'type': 'address'
              },
              {
                'name': '_value',
                'type': 'uint256'
              },
              {
                'name': '_extraData',
                'type': 'bytes'
              }
            ],
            'name': 'approveAndCall',
            'outputs': [
              {
                'name': 'success',
                'type': 'bool'
              }
            ],
            'type': 'function'
          },
          {
            'constant': true,
            'inputs': [
              {
                'name': '_owner',
                'type': 'address'
              },
              {
                'name': '_spender',
                'type': 'address'
              }
            ],
            'name': 'allowance',
            'outputs': [
              {
                'name': 'remaining',
                'type': 'uint256'
              }
            ],
            'type': 'function'
          },
          {
            'inputs': [
              {
                'name': '_initialAmount',
                'type': 'uint256'
              },
              {
                'name': '_tokenName',
                'type': 'string'
              },
              {
                'name': '_decimalUnits',
                'type': 'uint8'
              },
              {
                'name': '_tokenSymbol',
                'type': 'string'
              }
            ],
            'type': 'constructor'
          },
          {
            'anonymous': false,
            'inputs': [
              {
                'indexed': true,
                'name': '_from',
                'type': 'address'
              },
              {
                'indexed': true,
                'name': '_to',
                'type': 'address'
              },
              {
                'indexed': false,
                'name': '_value',
                'type': 'uint256'
              }
            ],
            'name': 'Transfer',
            'type': 'event'
          },
          {
            'anonymous': false,
            'inputs': [
              {
                'indexed': true,
                'name': '_owner',
                'type': 'address'
              },
              {
                'indexed': true,
                'name': '_spender',
                'type': 'address'
              },
              {
                'indexed': false,
                'name': '_value',
                'type': 'uint256'
              }
            ],
            'name': 'Approval',
            'type': 'event'
          }
        ],
        'bytecode': '6060604052604060405190810160405280600481526020017f48302e310000000000000000000000000000000000000000000000000000000081526020015060066000509080519060200190828054600181600116156101000203166002900490600052602060002090601f016020900481019282601f1061008c57805160ff19168380011785556100bd565b828001600101855582156100bd579182015b828111156100bc57825182600050559160200191906001019061009e565b5b5090506100e891906100ca565b808211156100e457600081815060009055506001016100ca565b5090565b5050604051610ff4380380610ff4833981016040528080519060200190919080518201919060200180519060200190919080518201919060200150505b83600060005060003373ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060005081905550836002600050819055508260036000509080519060200190828054600181600116156101000203166002900490600052602060002090601f016020900481019282601f106101b257805160ff19168380011785556101e3565b828001600101855582156101e3579182015b828111156101e25782518260005055916020019190600101906101c4565b5b50905061020e91906101f0565b8082111561020a57600081815060009055506001016101f0565b5090565b505081600460006101000a81548160ff021916908302179055508060056000509080519060200190828054600181600116156101000203166002900490600052602060002090601f016020900481019282601f1061027757805160ff19168380011785556102a8565b828001600101855582156102a8579182015b828111156102a7578251826000505591602001919060010190610289565b5b5090506102d391906102b5565b808211156102cf57600081815060009055506001016102b5565b5090565b50505b50505050610d0c806102e86000396000f3606060405236156100ab576000357c01000000000000000000000000000000000000000000000000000000009004806306fdde03146100b8578063095ea7b31461013357806318160ddd1461016a57806323b872dd1461018d578063313ce567146101cd57806354fd4d50146101f357806370a082311461026e57806395d89b411461029a578063a9059cbb14610315578063cae9ca511461034c578063dd62ed3e146103ca576100ab565b6100b65b610002565b565b005b6100c560048050506103ff565b60405180806020018281038252838181518152602001915080519060200190808383829060006004602084601f0104600f02600301f150905090810190601f1680156101255780820380516001836020036101000a031916815260200191505b509250505060405180910390f35b61015260048080359060200190919080359060200190919050506104a0565b60405180821515815260200191505060405180910390f35b6101776004805050610574565b6040518082815260200191505060405180910390f35b6101b5600480803590602001909190803590602001909190803590602001909190505061057d565b60405180821515815260200191505060405180910390f35b6101da6004805050610789565b604051808260ff16815260200191505060405180910390f35b610200600480505061079c565b60405180806020018281038252838181518152602001915080519060200190808383829060006004602084601f0104600f02600301f150905090810190601f1680156102605780820380516001836020036101000a031916815260200191505b509250505060405180910390f35b610284600480803590602001909190505061083d565b6040518082815260200191505060405180910390f35b6102a7600480505061087b565b60405180806020018281038252838181518152602001915080519060200190808383829060006004602084601f0104600f02600301f150905090810190601f1680156103075780820380516001836020036101000a031916815260200191505b509250505060405180910390f35b610334600480803590602001909190803590602001909190505061091c565b60405180821515815260200191505060405180910390f35b6103b26004808035906020019091908035906020019091908035906020019082018035906020019191908080601f016020809104026020016040519081016040528093929190818152602001838380828437820191505050505050909091905050610a5c565b60405180821515815260200191505060405180910390f35b6103e96004808035906020019091908035906020019091905050610ca3565b6040518082815260200191505060405180910390f35b60036000508054600181600116156101000203166002900480601f0160208091040260200160405190810160405280929190818152602001828054600181600116156101000203166002900480156104985780601f1061046d57610100808354040283529160200191610498565b820191906000526020600020905b81548152906001019060200180831161047b57829003601f168201915b505050505081565b600081600160005060003373ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060005060008573ffffffffffffffffffffffffffffffffffffffff168152602001908152602001600020600050819055508273ffffffffffffffffffffffffffffffffffffffff163373ffffffffffffffffffffffffffffffffffffffff167f8c5be1e5ebec7d5bd14f71427d1e84f3dd0314c0f7b2291e5b200ac8c7c3b925846040518082815260200191505060405180910390a36001905061056e565b92915050565b60026000505481565b600081600060005060008673ffffffffffffffffffffffffffffffffffffffff1681526020019081526020016000206000505410158015610617575081600160005060008673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060005060003373ffffffffffffffffffffffffffffffffffffffff1681526020019081526020016000206000505410155b80156106235750600082115b156107785781600060005060008573ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060008282825054019250508190555081600060005060008673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060008282825054039250508190555081600160005060008673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060005060003373ffffffffffffffffffffffffffffffffffffffff1681526020019081526020016000206000828282505403925050819055508273ffffffffffffffffffffffffffffffffffffffff168473ffffffffffffffffffffffffffffffffffffffff167fddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef846040518082815260200191505060405180910390a36001905061078256610781565b60009050610782565b5b9392505050565b600460009054906101000a900460ff1681565b60066000508054600181600116156101000203166002900480601f0160208091040260200160405190810160405280929190818152602001828054600181600116156101000203166002900480156108355780601f1061080a57610100808354040283529160200191610835565b820191906000526020600020905b81548152906001019060200180831161081857829003601f168201915b505050505081565b6000600060005060008373ffffffffffffffffffffffffffffffffffffffff168152602001908152602001600020600050549050610876565b919050565b60056000508054600181600116156101000203166002900480601f0160208091040260200160405190810160405280929190818152602001828054600181600116156101000203166002900480156109145780601f106108e957610100808354040283529160200191610914565b820191906000526020600020905b8154815290600101906020018083116108f757829003601f168201915b505050505081565b600081600060005060003373ffffffffffffffffffffffffffffffffffffffff168152602001908152602001600020600050541015801561095d5750600082115b15610a4c5781600060005060003373ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060008282825054039250508190555081600060005060008573ffffffffffffffffffffffffffffffffffffffff1681526020019081526020016000206000828282505401925050819055508273ffffffffffffffffffffffffffffffffffffffff163373ffffffffffffffffffffffffffffffffffffffff167fddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef846040518082815260200191505060405180910390a360019050610a5656610a55565b60009050610a56565b5b92915050565b600082600160005060003373ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060005060008673ffffffffffffffffffffffffffffffffffffffff168152602001908152602001600020600050819055508373ffffffffffffffffffffffffffffffffffffffff163373ffffffffffffffffffffffffffffffffffffffff167f8c5be1e5ebec7d5bd14f71427d1e84f3dd0314c0f7b2291e5b200ac8c7c3b925856040518082815260200191505060405180910390a38373ffffffffffffffffffffffffffffffffffffffff1660405180807f72656365697665417070726f76616c28616464726573732c75696e743235362c81526020017f616464726573732c627974657329000000000000000000000000000000000000815260200150602e01905060405180910390207c0100000000000000000000000000000000000000000000000000000000900433853086604051857c0100000000000000000000000000000000000000000000000000000000028152600401808573ffffffffffffffffffffffffffffffffffffffff1681526020018481526020018373ffffffffffffffffffffffffffffffffffffffff1681526020018280519060200190808383829060006004602084601f0104600f02600301f150905090810190601f168015610c6b5780820380516001836020036101000a031916815260200191505b509450505050506000604051808303816000876161da5a03f1925050501515610c9357610002565b60019050610c9c565b9392505050565b6000600160005060008473ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060005060008373ffffffffffffffffffffffffffffffffffffffff168152602001908152602001600020600050549050610d06565b9291505056'
      },
      'HumanStandardTokenCampaign': {
        'interface': [
          {
            'constant': true,
            'inputs': [],
            'name': 'name',
            'outputs': [
              {
                'name': '',
                'type': 'string'
              }
            ],
            'type': 'function'
          },
          {
            'constant': true,
            'inputs': [
              {
                'name': '_contributor',
                'type': 'address'
              }
            ],
            'name': 'claimMadeBy',
            'outputs': [
              {
                'name': 'claimWasMade',
                'type': 'bool'
              }
            ],
            'type': 'function'
          },
          {
            'constant': true,
            'inputs': [],
            'name': 'beneficiary',
            'outputs': [
              {
                'name': '',
                'type': 'address'
              }
            ],
            'type': 'function'
          },
          {
            'constant': false,
            'inputs': [],
            'name': 'claimRefundOwed',
            'outputs': [
              {
                'name': 'claimProxy',
                'type': 'address'
              },
              {
                'name': 'refundAmount',
                'type': 'uint256'
              }
            ],
            'type': 'function'
          },
          {
            'constant': false,
            'inputs': [],
            'name': 'claimTokensOwed',
            'outputs': [
              {
                'name': 'contributor',
                'type': 'address'
              },
              {
                'name': 'tokenAmountClaimed',
                'type': 'uint256'
              }
            ],
            'type': 'function'
          },
          {
            'constant': true,
            'inputs': [
              {
                'name': '_contributor',
                'type': 'address'
              }
            ],
            'name': 'amountContributedBy',
            'outputs': [
              {
                'name': 'amountContributed',
                'type': 'uint256'
              }
            ],
            'type': 'function'
          },
          {
            'constant': true,
            'inputs': [],
            'name': 'paidOut',
            'outputs': [
              {
                'name': '',
                'type': 'bool'
              }
            ],
            'type': 'function'
          },
          {
            'constant': true,
            'inputs': [],
            'name': 'fundingGoal',
            'outputs': [
              {
                'name': '',
                'type': 'uint256'
              }
            ],
            'type': 'function'
          },
          {
            'constant': true,
            'inputs': [],
            'name': 'owner',
            'outputs': [
              {
                'name': '',
                'type': 'address'
              }
            ],
            'type': 'function'
          },
          {
            'constant': false,
            'inputs': [],
            'name': 'payoutToBeneficiary',
            'outputs': [
              {
                'name': 'claimProxy',
                'type': 'address'
              }
            ],
            'type': 'function'
          },
          {
            'constant': true,
            'inputs': [],
            'name': 'calculator',
            'outputs': [
              {
                'name': 'target',
                'type': 'address'
              }
            ],
            'type': 'function'
          },
          {
            'constant': false,
            'inputs': [],
            'name': 'contributeMsgValue',
            'outputs': [],
            'type': 'function'
          },
          {
            'constant': true,
            'inputs': [],
            'name': 'expiry',
            'outputs': [
              {
                'name': '',
                'type': 'uint256'
              }
            ],
            'type': 'function'
          },
          {
            'constant': true,
            'inputs': [
              {
                'name': '',
                'type': 'address'
              }
            ],
            'name': 'contributionCreated',
            'outputs': [
              {
                'name': '',
                'type': 'uint256'
              }
            ],
            'type': 'function'
          },
          {
            'constant': true,
            'inputs': [],
            'name': 'token',
            'outputs': [
              {
                'name': 'target',
                'type': 'address'
              }
            ],
            'type': 'function'
          },
          {
            'inputs': [
              {
                'name': '_name',
                'type': 'string'
              },
              {
                'name': '_token',
                'type': 'address'
              },
              {
                'name': '_dispersalCalculator',
                'type': 'address'
              },
              {
                'name': '_beneficiary',
                'type': 'address'
              },
              {
                'name': '_fundingGoal',
                'type': 'uint256'
              },
              {
                'name': '_expiry',
                'type': 'uint256'
              }
            ],
            'type': 'constructor'
          },
          {
            'anonymous': false,
            'inputs': [
              {
                'indexed': false,
                'name': '_contributor',
                'type': 'address'
              },
              {
                'indexed': false,
                'name': '_tokenAmountClaimed',
                'type': 'uint256'
              }
            ],
            'name': 'TokensClaimed',
            'type': 'event'
          },
          {
            'anonymous': false,
            'inputs': [
              {
                'indexed': false,
                'name': '_contributor',
                'type': 'address'
              }
            ],
            'name': 'ContributionMade',
            'type': 'event'
          },
          {
            'anonymous': false,
            'inputs': [
              {
                'indexed': false,
                'name': '_claimProxy',
                'type': 'address'
              },
              {
                'indexed': false,
                'name': '_payoutAmount',
                'type': 'uint256'
              }
            ],
            'name': 'BeneficiaryPayoutClaimed',
            'type': 'event'
          },
          {
            'anonymous': false,
            'inputs': [
              {
                'indexed': false,
                'name': '_claimProxy',
                'type': 'address'
              },
              {
                'indexed': false,
                'name': '_refundAmount',
                'type': 'uint256'
              },
              {
                'indexed': false,
                'name': '_contributor',
                'type': 'address'
              }
            ],
            'name': 'ContributorRefundClaimed',
            'type': 'event'
          }
        ],
        'bytecode': '606060405260405161128a38038061128a833981016040528080518201919060200180519060200190919080519060200190919080519060200190919080519060200190919080519060200190919050505b5b33600160006101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908302179055505b8560006000509080519060200190828054600181600116156101000203166002900490600052602060002090601f016020900481019282601f106100cd57805160ff19168380011785556100fe565b828001600101855582156100fe579182015b828111156100fd5782518260005055916020019190600101906100df565b5b509050610129919061010b565b80821115610125576000818150600090555060010161010b565b5090565b505082600260006101000a81548173ffffffffffffffffffffffffffffffffffffffff02191690830217905550816003600050819055508060056000508190555084600a60006101000a81548173ffffffffffffffffffffffffffffffffffffffff0219169083021790555083600960006101000a81548173ffffffffffffffffffffffffffffffffffffffff0219169083021790555033600160006101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908302179055505b50505050505061108a806102006000396000f3606060405236156100d7576000357c01000000000000000000000000000000000000000000000000000000009004806306fdde031461011c578063084a93c81461019757806338af3eed146101c5578063394ec89d146101fe57806348cf34f11461023e578063509239c01461027e5780635c76ca2d146102aa5780637a3a0e84146102cf5780638da5cb5b146102f2578063a63c7ba21461032b578063ce3e39c014610364578063db0251e91461039d578063e184c9be146103ac578063edb444c7146103cf578063fc0c546a146103fb576100d7565b61011a5b42600860005060003373ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060005081905550610117610434565b5b565b005b61012960048050506104c0565b60405180806020018281038252838181518152602001915080519060200190808383829060006004602084601f0104600f02600301f150905090810190601f1680156101895780820380516001836020036101000a031916815260200191505b509250505060405180910390f35b6101ad6004808035906020019091905050610561565b60405180821515815260200191505060405180910390f35b6101d260048050506105a9565b604051808273ffffffffffffffffffffffffffffffffffffffff16815260200191505060405180910390f35b61020b60048050506105cf565b604051808373ffffffffffffffffffffffffffffffffffffffff1681526020018281526020019250505060405180910390f35b61024b60048050506107b5565b604051808373ffffffffffffffffffffffffffffffffffffffff1681526020018281526020019250505060405180910390f35b6102946004808035906020019091905050610acb565b6040518082815260200191505060405180910390f35b6102b76004805050610b09565b60405180821515815260200191505060405180910390f35b6102dc6004805050610b1c565b6040518082815260200191505060405180910390f35b6102ff6004805050610b25565b604051808273ffffffffffffffffffffffffffffffffffffffff16815260200191505060405180910390f35b6103386004805050610b4b565b604051808273ffffffffffffffffffffffffffffffffffffffff16815260200191505060405180910390f35b6103716004805050610cbc565b604051808273ffffffffffffffffffffffffffffffffffffffff16815260200191505060405180910390f35b6103aa6004805050610434565b005b6103b96004805050610cc2565b6040518082815260200191505060405180910390f35b6103e56004808035906020019091905050610ccb565b6040518082815260200191505060405180910390f35b6104086004805050610ce6565b604051808273ffffffffffffffffffffffffffffffffffffffff16815260200191505060405180910390f35b34600660005060003373ffffffffffffffffffffffffffffffffffffffff1681526020019081526020016000206000828282505401925050819055507f97a3367c201ad38e0d37322fd0ffa1b93457541ae8baf20eb9aa50bb83fcabef33604051808273ffffffffffffffffffffffffffffffffffffffff16815260200191505060405180910390a15b565b60006000508054600181600116156101000203166002900480601f0160208091040260200160405190810160405280929190818152602001828054600181600116156101000203166002900480156105595780601f1061052e57610100808354040283529160200191610559565b820191906000526020600020905b81548152906001019060200180831161053c57829003601f168201915b505050505081565b6000600760005060008373ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060009054906101000a900460ff1690506105a4565b919050565b600260009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1681565b600060006003600050543073ffffffffffffffffffffffffffffffffffffffff163110156107b05760001515600760005060003373ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060009054906101000a900460ff16151514156107af576005600050544211156107ae576001600760005060003373ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060006101000a81548160ff02191690830217905550336040516101cf80610cec833901808273ffffffffffffffffffffffffffffffffffffffff168152602001915050604051809103906000f091508150600660005060003373ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060005054905080508173ffffffffffffffffffffffffffffffffffffffff16600082604051809050600060405180830381858888f19350505050151561073a57610002565b7fd7774e62dd5deeb86bef491aca99a5d9f79b683438c8a8195ca8269900694447828233604051808473ffffffffffffffffffffffffffffffffffffffff1681526020018381526020018273ffffffffffffffffffffffffffffffffffffffff168152602001935050505060405180910390a15b5b5b5b9091565b600060006003600050543073ffffffffffffffffffffffffffffffffffffffff1631101515610ac657600560005054421115610ac55760001515600760005060003373ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060009054906101000a900460ff1615151415610ac457600560005054600860005060003373ffffffffffffffffffffffffffffffffffffffff168152602001908152602001600020600050541015610ac3576001600760005060003373ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060006101000a81548160ff021916908302179055503391508150600960009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1663cbcd5582600660005060008573ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060005054600860005060008673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060005054604051837c010000000000000000000000000000000000000000000000000000000002815260040180838152602001828152602001925050506020604051808303816000876161da5a03f115610002575050506040518051906020015090508050600a60009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1663a9059cbb8383604051837c0100000000000000000000000000000000000000000000000000000000028152600401808373ffffffffffffffffffffffffffffffffffffffff168152602001828152602001925050506020604051808303816000876161da5a03f115610002575050506040518051906020015015610ac2577f896e034966eaaf1adc54acc0f257056febbd300c9e47182cf761982cf1f5e4308282604051808373ffffffffffffffffffffffffffffffffffffffff1681526020018281526020019250505060405180910390a15b5b5b5b5b5b9091565b6000600660005060008373ffffffffffffffffffffffffffffffffffffffff168152602001908152602001600020600050549050610b04565b919050565b600460009054906101000a900460ff1681565b60036000505481565b600160009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1681565b60006003600050543073ffffffffffffffffffffffffffffffffffffffff1631101515610cb857600560005054421115610cb7576001600460006101000a81548160ff02191690830217905550600260009054906101000a900473ffffffffffffffffffffffffffffffffffffffff166040516101cf80610ebb833901808273ffffffffffffffffffffffffffffffffffffffff168152602001915050604051809103906000f0905080507f22c1e24047f1e0c1af6f78290547f44645cdd2ad4d06b09115a162e41460c4d5813073ffffffffffffffffffffffffffffffffffffffff1631604051808373ffffffffffffffffffffffffffffffffffffffff1681526020018281526020019250505060405180910390a18073ffffffffffffffffffffffffffffffffffffffff1660003073ffffffffffffffffffffffffffffffffffffffff1631604051809050600060405180830381858888f193505050501515610cb657610002565b5b5b5b90565b60005b90565b60056000505481565b60086000506020528060005260406000206000915090505481565b60005b905660606040526040516020806101cf833981016040528080519060200190919050505b5b33600060006101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908302179055505b80600060006101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908302179055505b50610146806100896000396000f360606040526000357c01000000000000000000000000000000000000000000000000000000009004806330509bca146100445780638da5cb5b1461005357610042565b005b610051600480505061008c565b005b6100606004805050610120565b604051808273ffffffffffffffffffffffffffffffffffffffff16815260200191505060405180910390f35b600060009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff163373ffffffffffffffffffffffffffffffffffffffff16141561011d57600060009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16ff5b5b565b600060009054906101000a900473ffffffffffffffffffffffffffffffffffffffff16815660606040526040516020806101cf833981016040528080519060200190919050505b5b33600060006101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908302179055505b80600060006101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908302179055505b50610146806100896000396000f360606040526000357c01000000000000000000000000000000000000000000000000000000009004806330509bca146100445780638da5cb5b1461005357610042565b005b610051600480505061008c565b005b6100606004805050610120565b604051808273ffffffffffffffffffffffffffffffffffffffff16815260200191505060405180910390f35b600060009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff163373ffffffffffffffffffffffffffffffffffffffff16141561011d57600060009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16ff5b5b565b600060009054906101000a900473ffffffffffffffffffffffffffffffffffffffff168156'
      },
      'HumanStandardTokenCampaignFactory': {
        'interface': [
          {
            'constant': true,
            'inputs': [
              {
                'name': '_serviceId',
                'type': 'uint256'
              }
            ],
            'name': 'addressOf',
            'outputs': [
              {
                'name': 'service',
                'type': 'address'
              }
            ],
            'type': 'function'
          },
          {
            'constant': false,
            'inputs': [
              {
                'name': '_name',
                'type': 'string'
              },
              {
                'name': '_token',
                'type': 'address'
              },
              {
                'name': '_dispersalCalculator',
                'type': 'address'
              },
              {
                'name': '_beneficiary',
                'type': 'address'
              },
              {
                'name': '_fundingGoal',
                'type': 'uint256'
              },
              {
                'name': '_expiry',
                'type': 'uint256'
              }
            ],
            'name': 'createHumanStandardTokenCampaign',
            'outputs': [
              {
                'name': 'humanStandardTokenCampaign',
                'type': 'address'
              }
            ],
            'type': 'function'
          },
          {
            'constant': true,
            'inputs': [
              {
                'name': '_service',
                'type': 'address'
              }
            ],
            'name': 'idOf',
            'outputs': [
              {
                'name': 'id',
                'type': 'uint256'
              }
            ],
            'type': 'function'
          },
          {
            'constant': true,
            'inputs': [
              {
                'name': '_service',
                'type': 'address'
              }
            ],
            'name': 'isService',
            'outputs': [
              {
                'name': 'registered',
                'type': 'bool'
              }
            ],
            'type': 'function'
          },
          {
            'anonymous': false,
            'inputs': [
              {
                'indexed': false,
                'name': '_service',
                'type': 'address'
              },
              {
                'indexed': false,
                'name': '_serviceId',
                'type': 'uint256'
              }
            ],
            'name': 'ServiceRegistered',
            'type': 'event'
          }
        ],
        'bytecode': '6060604052611694806100126000396000f360606040526000357c01000000000000000000000000000000000000000000000000000000009004806311a800bc1461005a578063292b67e21461009c578063d94fe83214610149578063e9d8dbfd1461017557610058565b005b61007060048080359060200190919050506101a3565b604051808273ffffffffffffffffffffffffffffffffffffffff16815260200191505060405180910390f35b61011d6004808035906020019082018035906020019191908080601f0160208091040260200160405190810160405280939291908181526020018383808284378201915050505050509090919080359060200190919080359060200190919080359060200190919080359060200190919080359060200190919050506101ed565b604051808273ffffffffffffffffffffffffffffffffffffffff16815260200191505060405180910390f35b61015f60048080359060200190919050506102e2565b6040518082815260200191505060405180910390f35b61018b6004808035906020019091905050610320565b60405180821515815260200191505060405180910390f35b6000600060005082815481101561000257906000526020600020900160005b9054906101000a900473ffffffffffffffffffffffffffffffffffffffff1690506101e8565b919050565b600086868686868660405161128a8061040a83390180806020018773ffffffffffffffffffffffffffffffffffffffff1681526020018673ffffffffffffffffffffffffffffffffffffffff1681526020018573ffffffffffffffffffffffffffffffffffffffff1681526020018481526020018381526020018281038252888181518152602001915080519060200190808383829060006004602084601f0104600f02600301f150905090810190601f1680156102bf5780820380516001836020036101000a031916815260200191505b50975050505050505050604051809103906000f0905080505b9695505050505050565b6000600160005060008373ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060005054905061031b565b919050565b6000600073ffffffffffffffffffffffffffffffffffffffff166000600050600160005060008573ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060005054815481101561000257906000526020600020900160005b9054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16141580156103f65750600073ffffffffffffffffffffffffffffffffffffffff168273ffffffffffffffffffffffffffffffffffffffff1614155b156104045760019050610405565b5b91905056606060405260405161128a38038061128a833981016040528080518201919060200180519060200190919080519060200190919080519060200190919080519060200190919080519060200190919050505b5b33600160006101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908302179055505b8560006000509080519060200190828054600181600116156101000203166002900490600052602060002090601f016020900481019282601f106100cd57805160ff19168380011785556100fe565b828001600101855582156100fe579182015b828111156100fd5782518260005055916020019190600101906100df565b5b509050610129919061010b565b80821115610125576000818150600090555060010161010b565b5090565b505082600260006101000a81548173ffffffffffffffffffffffffffffffffffffffff02191690830217905550816003600050819055508060056000508190555084600a60006101000a81548173ffffffffffffffffffffffffffffffffffffffff0219169083021790555083600960006101000a81548173ffffffffffffffffffffffffffffffffffffffff0219169083021790555033600160006101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908302179055505b50505050505061108a806102006000396000f3606060405236156100d7576000357c01000000000000000000000000000000000000000000000000000000009004806306fdde031461011c578063084a93c81461019757806338af3eed146101c5578063394ec89d146101fe57806348cf34f11461023e578063509239c01461027e5780635c76ca2d146102aa5780637a3a0e84146102cf5780638da5cb5b146102f2578063a63c7ba21461032b578063ce3e39c014610364578063db0251e91461039d578063e184c9be146103ac578063edb444c7146103cf578063fc0c546a146103fb576100d7565b61011a5b42600860005060003373ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060005081905550610117610434565b5b565b005b61012960048050506104c0565b60405180806020018281038252838181518152602001915080519060200190808383829060006004602084601f0104600f02600301f150905090810190601f1680156101895780820380516001836020036101000a031916815260200191505b509250505060405180910390f35b6101ad6004808035906020019091905050610561565b60405180821515815260200191505060405180910390f35b6101d260048050506105a9565b604051808273ffffffffffffffffffffffffffffffffffffffff16815260200191505060405180910390f35b61020b60048050506105cf565b604051808373ffffffffffffffffffffffffffffffffffffffff1681526020018281526020019250505060405180910390f35b61024b60048050506107b5565b604051808373ffffffffffffffffffffffffffffffffffffffff1681526020018281526020019250505060405180910390f35b6102946004808035906020019091905050610acb565b6040518082815260200191505060405180910390f35b6102b76004805050610b09565b60405180821515815260200191505060405180910390f35b6102dc6004805050610b1c565b6040518082815260200191505060405180910390f35b6102ff6004805050610b25565b604051808273ffffffffffffffffffffffffffffffffffffffff16815260200191505060405180910390f35b6103386004805050610b4b565b604051808273ffffffffffffffffffffffffffffffffffffffff16815260200191505060405180910390f35b6103716004805050610cbc565b604051808273ffffffffffffffffffffffffffffffffffffffff16815260200191505060405180910390f35b6103aa6004805050610434565b005b6103b96004805050610cc2565b6040518082815260200191505060405180910390f35b6103e56004808035906020019091905050610ccb565b6040518082815260200191505060405180910390f35b6104086004805050610ce6565b604051808273ffffffffffffffffffffffffffffffffffffffff16815260200191505060405180910390f35b34600660005060003373ffffffffffffffffffffffffffffffffffffffff1681526020019081526020016000206000828282505401925050819055507f97a3367c201ad38e0d37322fd0ffa1b93457541ae8baf20eb9aa50bb83fcabef33604051808273ffffffffffffffffffffffffffffffffffffffff16815260200191505060405180910390a15b565b60006000508054600181600116156101000203166002900480601f0160208091040260200160405190810160405280929190818152602001828054600181600116156101000203166002900480156105595780601f1061052e57610100808354040283529160200191610559565b820191906000526020600020905b81548152906001019060200180831161053c57829003601f168201915b505050505081565b6000600760005060008373ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060009054906101000a900460ff1690506105a4565b919050565b600260009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1681565b600060006003600050543073ffffffffffffffffffffffffffffffffffffffff163110156107b05760001515600760005060003373ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060009054906101000a900460ff16151514156107af576005600050544211156107ae576001600760005060003373ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060006101000a81548160ff02191690830217905550336040516101cf80610cec833901808273ffffffffffffffffffffffffffffffffffffffff168152602001915050604051809103906000f091508150600660005060003373ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060005054905080508173ffffffffffffffffffffffffffffffffffffffff16600082604051809050600060405180830381858888f19350505050151561073a57610002565b7fd7774e62dd5deeb86bef491aca99a5d9f79b683438c8a8195ca8269900694447828233604051808473ffffffffffffffffffffffffffffffffffffffff1681526020018381526020018273ffffffffffffffffffffffffffffffffffffffff168152602001935050505060405180910390a15b5b5b5b9091565b600060006003600050543073ffffffffffffffffffffffffffffffffffffffff1631101515610ac657600560005054421115610ac55760001515600760005060003373ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060009054906101000a900460ff1615151415610ac457600560005054600860005060003373ffffffffffffffffffffffffffffffffffffffff168152602001908152602001600020600050541015610ac3576001600760005060003373ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060006101000a81548160ff021916908302179055503391508150600960009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1663cbcd5582600660005060008573ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060005054600860005060008673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060005054604051837c010000000000000000000000000000000000000000000000000000000002815260040180838152602001828152602001925050506020604051808303816000876161da5a03f115610002575050506040518051906020015090508050600a60009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1663a9059cbb8383604051837c0100000000000000000000000000000000000000000000000000000000028152600401808373ffffffffffffffffffffffffffffffffffffffff168152602001828152602001925050506020604051808303816000876161da5a03f115610002575050506040518051906020015015610ac2577f896e034966eaaf1adc54acc0f257056febbd300c9e47182cf761982cf1f5e4308282604051808373ffffffffffffffffffffffffffffffffffffffff1681526020018281526020019250505060405180910390a15b5b5b5b5b5b9091565b6000600660005060008373ffffffffffffffffffffffffffffffffffffffff168152602001908152602001600020600050549050610b04565b919050565b600460009054906101000a900460ff1681565b60036000505481565b600160009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1681565b60006003600050543073ffffffffffffffffffffffffffffffffffffffff1631101515610cb857600560005054421115610cb7576001600460006101000a81548160ff02191690830217905550600260009054906101000a900473ffffffffffffffffffffffffffffffffffffffff166040516101cf80610ebb833901808273ffffffffffffffffffffffffffffffffffffffff168152602001915050604051809103906000f0905080507f22c1e24047f1e0c1af6f78290547f44645cdd2ad4d06b09115a162e41460c4d5813073ffffffffffffffffffffffffffffffffffffffff1631604051808373ffffffffffffffffffffffffffffffffffffffff1681526020018281526020019250505060405180910390a18073ffffffffffffffffffffffffffffffffffffffff1660003073ffffffffffffffffffffffffffffffffffffffff1631604051809050600060405180830381858888f193505050501515610cb657610002565b5b5b5b90565b60005b90565b60056000505481565b60086000506020528060005260406000206000915090505481565b60005b905660606040526040516020806101cf833981016040528080519060200190919050505b5b33600060006101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908302179055505b80600060006101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908302179055505b50610146806100896000396000f360606040526000357c01000000000000000000000000000000000000000000000000000000009004806330509bca146100445780638da5cb5b1461005357610042565b005b610051600480505061008c565b005b6100606004805050610120565b604051808273ffffffffffffffffffffffffffffffffffffffff16815260200191505060405180910390f35b600060009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff163373ffffffffffffffffffffffffffffffffffffffff16141561011d57600060009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16ff5b5b565b600060009054906101000a900473ffffffffffffffffffffffffffffffffffffffff16815660606040526040516020806101cf833981016040528080519060200190919050505b5b33600060006101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908302179055505b80600060006101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908302179055505b50610146806100896000396000f360606040526000357c01000000000000000000000000000000000000000000000000000000009004806330509bca146100445780638da5cb5b1461005357610042565b005b610051600480505061008c565b005b6100606004805050610120565b604051808273ffffffffffffffffffffffffffffffffffffffff16815260200191505060405180910390f35b600060009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff163373ffffffffffffffffffffffffffffffffffffffff16141561011d57600060009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16ff5b5b565b600060009054906101000a900473ffffffffffffffffffffffffffffffffffffffff168156'
      },
      'HumanStandardTokenFactory': {
        'interface': [
          {
            'constant': false,
            'inputs': [
              {
                'name': '_initialAmount',
                'type': 'uint256'
              },
              {
                'name': '_name',
                'type': 'string'
              },
              {
                'name': '_decimals',
                'type': 'uint8'
              },
              {
                'name': '_symbol',
                'type': 'string'
              }
            ],
            'name': 'createHumanStandardToken',
            'outputs': [
              {
                'name': '',
                'type': 'address'
              }
            ],
            'type': 'function'
          },
          {
            'constant': true,
            'inputs': [
              {
                'name': '',
                'type': 'address'
              },
              {
                'name': '',
                'type': 'uint256'
              }
            ],
            'name': 'created',
            'outputs': [
              {
                'name': '',
                'type': 'address'
              }
            ],
            'type': 'function'
          },
          {
            'constant': true,
            'inputs': [],
            'name': 'humanStandardByteCode',
            'outputs': [
              {
                'name': '',
                'type': 'bytes'
              }
            ],
            'type': 'function'
          },
          {
            'constant': false,
            'inputs': [],
            'name': 'createdByMe',
            'outputs': [
              {
                'name': '',
                'type': 'address[]'
              }
            ],
            'type': 'function'
          },
          {
            'constant': false,
            'inputs': [
              {
                'name': '_tokenContract',
                'type': 'address'
              }
            ],
            'name': 'verifyHumanStandardToken',
            'outputs': [
              {
                'name': '',
                'type': 'bool'
              }
            ],
            'type': 'function'
          },
          {
            'inputs': [],
            'type': 'constructor'
          }
        ],
        'bytecode': '60606040525b6000610088612710604060405190810160405280600c81526020017f56657269667920546f6b656e00000000000000000000000000000000000000008152602001506003604060405190810160405280600381526020017f565458000000000000000000000000000000000000000000000000000000000081526020015061014f565b9050610093816103a0565b60016000509080519060200190828054600181600116156101000203166002900490600052602060002090601f016020900481019282601f106100e157805160ff1916838001178555610112565b82800160010185558215610112579182015b828111156101115782518260005055916020019190600101906100f3565b5b50905061013d919061011f565b80821115610139576000818150600090555060010161011f565b5090565b50505b50611847806103de6000396000f35b6000600085858585604051610ff480611c2583390180858152602001806020018460ff168152602001806020018381038352868181518152602001915080519060200190808383829060006004602084601f0104600f02600301f150905090810190601f1680156101d45780820380516001836020036101000a031916815260200191505b508381038252848181518152602001915080519060200190808383829060006004602084601f0104600f02600301f150905090810190601f16801561022d5780820380516001836020036101000a031916815260200191505b509650505050505050604051809103906000f090508073ffffffffffffffffffffffffffffffffffffffff1663a9059cbb3388604051837c0100000000000000000000000000000000000000000000000000000000028152600401808373ffffffffffffffffffffffffffffffffffffffff168152602001828152602001925050506020604051808303816000876161da5a03f115610002575050506040518051906020015050600060005060003373ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060005080548060010182818154818355818115116103505781836000526020600020918201910161034f9190610331565b8082111561034b5760008181506000905550600101610331565b5090565b5b5050509190906000526020600020900160005b83909190916101000a81548173ffffffffffffffffffffffffffffffffffffffff0219169083021790555050809150610397565b50949350505050565b6020604051908101604052806000815260200150813b6040519150601f19601f602083010116820160405280825280600060208401853c505b9190505660606040526000357c01000000000000000000000000000000000000000000000000000000009004806308216c0f146100655780635f8dead31461013e578063acad94ae14610189578063dc3f65d314610204578063fc94dd181461025b57610063565b005b6101126004808035906020019091908035906020019082018035906020019191908080601f016020809104026020016040519081016040528093929190818152602001838380828437820191505050505050909091908035906020019091908035906020019082018035906020019191908080601f016020809104026020016040519081016040528093929190818152602001838380828437820191505050505050909091905050610289565b604051808273ffffffffffffffffffffffffffffffffffffffff16815260200191505060405180910390f35b61015d60048080359060200190919080359060200190919050506104da565b604051808273ffffffffffffffffffffffffffffffffffffffff16815260200191505060405180910390f35b610196600480505061052c565b60405180806020018281038252838181518152602001915080519060200190808383829060006004602084601f0104600f02600301f150905090810190601f1680156101f65780820380516001836020036101000a031916815260200191505b509250505060405180910390f35b61021160048050506105cd565b60405180806020018281038252838181518152602001915080519060200190602002808383829060006004602084601f0104600f02600301f1509050019250505060405180910390f35b6102716004808035906020019091905050610689565b60405180821515815260200191505060405180910390f35b6000600085858585604051610ff48061085383390180858152602001806020018460ff168152602001806020018381038352868181518152602001915080519060200190808383829060006004602084601f0104600f02600301f150905090810190601f16801561030e5780820380516001836020036101000a031916815260200191505b508381038252848181518152602001915080519060200190808383829060006004602084601f0104600f02600301f150905090810190601f1680156103675780820380516001836020036101000a031916815260200191505b509650505050505050604051809103906000f090508073ffffffffffffffffffffffffffffffffffffffff1663a9059cbb3388604051837c0100000000000000000000000000000000000000000000000000000000028152600401808373ffffffffffffffffffffffffffffffffffffffff168152602001828152602001925050506020604051808303816000876161da5a03f115610002575050506040518051906020015050600060005060003373ffffffffffffffffffffffffffffffffffffffff168152602001908152602001600020600050805480600101828181548183558181151161048a57818360005260206000209182019101610489919061046b565b80821115610485576000818150600090555060010161046b565b5090565b5b5050509190906000526020600020900160005b83909190916101000a81548173ffffffffffffffffffffffffffffffffffffffff02191690830217905550508091506104d1565b50949350505050565b600060005060205281600052604060002060005081815481101561000257906000526020600020900160005b915091509054906101000a900473ffffffffffffffffffffffffffffffffffffffff1681565b60016000508054600181600116156101000203166002900480601f0160208091040260200160405190810160405280929190818152602001828054600181600116156101000203166002900480156105c55780601f1061059a576101008083540402835291602001916105c5565b820191906000526020600020905b8154815290600101906020018083116105a857829003601f168201915b505050505081565b6020604051908101604052806000815260200150600060005060003373ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060005080548060200260200160405190810160405280929190818152602001828054801561067a57602002820191906000526020600020905b8160009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1681526020019060010190808311610646575b50505050509050610686565b90565b6000602060405190810160405280600081526020015060006106aa84610815565b9150600160005080546001816001161561010002031660029004905082511415156106d8576000925061080e565b600090505b815181101561080557600160005081815460018160011615610100020316600290048110156100025790908154600116156107275790600052602060002090602091828204019190065b9054901a7f0100000000000000000000000000000000000000000000000000000000000000027effffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff191682828151811015610002579060200101517f010000000000000000000000000000000000000000000000000000000000000090047f0100000000000000000000000000000000000000000000000000000000000000027effffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff19161415156107f7576000925061080e565b5b80806001019150506106dd565b6001925061080e565b5050919050565b6020604051908101604052806000815260200150813b6040519150601f19601f602083010116820160405280825280600060208401853c505b919050566060604052604060405190810160405280600481526020017f48302e310000000000000000000000000000000000000000000000000000000081526020015060066000509080519060200190828054600181600116156101000203166002900490600052602060002090601f016020900481019282601f1061008c57805160ff19168380011785556100bd565b828001600101855582156100bd579182015b828111156100bc57825182600050559160200191906001019061009e565b5b5090506100e891906100ca565b808211156100e457600081815060009055506001016100ca565b5090565b5050604051610ff4380380610ff4833981016040528080519060200190919080518201919060200180519060200190919080518201919060200150505b83600060005060003373ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060005081905550836002600050819055508260036000509080519060200190828054600181600116156101000203166002900490600052602060002090601f016020900481019282601f106101b257805160ff19168380011785556101e3565b828001600101855582156101e3579182015b828111156101e25782518260005055916020019190600101906101c4565b5b50905061020e91906101f0565b8082111561020a57600081815060009055506001016101f0565b5090565b505081600460006101000a81548160ff021916908302179055508060056000509080519060200190828054600181600116156101000203166002900490600052602060002090601f016020900481019282601f1061027757805160ff19168380011785556102a8565b828001600101855582156102a8579182015b828111156102a7578251826000505591602001919060010190610289565b5b5090506102d391906102b5565b808211156102cf57600081815060009055506001016102b5565b5090565b50505b50505050610d0c806102e86000396000f3606060405236156100ab576000357c01000000000000000000000000000000000000000000000000000000009004806306fdde03146100b8578063095ea7b31461013357806318160ddd1461016a57806323b872dd1461018d578063313ce567146101cd57806354fd4d50146101f357806370a082311461026e57806395d89b411461029a578063a9059cbb14610315578063cae9ca511461034c578063dd62ed3e146103ca576100ab565b6100b65b610002565b565b005b6100c560048050506103ff565b60405180806020018281038252838181518152602001915080519060200190808383829060006004602084601f0104600f02600301f150905090810190601f1680156101255780820380516001836020036101000a031916815260200191505b509250505060405180910390f35b61015260048080359060200190919080359060200190919050506104a0565b60405180821515815260200191505060405180910390f35b6101776004805050610574565b6040518082815260200191505060405180910390f35b6101b5600480803590602001909190803590602001909190803590602001909190505061057d565b60405180821515815260200191505060405180910390f35b6101da6004805050610789565b604051808260ff16815260200191505060405180910390f35b610200600480505061079c565b60405180806020018281038252838181518152602001915080519060200190808383829060006004602084601f0104600f02600301f150905090810190601f1680156102605780820380516001836020036101000a031916815260200191505b509250505060405180910390f35b610284600480803590602001909190505061083d565b6040518082815260200191505060405180910390f35b6102a7600480505061087b565b60405180806020018281038252838181518152602001915080519060200190808383829060006004602084601f0104600f02600301f150905090810190601f1680156103075780820380516001836020036101000a031916815260200191505b509250505060405180910390f35b610334600480803590602001909190803590602001909190505061091c565b60405180821515815260200191505060405180910390f35b6103b26004808035906020019091908035906020019091908035906020019082018035906020019191908080601f016020809104026020016040519081016040528093929190818152602001838380828437820191505050505050909091905050610a5c565b60405180821515815260200191505060405180910390f35b6103e96004808035906020019091908035906020019091905050610ca3565b6040518082815260200191505060405180910390f35b60036000508054600181600116156101000203166002900480601f0160208091040260200160405190810160405280929190818152602001828054600181600116156101000203166002900480156104985780601f1061046d57610100808354040283529160200191610498565b820191906000526020600020905b81548152906001019060200180831161047b57829003601f168201915b505050505081565b600081600160005060003373ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060005060008573ffffffffffffffffffffffffffffffffffffffff168152602001908152602001600020600050819055508273ffffffffffffffffffffffffffffffffffffffff163373ffffffffffffffffffffffffffffffffffffffff167f8c5be1e5ebec7d5bd14f71427d1e84f3dd0314c0f7b2291e5b200ac8c7c3b925846040518082815260200191505060405180910390a36001905061056e565b92915050565b60026000505481565b600081600060005060008673ffffffffffffffffffffffffffffffffffffffff1681526020019081526020016000206000505410158015610617575081600160005060008673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060005060003373ffffffffffffffffffffffffffffffffffffffff1681526020019081526020016000206000505410155b80156106235750600082115b156107785781600060005060008573ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060008282825054019250508190555081600060005060008673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060008282825054039250508190555081600160005060008673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060005060003373ffffffffffffffffffffffffffffffffffffffff1681526020019081526020016000206000828282505403925050819055508273ffffffffffffffffffffffffffffffffffffffff168473ffffffffffffffffffffffffffffffffffffffff167fddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef846040518082815260200191505060405180910390a36001905061078256610781565b60009050610782565b5b9392505050565b600460009054906101000a900460ff1681565b60066000508054600181600116156101000203166002900480601f0160208091040260200160405190810160405280929190818152602001828054600181600116156101000203166002900480156108355780601f1061080a57610100808354040283529160200191610835565b820191906000526020600020905b81548152906001019060200180831161081857829003601f168201915b505050505081565b6000600060005060008373ffffffffffffffffffffffffffffffffffffffff168152602001908152602001600020600050549050610876565b919050565b60056000508054600181600116156101000203166002900480601f0160208091040260200160405190810160405280929190818152602001828054600181600116156101000203166002900480156109145780601f106108e957610100808354040283529160200191610914565b820191906000526020600020905b8154815290600101906020018083116108f757829003601f168201915b505050505081565b600081600060005060003373ffffffffffffffffffffffffffffffffffffffff168152602001908152602001600020600050541015801561095d5750600082115b15610a4c5781600060005060003373ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060008282825054039250508190555081600060005060008573ffffffffffffffffffffffffffffffffffffffff1681526020019081526020016000206000828282505401925050819055508273ffffffffffffffffffffffffffffffffffffffff163373ffffffffffffffffffffffffffffffffffffffff167fddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef846040518082815260200191505060405180910390a360019050610a5656610a55565b60009050610a56565b5b92915050565b600082600160005060003373ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060005060008673ffffffffffffffffffffffffffffffffffffffff168152602001908152602001600020600050819055508373ffffffffffffffffffffffffffffffffffffffff163373ffffffffffffffffffffffffffffffffffffffff167f8c5be1e5ebec7d5bd14f71427d1e84f3dd0314c0f7b2291e5b200ac8c7c3b925856040518082815260200191505060405180910390a38373ffffffffffffffffffffffffffffffffffffffff1660405180807f72656365697665417070726f76616c28616464726573732c75696e743235362c81526020017f616464726573732c627974657329000000000000000000000000000000000000815260200150602e01905060405180910390207c0100000000000000000000000000000000000000000000000000000000900433853086604051857c0100000000000000000000000000000000000000000000000000000000028152600401808573ffffffffffffffffffffffffffffffffffffffff1681526020018481526020018373ffffffffffffffffffffffffffffffffffffffff1681526020018280519060200190808383829060006004602084601f0104600f02600301f150905090810190601f168015610c6b5780820380516001836020036101000a031916815260200191505b509450505050506000604051808303816000876161da5a03f1925050501515610c9357610002565b60019050610c9c565b9392505050565b6000600160005060008473ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060005060008373ffffffffffffffffffffffffffffffffffffffff168152602001908152602001600020600050549050610d06565b92915050566060604052604060405190810160405280600481526020017f48302e310000000000000000000000000000000000000000000000000000000081526020015060066000509080519060200190828054600181600116156101000203166002900490600052602060002090601f016020900481019282601f1061008c57805160ff19168380011785556100bd565b828001600101855582156100bd579182015b828111156100bc57825182600050559160200191906001019061009e565b5b5090506100e891906100ca565b808211156100e457600081815060009055506001016100ca565b5090565b5050604051610ff4380380610ff4833981016040528080519060200190919080518201919060200180519060200190919080518201919060200150505b83600060005060003373ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060005081905550836002600050819055508260036000509080519060200190828054600181600116156101000203166002900490600052602060002090601f016020900481019282601f106101b257805160ff19168380011785556101e3565b828001600101855582156101e3579182015b828111156101e25782518260005055916020019190600101906101c4565b5b50905061020e91906101f0565b8082111561020a57600081815060009055506001016101f0565b5090565b505081600460006101000a81548160ff021916908302179055508060056000509080519060200190828054600181600116156101000203166002900490600052602060002090601f016020900481019282601f1061027757805160ff19168380011785556102a8565b828001600101855582156102a8579182015b828111156102a7578251826000505591602001919060010190610289565b5b5090506102d391906102b5565b808211156102cf57600081815060009055506001016102b5565b5090565b50505b50505050610d0c806102e86000396000f3606060405236156100ab576000357c01000000000000000000000000000000000000000000000000000000009004806306fdde03146100b8578063095ea7b31461013357806318160ddd1461016a57806323b872dd1461018d578063313ce567146101cd57806354fd4d50146101f357806370a082311461026e57806395d89b411461029a578063a9059cbb14610315578063cae9ca511461034c578063dd62ed3e146103ca576100ab565b6100b65b610002565b565b005b6100c560048050506103ff565b60405180806020018281038252838181518152602001915080519060200190808383829060006004602084601f0104600f02600301f150905090810190601f1680156101255780820380516001836020036101000a031916815260200191505b509250505060405180910390f35b61015260048080359060200190919080359060200190919050506104a0565b60405180821515815260200191505060405180910390f35b6101776004805050610574565b6040518082815260200191505060405180910390f35b6101b5600480803590602001909190803590602001909190803590602001909190505061057d565b60405180821515815260200191505060405180910390f35b6101da6004805050610789565b604051808260ff16815260200191505060405180910390f35b610200600480505061079c565b60405180806020018281038252838181518152602001915080519060200190808383829060006004602084601f0104600f02600301f150905090810190601f1680156102605780820380516001836020036101000a031916815260200191505b509250505060405180910390f35b610284600480803590602001909190505061083d565b6040518082815260200191505060405180910390f35b6102a7600480505061087b565b60405180806020018281038252838181518152602001915080519060200190808383829060006004602084601f0104600f02600301f150905090810190601f1680156103075780820380516001836020036101000a031916815260200191505b509250505060405180910390f35b610334600480803590602001909190803590602001909190505061091c565b60405180821515815260200191505060405180910390f35b6103b26004808035906020019091908035906020019091908035906020019082018035906020019191908080601f016020809104026020016040519081016040528093929190818152602001838380828437820191505050505050909091905050610a5c565b60405180821515815260200191505060405180910390f35b6103e96004808035906020019091908035906020019091905050610ca3565b6040518082815260200191505060405180910390f35b60036000508054600181600116156101000203166002900480601f0160208091040260200160405190810160405280929190818152602001828054600181600116156101000203166002900480156104985780601f1061046d57610100808354040283529160200191610498565b820191906000526020600020905b81548152906001019060200180831161047b57829003601f168201915b505050505081565b600081600160005060003373ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060005060008573ffffffffffffffffffffffffffffffffffffffff168152602001908152602001600020600050819055508273ffffffffffffffffffffffffffffffffffffffff163373ffffffffffffffffffffffffffffffffffffffff167f8c5be1e5ebec7d5bd14f71427d1e84f3dd0314c0f7b2291e5b200ac8c7c3b925846040518082815260200191505060405180910390a36001905061056e565b92915050565b60026000505481565b600081600060005060008673ffffffffffffffffffffffffffffffffffffffff1681526020019081526020016000206000505410158015610617575081600160005060008673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060005060003373ffffffffffffffffffffffffffffffffffffffff1681526020019081526020016000206000505410155b80156106235750600082115b156107785781600060005060008573ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060008282825054019250508190555081600060005060008673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060008282825054039250508190555081600160005060008673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060005060003373ffffffffffffffffffffffffffffffffffffffff1681526020019081526020016000206000828282505403925050819055508273ffffffffffffffffffffffffffffffffffffffff168473ffffffffffffffffffffffffffffffffffffffff167fddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef846040518082815260200191505060405180910390a36001905061078256610781565b60009050610782565b5b9392505050565b600460009054906101000a900460ff1681565b60066000508054600181600116156101000203166002900480601f0160208091040260200160405190810160405280929190818152602001828054600181600116156101000203166002900480156108355780601f1061080a57610100808354040283529160200191610835565b820191906000526020600020905b81548152906001019060200180831161081857829003601f168201915b505050505081565b6000600060005060008373ffffffffffffffffffffffffffffffffffffffff168152602001908152602001600020600050549050610876565b919050565b60056000508054600181600116156101000203166002900480601f0160208091040260200160405190810160405280929190818152602001828054600181600116156101000203166002900480156109145780601f106108e957610100808354040283529160200191610914565b820191906000526020600020905b8154815290600101906020018083116108f757829003601f168201915b505050505081565b600081600060005060003373ffffffffffffffffffffffffffffffffffffffff168152602001908152602001600020600050541015801561095d5750600082115b15610a4c5781600060005060003373ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060008282825054039250508190555081600060005060008573ffffffffffffffffffffffffffffffffffffffff1681526020019081526020016000206000828282505401925050819055508273ffffffffffffffffffffffffffffffffffffffff163373ffffffffffffffffffffffffffffffffffffffff167fddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef846040518082815260200191505060405180910390a360019050610a5656610a55565b60009050610a56565b5b92915050565b600082600160005060003373ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060005060008673ffffffffffffffffffffffffffffffffffffffff168152602001908152602001600020600050819055508373ffffffffffffffffffffffffffffffffffffffff163373ffffffffffffffffffffffffffffffffffffffff167f8c5be1e5ebec7d5bd14f71427d1e84f3dd0314c0f7b2291e5b200ac8c7c3b925856040518082815260200191505060405180910390a38373ffffffffffffffffffffffffffffffffffffffff1660405180807f72656365697665417070726f76616c28616464726573732c75696e743235362c81526020017f616464726573732c627974657329000000000000000000000000000000000000815260200150602e01905060405180910390207c0100000000000000000000000000000000000000000000000000000000900433853086604051857c0100000000000000000000000000000000000000000000000000000000028152600401808573ffffffffffffffffffffffffffffffffffffffff1681526020018481526020018373ffffffffffffffffffffffffffffffffffffffff1681526020018280519060200190808383829060006004602084601f0104600f02600301f150905090810190601f168015610c6b5780820380516001836020036101000a031916815260200191505b509450505050506000604051808303816000876161da5a03f1925050501515610c9357610002565b60019050610c9c565b9392505050565b6000600160005060008473ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060005060008373ffffffffffffffffffffffffffffffffffffffff168152602001908152602001600020600050549050610d06565b9291505056'
      },
      'Named': {
        'interface': [
          {
            'constant': true,
            'inputs': [],
            'name': 'name',
            'outputs': [
              {
                'name': '',
                'type': 'string'
              }
            ],
            'type': 'function'
          }
        ],
        'bytecode': '6060604052610155806100126000396000f360606040526000357c01000000000000000000000000000000000000000000000000000000009004806306fdde031461003957610037565b005b61004660048050506100b4565b60405180806020018281038252838181518152602001915080519060200190808383829060006004602084601f0104600f02600301f150905090810190601f1680156100a65780820380516001836020036101000a031916815260200191505b509250505060405180910390f35b60006000508054600181600116156101000203166002900480601f01602080910402602001604051908101604052809291908181526020018280546001816001161561010002031660029004801561014d5780601f106101225761010080835404028352916020019161014d565b820191906000526020600020905b81548152906001019060200180831161013057829003601f168201915b50505050508156'
      },
      'Owned': {
        'interface': [
          {
            'constant': true,
            'inputs': [],
            'name': 'owner',
            'outputs': [
              {
                'name': '',
                'type': 'address'
              }
            ],
            'type': 'function'
          },
          {
            'inputs': [],
            'type': 'constructor'
          }
        ],
        'bytecode': '60606040525b33600060006101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908302179055505b609480603d6000396000f360606040526000357c0100000000000000000000000000000000000000000000000000000000900480638da5cb5b146037576035565b005b60426004805050606e565b604051808273ffffffffffffffffffffffffffffffffffffffff16815260200191505060405180910390f35b600060009054906101000a900473ffffffffffffffffffffffffffffffffffffffff168156'
      },
      'PrivateServiceRegistry': {
        'interface': [
          {
            'constant': true,
            'inputs': [
              {
                'name': '_serviceId',
                'type': 'uint256'
              }
            ],
            'name': 'addressOf',
            'outputs': [
              {
                'name': 'service',
                'type': 'address'
              }
            ],
            'type': 'function'
          },
          {
            'constant': true,
            'inputs': [
              {
                'name': '_service',
                'type': 'address'
              }
            ],
            'name': 'idOf',
            'outputs': [
              {
                'name': 'id',
                'type': 'uint256'
              }
            ],
            'type': 'function'
          },
          {
            'constant': true,
            'inputs': [
              {
                'name': '_service',
                'type': 'address'
              }
            ],
            'name': 'isService',
            'outputs': [
              {
                'name': 'registered',
                'type': 'bool'
              }
            ],
            'type': 'function'
          },
          {
            'anonymous': false,
            'inputs': [
              {
                'indexed': false,
                'name': '_service',
                'type': 'address'
              },
              {
                'indexed': false,
                'name': '_serviceId',
                'type': 'uint256'
              }
            ],
            'name': 'ServiceRegistered',
            'type': 'event'
          }
        ],
        'bytecode': '606060405261025d806100126000396000f360606040526000357c01000000000000000000000000000000000000000000000000000000009004806311a800bc1461004f578063d94fe83214610091578063e9d8dbfd146100bd5761004d565b005b61006560048080359060200190919050506100eb565b604051808273ffffffffffffffffffffffffffffffffffffffff16815260200191505060405180910390f35b6100a76004808035906020019091905050610135565b6040518082815260200191505060405180910390f35b6100d36004808035906020019091905050610173565b60405180821515815260200191505060405180910390f35b6000600060005082815481101561000257906000526020600020900160005b9054906101000a900473ffffffffffffffffffffffffffffffffffffffff169050610130565b919050565b6000600160005060008373ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060005054905061016e565b919050565b6000600073ffffffffffffffffffffffffffffffffffffffff166000600050600160005060008573ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060005054815481101561000257906000526020600020900160005b9054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16141580156102495750600073ffffffffffffffffffffffffffffffffffffffff168273ffffffffffffffffffffffffffffffffffffffff1614155b156102575760019050610258565b5b91905056'
      },
      'PrivateServiceRegistryInterface': {
        'interface': [
          {
            'constant': true,
            'inputs': [
              {
                'name': '_serviceId',
                'type': 'uint256'
              }
            ],
            'name': 'addressOf',
            'outputs': [
              {
                'name': 'service',
                'type': 'address'
              }
            ],
            'type': 'function'
          },
          {
            'constant': true,
            'inputs': [
              {
                'name': '_service',
                'type': 'address'
              }
            ],
            'name': 'idOf',
            'outputs': [
              {
                'name': 'id',
                'type': 'uint256'
              }
            ],
            'type': 'function'
          },
          {
            'constant': true,
            'inputs': [
              {
                'name': '_service',
                'type': 'address'
              }
            ],
            'name': 'isService',
            'outputs': [
              {
                'name': 'registered',
                'type': 'bool'
              }
            ],
            'type': 'function'
          },
          {
            'anonymous': false,
            'inputs': [
              {
                'indexed': false,
                'name': '_service',
                'type': 'address'
              },
              {
                'indexed': false,
                'name': '_serviceId',
                'type': 'uint256'
              }
            ],
            'name': 'ServiceRegistered',
            'type': 'event'
          }
        ],
        'bytecode': ''
      },
      'StaffPicks': {
        'interface': [
          {
            'constant': true,
            'inputs': [
              {
                'name': '',
                'type': 'uint256'
              }
            ],
            'name': 'pickedCampaigns',
            'outputs': [
              {
                'name': '',
                'type': 'address'
              }
            ],
            'type': 'function'
          },
          {
            'constant': true,
            'inputs': [
              {
                'name': '',
                'type': 'address'
              }
            ],
            'name': 'activePicks',
            'outputs': [
              {
                'name': '',
                'type': 'bool'
              }
            ],
            'type': 'function'
          },
          {
            'constant': false,
            'inputs': [
              {
                'name': '_campaign',
                'type': 'address'
              }
            ],
            'name': 'deactivate',
            'outputs': [],
            'type': 'function'
          },
          {
            'constant': false,
            'inputs': [
              {
                'name': '_campaign',
                'type': 'address'
              }
            ],
            'name': 'register',
            'outputs': [],
            'type': 'function'
          },
          {
            'constant': true,
            'inputs': [],
            'name': 'owner',
            'outputs': [
              {
                'name': '',
                'type': 'address'
              }
            ],
            'type': 'function'
          }
        ],
        'bytecode': '60606040525b33600060006101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908302179055505b6103988061003f6000396000f360606040526000357c0100000000000000000000000000000000000000000000000000000000900480632cd535c214610065578063378ed698146100a75780633ea053eb146100d55780634420e486146100ed5780638da5cb5b1461010557610063565b005b61007b600480803590602001909190505061013e565b604051808273ffffffffffffffffffffffffffffffffffffffff16815260200191505060405180910390f35b6100bd6004808035906020019091905050610180565b60405180821515815260200191505060405180910390f35b6100eb60048080359060200190919050506101a5565b005b6101036004808035906020019091905050610243565b005b6101126004805050610372565b604051808273ffffffffffffffffffffffffffffffffffffffff16815260200191505060405180910390f35b600260005081815481101561000257906000526020600020900160005b9150909054906101000a900473ffffffffffffffffffffffffffffffffffffffff1681565b600160005060205280600052604060002060009150909054906101000a900460ff1681565b600060009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff163373ffffffffffffffffffffffffffffffffffffffff16141561023f576000600160005060008373ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060006101000a81548160ff021916908302179055505b5b50565b600060009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff163373ffffffffffffffffffffffffffffffffffffffff16141561036e576001600160005060008373ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060006101000a81548160ff021916908302179055506002600050805480600101828181548183558181151161032e5781836000526020600020918201910161032d919061030f565b80821115610329576000818150600090555060010161030f565b5090565b5b5050509190906000526020600020900160005b83909190916101000a81548173ffffffffffffffffffffffffffffffffffffffff02191690830217905550505b5b50565b600060009054906101000a900473ffffffffffffffffffffffffffffffffffffffff168156'
      },
      'StandardCampaign': {
        'interface': [
          {
            'constant': true,
            'inputs': [
              {
                'name': '_contributor',
                'type': 'address'
              }
            ],
            'name': 'claimMadeBy',
            'outputs': [
              {
                'name': 'claimWasMade',
                'type': 'bool'
              }
            ],
            'type': 'function'
          },
          {
            'constant': true,
            'inputs': [],
            'name': 'beneficiary',
            'outputs': [
              {
                'name': '',
                'type': 'address'
              }
            ],
            'type': 'function'
          },
          {
            'constant': false,
            'inputs': [],
            'name': 'claimRefundOwed',
            'outputs': [
              {
                'name': 'claimProxy',
                'type': 'address'
              },
              {
                'name': 'refundAmount',
                'type': 'uint256'
              }
            ],
            'type': 'function'
          },
          {
            'constant': true,
            'inputs': [
              {
                'name': '_contributor',
                'type': 'address'
              }
            ],
            'name': 'amountContributedBy',
            'outputs': [
              {
                'name': 'amountContributed',
                'type': 'uint256'
              }
            ],
            'type': 'function'
          },
          {
            'constant': true,
            'inputs': [],
            'name': 'paidOut',
            'outputs': [
              {
                'name': '',
                'type': 'bool'
              }
            ],
            'type': 'function'
          },
          {
            'constant': true,
            'inputs': [],
            'name': 'fundingGoal',
            'outputs': [
              {
                'name': '',
                'type': 'uint256'
              }
            ],
            'type': 'function'
          },
          {
            'constant': true,
            'inputs': [],
            'name': 'owner',
            'outputs': [
              {
                'name': '',
                'type': 'address'
              }
            ],
            'type': 'function'
          },
          {
            'constant': false,
            'inputs': [],
            'name': 'payoutToBeneficiary',
            'outputs': [
              {
                'name': 'claimProxy',
                'type': 'address'
              }
            ],
            'type': 'function'
          },
          {
            'constant': false,
            'inputs': [],
            'name': 'contributeMsgValue',
            'outputs': [],
            'type': 'function'
          },
          {
            'constant': true,
            'inputs': [],
            'name': 'expiry',
            'outputs': [
              {
                'name': '',
                'type': 'uint256'
              }
            ],
            'type': 'function'
          },
          {
            'anonymous': false,
            'inputs': [
              {
                'indexed': false,
                'name': '_contributor',
                'type': 'address'
              }
            ],
            'name': 'ContributionMade',
            'type': 'event'
          },
          {
            'anonymous': false,
            'inputs': [
              {
                'indexed': false,
                'name': '_claimProxy',
                'type': 'address'
              },
              {
                'indexed': false,
                'name': '_payoutAmount',
                'type': 'uint256'
              }
            ],
            'name': 'BeneficiaryPayoutClaimed',
            'type': 'event'
          },
          {
            'anonymous': false,
            'inputs': [
              {
                'indexed': false,
                'name': '_claimProxy',
                'type': 'address'
              },
              {
                'indexed': false,
                'name': '_refundAmount',
                'type': 'uint256'
              },
              {
                'indexed': false,
                'name': '_contributor',
                'type': 'address'
              }
            ],
            'name': 'ContributorRefundClaimed',
            'type': 'event'
          }
        ],
        'bytecode': '60606040525b33600060006101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908302179055505b610ae88061003f6000396000f3606060405236156100a0576000357c010000000000000000000000000000000000000000000000000000000090048063084a93c8146100b157806338af3eed146100df578063394ec89d14610118578063509239c0146101585780635c76ca2d146101845780637a3a0e84146101a95780638da5cb5b146101cc578063a63c7ba214610205578063db0251e91461023e578063e184c9be1461024d576100a0565b6100af5b6100ac610270565b5b565b005b6100c760048080359060200190919050506102fc565b60405180821515815260200191505060405180910390f35b6100ec6004805050610344565b604051808273ffffffffffffffffffffffffffffffffffffffff16815260200191505060405180910390f35b610125600480505061036a565b604051808373ffffffffffffffffffffffffffffffffffffffff1681526020018281526020019250505060405180910390f35b61016e6004808035906020019091905050610550565b6040518082815260200191505060405180910390f35b610191600480505061058e565b60405180821515815260200191505060405180910390f35b6101b660048050506105a1565b6040518082815260200191505060405180910390f35b6101d960048050506105aa565b604051808273ffffffffffffffffffffffffffffffffffffffff16815260200191505060405180910390f35b61021260048050506105d0565b604051808273ffffffffffffffffffffffffffffffffffffffff16815260200191505060405180910390f35b61024b6004805050610270565b005b61025a6004805050610741565b6040518082815260200191505060405180910390f35b34600560005060003373ffffffffffffffffffffffffffffffffffffffff1681526020019081526020016000206000828282505401925050819055507f97a3367c201ad38e0d37322fd0ffa1b93457541ae8baf20eb9aa50bb83fcabef33604051808273ffffffffffffffffffffffffffffffffffffffff16815260200191505060405180910390a15b565b6000600660005060008373ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060009054906101000a900460ff16905061033f565b919050565b600160009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1681565b600060006002600050543073ffffffffffffffffffffffffffffffffffffffff1631101561054b5760001515600660005060003373ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060009054906101000a900460ff161515141561054a57600460005054421115610549576001600660005060003373ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060006101000a81548160ff02191690830217905550336040516101cf8061074a833901808273ffffffffffffffffffffffffffffffffffffffff168152602001915050604051809103906000f091508150600560005060003373ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060005054905080508173ffffffffffffffffffffffffffffffffffffffff16600082604051809050600060405180830381858888f1935050505015156104d557610002565b7fd7774e62dd5deeb86bef491aca99a5d9f79b683438c8a8195ca8269900694447828233604051808473ffffffffffffffffffffffffffffffffffffffff1681526020018381526020018273ffffffffffffffffffffffffffffffffffffffff168152602001935050505060405180910390a15b5b5b5b9091565b6000600560005060008373ffffffffffffffffffffffffffffffffffffffff168152602001908152602001600020600050549050610589565b919050565b600360009054906101000a900460ff1681565b60026000505481565b600060009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1681565b60006002600050543073ffffffffffffffffffffffffffffffffffffffff163110151561073d5760046000505442111561073c576001600360006101000a81548160ff02191690830217905550600160009054906101000a900473ffffffffffffffffffffffffffffffffffffffff166040516101cf80610919833901808273ffffffffffffffffffffffffffffffffffffffff168152602001915050604051809103906000f0905080507f22c1e24047f1e0c1af6f78290547f44645cdd2ad4d06b09115a162e41460c4d5813073ffffffffffffffffffffffffffffffffffffffff1631604051808373ffffffffffffffffffffffffffffffffffffffff1681526020018281526020019250505060405180910390a18073ffffffffffffffffffffffffffffffffffffffff1660003073ffffffffffffffffffffffffffffffffffffffff1631604051809050600060405180830381858888f19350505050151561073b57610002565b5b5b5b90565b600460005054815660606040526040516020806101cf833981016040528080519060200190919050505b5b33600060006101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908302179055505b80600060006101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908302179055505b50610146806100896000396000f360606040526000357c01000000000000000000000000000000000000000000000000000000009004806330509bca146100445780638da5cb5b1461005357610042565b005b610051600480505061008c565b005b6100606004805050610120565b604051808273ffffffffffffffffffffffffffffffffffffffff16815260200191505060405180910390f35b600060009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff163373ffffffffffffffffffffffffffffffffffffffff16141561011d57600060009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16ff5b5b565b600060009054906101000a900473ffffffffffffffffffffffffffffffffffffffff16815660606040526040516020806101cf833981016040528080519060200190919050505b5b33600060006101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908302179055505b80600060006101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908302179055505b50610146806100896000396000f360606040526000357c01000000000000000000000000000000000000000000000000000000009004806330509bca146100445780638da5cb5b1461005357610042565b005b610051600480505061008c565b005b6100606004805050610120565b604051808273ffffffffffffffffffffffffffffffffffffffff16815260200191505060405180910390f35b600060009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff163373ffffffffffffffffffffffffffffffffffffffff16141561011d57600060009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16ff5b5b565b600060009054906101000a900473ffffffffffffffffffffffffffffffffffffffff168156'
      },
      'StandardToken': {
        'interface': [
          {
            'constant': false,
            'inputs': [
              {
                'name': '_spender',
                'type': 'address'
              },
              {
                'name': '_value',
                'type': 'uint256'
              }
            ],
            'name': 'approve',
            'outputs': [
              {
                'name': 'success',
                'type': 'bool'
              }
            ],
            'type': 'function'
          },
          {
            'constant': true,
            'inputs': [],
            'name': 'totalSupply',
            'outputs': [
              {
                'name': '',
                'type': 'uint256'
              }
            ],
            'type': 'function'
          },
          {
            'constant': false,
            'inputs': [
              {
                'name': '_from',
                'type': 'address'
              },
              {
                'name': '_to',
                'type': 'address'
              },
              {
                'name': '_value',
                'type': 'uint256'
              }
            ],
            'name': 'transferFrom',
            'outputs': [
              {
                'name': 'success',
                'type': 'bool'
              }
            ],
            'type': 'function'
          },
          {
            'constant': true,
            'inputs': [
              {
                'name': '_owner',
                'type': 'address'
              }
            ],
            'name': 'balanceOf',
            'outputs': [
              {
                'name': 'balance',
                'type': 'uint256'
              }
            ],
            'type': 'function'
          },
          {
            'constant': false,
            'inputs': [
              {
                'name': '_to',
                'type': 'address'
              },
              {
                'name': '_value',
                'type': 'uint256'
              }
            ],
            'name': 'transfer',
            'outputs': [
              {
                'name': 'success',
                'type': 'bool'
              }
            ],
            'type': 'function'
          },
          {
            'constant': true,
            'inputs': [
              {
                'name': '_owner',
                'type': 'address'
              },
              {
                'name': '_spender',
                'type': 'address'
              }
            ],
            'name': 'allowance',
            'outputs': [
              {
                'name': 'remaining',
                'type': 'uint256'
              }
            ],
            'type': 'function'
          },
          {
            'anonymous': false,
            'inputs': [
              {
                'indexed': true,
                'name': '_from',
                'type': 'address'
              },
              {
                'indexed': true,
                'name': '_to',
                'type': 'address'
              },
              {
                'indexed': false,
                'name': '_value',
                'type': 'uint256'
              }
            ],
            'name': 'Transfer',
            'type': 'event'
          },
          {
            'anonymous': false,
            'inputs': [
              {
                'indexed': true,
                'name': '_owner',
                'type': 'address'
              },
              {
                'indexed': true,
                'name': '_spender',
                'type': 'address'
              },
              {
                'indexed': false,
                'name': '_value',
                'type': 'uint256'
              }
            ],
            'name': 'Approval',
            'type': 'event'
          }
        ],
        'bytecode': '6060604052610678806100126000396000f360606040523615610074576000357c010000000000000000000000000000000000000000000000000000000090048063095ea7b31461007657806318160ddd146100ad57806323b872dd146100d057806370a0823114610110578063a9059cbb1461013c578063dd62ed3e1461017357610074565b005b61009560048080359060200190919080359060200190919050506101a8565b60405180821515815260200191505060405180910390f35b6100ba600480505061027c565b6040518082815260200191505060405180910390f35b6100f86004808035906020019091908035906020019091908035906020019091905050610285565b60405180821515815260200191505060405180910390f35b6101266004808035906020019091905050610491565b6040518082815260200191505060405180910390f35b61015b60048080359060200190919080359060200190919050506104cf565b60405180821515815260200191505060405180910390f35b610192600480803590602001909190803590602001909190505061060f565b6040518082815260200191505060405180910390f35b600081600160005060003373ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060005060008573ffffffffffffffffffffffffffffffffffffffff168152602001908152602001600020600050819055508273ffffffffffffffffffffffffffffffffffffffff163373ffffffffffffffffffffffffffffffffffffffff167f8c5be1e5ebec7d5bd14f71427d1e84f3dd0314c0f7b2291e5b200ac8c7c3b925846040518082815260200191505060405180910390a360019050610276565b92915050565b60026000505481565b600081600060005060008673ffffffffffffffffffffffffffffffffffffffff168152602001908152602001600020600050541015801561031f575081600160005060008673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060005060003373ffffffffffffffffffffffffffffffffffffffff1681526020019081526020016000206000505410155b801561032b5750600082115b156104805781600060005060008573ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060008282825054019250508190555081600060005060008673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060008282825054039250508190555081600160005060008673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060005060003373ffffffffffffffffffffffffffffffffffffffff1681526020019081526020016000206000828282505403925050819055508273ffffffffffffffffffffffffffffffffffffffff168473ffffffffffffffffffffffffffffffffffffffff167fddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef846040518082815260200191505060405180910390a36001905061048a56610489565b6000905061048a565b5b9392505050565b6000600060005060008373ffffffffffffffffffffffffffffffffffffffff1681526020019081526020016000206000505490506104ca565b919050565b600081600060005060003373ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060005054101580156105105750600082115b156105ff5781600060005060003373ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060008282825054039250508190555081600060005060008573ffffffffffffffffffffffffffffffffffffffff1681526020019081526020016000206000828282505401925050819055508273ffffffffffffffffffffffffffffffffffffffff163373ffffffffffffffffffffffffffffffffffffffff167fddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef846040518082815260200191505060405180910390a36001905061060956610608565b60009050610609565b5b92915050565b6000600160005060008473ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060005060008373ffffffffffffffffffffffffffffffffffffffff168152602001908152602001600020600050549050610672565b9291505056'
      },
      'StandardTokenCampaign': {
        'interface': [
          {
            'constant': true,
            'inputs': [
              {
                'name': '_contributor',
                'type': 'address'
              }
            ],
            'name': 'claimMadeBy',
            'outputs': [
              {
                'name': 'claimWasMade',
                'type': 'bool'
              }
            ],
            'type': 'function'
          },
          {
            'constant': true,
            'inputs': [],
            'name': 'beneficiary',
            'outputs': [
              {
                'name': '',
                'type': 'address'
              }
            ],
            'type': 'function'
          },
          {
            'constant': false,
            'inputs': [],
            'name': 'claimRefundOwed',
            'outputs': [
              {
                'name': 'claimProxy',
                'type': 'address'
              },
              {
                'name': 'refundAmount',
                'type': 'uint256'
              }
            ],
            'type': 'function'
          },
          {
            'constant': false,
            'inputs': [],
            'name': 'claimTokensOwed',
            'outputs': [
              {
                'name': 'contributor',
                'type': 'address'
              },
              {
                'name': 'tokenAmountClaimed',
                'type': 'uint256'
              }
            ],
            'type': 'function'
          },
          {
            'constant': true,
            'inputs': [
              {
                'name': '_contributor',
                'type': 'address'
              }
            ],
            'name': 'amountContributedBy',
            'outputs': [
              {
                'name': 'amountContributed',
                'type': 'uint256'
              }
            ],
            'type': 'function'
          },
          {
            'constant': true,
            'inputs': [],
            'name': 'paidOut',
            'outputs': [
              {
                'name': '',
                'type': 'bool'
              }
            ],
            'type': 'function'
          },
          {
            'constant': true,
            'inputs': [],
            'name': 'fundingGoal',
            'outputs': [
              {
                'name': '',
                'type': 'uint256'
              }
            ],
            'type': 'function'
          },
          {
            'constant': true,
            'inputs': [],
            'name': 'owner',
            'outputs': [
              {
                'name': '',
                'type': 'address'
              }
            ],
            'type': 'function'
          },
          {
            'constant': false,
            'inputs': [],
            'name': 'payoutToBeneficiary',
            'outputs': [
              {
                'name': 'claimProxy',
                'type': 'address'
              }
            ],
            'type': 'function'
          },
          {
            'constant': true,
            'inputs': [],
            'name': 'calculator',
            'outputs': [
              {
                'name': 'target',
                'type': 'address'
              }
            ],
            'type': 'function'
          },
          {
            'constant': false,
            'inputs': [],
            'name': 'contributeMsgValue',
            'outputs': [],
            'type': 'function'
          },
          {
            'constant': true,
            'inputs': [],
            'name': 'expiry',
            'outputs': [
              {
                'name': '',
                'type': 'uint256'
              }
            ],
            'type': 'function'
          },
          {
            'constant': true,
            'inputs': [
              {
                'name': '',
                'type': 'address'
              }
            ],
            'name': 'contributionCreated',
            'outputs': [
              {
                'name': '',
                'type': 'uint256'
              }
            ],
            'type': 'function'
          },
          {
            'constant': true,
            'inputs': [],
            'name': 'token',
            'outputs': [
              {
                'name': 'target',
                'type': 'address'
              }
            ],
            'type': 'function'
          },
          {
            'anonymous': false,
            'inputs': [
              {
                'indexed': false,
                'name': '_contributor',
                'type': 'address'
              },
              {
                'indexed': false,
                'name': '_tokenAmountClaimed',
                'type': 'uint256'
              }
            ],
            'name': 'TokensClaimed',
            'type': 'event'
          },
          {
            'anonymous': false,
            'inputs': [
              {
                'indexed': false,
                'name': '_contributor',
                'type': 'address'
              }
            ],
            'name': 'ContributionMade',
            'type': 'event'
          },
          {
            'anonymous': false,
            'inputs': [
              {
                'indexed': false,
                'name': '_claimProxy',
                'type': 'address'
              },
              {
                'indexed': false,
                'name': '_payoutAmount',
                'type': 'uint256'
              }
            ],
            'name': 'BeneficiaryPayoutClaimed',
            'type': 'event'
          },
          {
            'anonymous': false,
            'inputs': [
              {
                'indexed': false,
                'name': '_claimProxy',
                'type': 'address'
              },
              {
                'indexed': false,
                'name': '_refundAmount',
                'type': 'uint256'
              },
              {
                'indexed': false,
                'name': '_contributor',
                'type': 'address'
              }
            ],
            'name': 'ContributorRefundClaimed',
            'type': 'event'
          }
        ],
        'bytecode': '60606040525b33600060006101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908302179055505b610f638061003f6000396000f3606060405236156100cc576000357c010000000000000000000000000000000000000000000000000000000090048063084a93c81461011157806338af3eed1461013f578063394ec89d1461017857806348cf34f1146101b8578063509239c0146101f85780635c76ca2d146102245780637a3a0e84146102495780638da5cb5b1461026c578063a63c7ba2146102a5578063ce3e39c0146102de578063db0251e914610317578063e184c9be14610326578063edb444c714610349578063fc0c546a14610375576100cc565b61010f5b42600760005060003373ffffffffffffffffffffffffffffffffffffffff1681526020019081526020016000206000508190555061010c6103ae565b5b565b005b610127600480803590602001909190505061043a565b60405180821515815260200191505060405180910390f35b61014c6004805050610482565b604051808273ffffffffffffffffffffffffffffffffffffffff16815260200191505060405180910390f35b61018560048050506104a8565b604051808373ffffffffffffffffffffffffffffffffffffffff1681526020018281526020019250505060405180910390f35b6101c5600480505061068e565b604051808373ffffffffffffffffffffffffffffffffffffffff1681526020018281526020019250505060405180910390f35b61020e60048080359060200190919050506109a4565b6040518082815260200191505060405180910390f35b61023160048050506109e2565b60405180821515815260200191505060405180910390f35b61025660048050506109f5565b6040518082815260200191505060405180910390f35b61027960048050506109fe565b604051808273ffffffffffffffffffffffffffffffffffffffff16815260200191505060405180910390f35b6102b26004805050610a24565b604051808273ffffffffffffffffffffffffffffffffffffffff16815260200191505060405180910390f35b6102eb6004805050610b95565b604051808273ffffffffffffffffffffffffffffffffffffffff16815260200191505060405180910390f35b61032460048050506103ae565b005b6103336004805050610b9b565b6040518082815260200191505060405180910390f35b61035f6004808035906020019091905050610ba4565b6040518082815260200191505060405180910390f35b6103826004805050610bbf565b604051808273ffffffffffffffffffffffffffffffffffffffff16815260200191505060405180910390f35b34600560005060003373ffffffffffffffffffffffffffffffffffffffff1681526020019081526020016000206000828282505401925050819055507f97a3367c201ad38e0d37322fd0ffa1b93457541ae8baf20eb9aa50bb83fcabef33604051808273ffffffffffffffffffffffffffffffffffffffff16815260200191505060405180910390a15b565b6000600660005060008373ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060009054906101000a900460ff16905061047d565b919050565b600160009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1681565b600060006002600050543073ffffffffffffffffffffffffffffffffffffffff163110156106895760001515600660005060003373ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060009054906101000a900460ff161515141561068857600460005054421115610687576001600660005060003373ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060006101000a81548160ff02191690830217905550336040516101cf80610bc5833901808273ffffffffffffffffffffffffffffffffffffffff168152602001915050604051809103906000f091508150600560005060003373ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060005054905080508173ffffffffffffffffffffffffffffffffffffffff16600082604051809050600060405180830381858888f19350505050151561061357610002565b7fd7774e62dd5deeb86bef491aca99a5d9f79b683438c8a8195ca8269900694447828233604051808473ffffffffffffffffffffffffffffffffffffffff1681526020018381526020018273ffffffffffffffffffffffffffffffffffffffff168152602001935050505060405180910390a15b5b5b5b9091565b600060006002600050543073ffffffffffffffffffffffffffffffffffffffff163110151561099f5760046000505442111561099e5760001515600660005060003373ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060009054906101000a900460ff161515141561099d57600460005054600760005060003373ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060005054101561099c576001600660005060003373ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060006101000a81548160ff021916908302179055503391508150600860009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1663cbcd5582600560005060008573ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060005054600760005060008673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060005054604051837c010000000000000000000000000000000000000000000000000000000002815260040180838152602001828152602001925050506020604051808303816000876161da5a03f115610002575050506040518051906020015090508050600960009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1663a9059cbb8383604051837c0100000000000000000000000000000000000000000000000000000000028152600401808373ffffffffffffffffffffffffffffffffffffffff168152602001828152602001925050506020604051808303816000876161da5a03f11561000257505050604051805190602001501561099b577f896e034966eaaf1adc54acc0f257056febbd300c9e47182cf761982cf1f5e4308282604051808373ffffffffffffffffffffffffffffffffffffffff1681526020018281526020019250505060405180910390a15b5b5b5b5b5b9091565b6000600560005060008373ffffffffffffffffffffffffffffffffffffffff1681526020019081526020016000206000505490506109dd565b919050565b600360009054906101000a900460ff1681565b60026000505481565b600060009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1681565b60006002600050543073ffffffffffffffffffffffffffffffffffffffff1631101515610b9157600460005054421115610b90576001600360006101000a81548160ff02191690830217905550600160009054906101000a900473ffffffffffffffffffffffffffffffffffffffff166040516101cf80610d94833901808273ffffffffffffffffffffffffffffffffffffffff168152602001915050604051809103906000f0905080507f22c1e24047f1e0c1af6f78290547f44645cdd2ad4d06b09115a162e41460c4d5813073ffffffffffffffffffffffffffffffffffffffff1631604051808373ffffffffffffffffffffffffffffffffffffffff1681526020018281526020019250505060405180910390a18073ffffffffffffffffffffffffffffffffffffffff1660003073ffffffffffffffffffffffffffffffffffffffff1631604051809050600060405180830381858888f193505050501515610b8f57610002565b5b5b5b90565b60005b90565b60046000505481565b60076000506020528060005260406000206000915090505481565b60005b905660606040526040516020806101cf833981016040528080519060200190919050505b5b33600060006101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908302179055505b80600060006101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908302179055505b50610146806100896000396000f360606040526000357c01000000000000000000000000000000000000000000000000000000009004806330509bca146100445780638da5cb5b1461005357610042565b005b610051600480505061008c565b005b6100606004805050610120565b604051808273ffffffffffffffffffffffffffffffffffffffff16815260200191505060405180910390f35b600060009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff163373ffffffffffffffffffffffffffffffffffffffff16141561011d57600060009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16ff5b5b565b600060009054906101000a900473ffffffffffffffffffffffffffffffffffffffff16815660606040526040516020806101cf833981016040528080519060200190919050505b5b33600060006101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908302179055505b80600060006101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908302179055505b50610146806100896000396000f360606040526000357c01000000000000000000000000000000000000000000000000000000009004806330509bca146100445780638da5cb5b1461005357610042565b005b610051600480505061008c565b005b6100606004805050610120565b604051808273ffffffffffffffffffffffffffffffffffffffff16815260200191505060405180910390f35b600060009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff163373ffffffffffffffffffffffffffffffffffffffff16141561011d57600060009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16ff5b5b565b600060009054906101000a900473ffffffffffffffffffffffffffffffffffffffff168156'
      },
      'Token': {
        'interface': [
          {
            'constant': false,
            'inputs': [
              {
                'name': '_spender',
                'type': 'address'
              },
              {
                'name': '_value',
                'type': 'uint256'
              }
            ],
            'name': 'approve',
            'outputs': [
              {
                'name': 'success',
                'type': 'bool'
              }
            ],
            'type': 'function'
          },
          {
            'constant': true,
            'inputs': [],
            'name': 'totalSupply',
            'outputs': [
              {
                'name': 'supply',
                'type': 'uint256'
              }
            ],
            'type': 'function'
          },
          {
            'constant': false,
            'inputs': [
              {
                'name': '_from',
                'type': 'address'
              },
              {
                'name': '_to',
                'type': 'address'
              },
              {
                'name': '_value',
                'type': 'uint256'
              }
            ],
            'name': 'transferFrom',
            'outputs': [
              {
                'name': 'success',
                'type': 'bool'
              }
            ],
            'type': 'function'
          },
          {
            'constant': true,
            'inputs': [
              {
                'name': '_owner',
                'type': 'address'
              }
            ],
            'name': 'balanceOf',
            'outputs': [
              {
                'name': 'balance',
                'type': 'uint256'
              }
            ],
            'type': 'function'
          },
          {
            'constant': false,
            'inputs': [
              {
                'name': '_to',
                'type': 'address'
              },
              {
                'name': '_value',
                'type': 'uint256'
              }
            ],
            'name': 'transfer',
            'outputs': [
              {
                'name': 'success',
                'type': 'bool'
              }
            ],
            'type': 'function'
          },
          {
            'constant': true,
            'inputs': [
              {
                'name': '_owner',
                'type': 'address'
              },
              {
                'name': '_spender',
                'type': 'address'
              }
            ],
            'name': 'allowance',
            'outputs': [
              {
                'name': 'remaining',
                'type': 'uint256'
              }
            ],
            'type': 'function'
          },
          {
            'anonymous': false,
            'inputs': [
              {
                'indexed': true,
                'name': '_from',
                'type': 'address'
              },
              {
                'indexed': true,
                'name': '_to',
                'type': 'address'
              },
              {
                'indexed': false,
                'name': '_value',
                'type': 'uint256'
              }
            ],
            'name': 'Transfer',
            'type': 'event'
          },
          {
            'anonymous': false,
            'inputs': [
              {
                'indexed': true,
                'name': '_owner',
                'type': 'address'
              },
              {
                'indexed': true,
                'name': '_spender',
                'type': 'address'
              },
              {
                'indexed': false,
                'name': '_value',
                'type': 'uint256'
              }
            ],
            'name': 'Approval',
            'type': 'event'
          }
        ],
        'bytecode': '60606040526101db806100126000396000f360606040523615610074576000357c010000000000000000000000000000000000000000000000000000000090048063095ea7b31461007657806318160ddd146100ad57806323b872dd146100d057806370a0823114610110578063a9059cbb1461013c578063dd62ed3e1461017357610074565b005b61009560048080359060200190919080359060200190919050506101a8565b60405180821515815260200191505060405180910390f35b6100ba60048050506101b1565b6040518082815260200191505060405180910390f35b6100f860048080359060200190919080359060200190919080359060200190919050506101b7565b60405180821515815260200191505060405180910390f35b61012660048080359060200190919050506101c1565b6040518082815260200191505060405180910390f35b61015b60048080359060200190919080359060200190919050506101c9565b60405180821515815260200191505060405180910390f35b61019260048080359060200190919080359060200190919050506101d2565b6040518082815260200191505060405180910390f35b60005b92915050565b60005b90565b60005b9392505050565b60005b919050565b60005b92915050565b60005b9291505056'
      },
      'TokenCampaign': {
        'interface': [
          {
            'constant': true,
            'inputs': [
              {
                'name': '_contributor',
                'type': 'address'
              }
            ],
            'name': 'claimMadeBy',
            'outputs': [
              {
                'name': 'claimWasMade',
                'type': 'bool'
              }
            ],
            'type': 'function'
          },
          {
            'constant': true,
            'inputs': [],
            'name': 'beneficiary',
            'outputs': [
              {
                'name': '',
                'type': 'address'
              }
            ],
            'type': 'function'
          },
          {
            'constant': false,
            'inputs': [],
            'name': 'claimRefundOwed',
            'outputs': [
              {
                'name': 'claimProxy',
                'type': 'address'
              },
              {
                'name': 'refundAmount',
                'type': 'uint256'
              }
            ],
            'type': 'function'
          },
          {
            'constant': false,
            'inputs': [],
            'name': 'claimTokensOwed',
            'outputs': [
              {
                'name': 'contributor',
                'type': 'address'
              },
              {
                'name': 'tokenAmountClaimed',
                'type': 'uint256'
              }
            ],
            'type': 'function'
          },
          {
            'constant': true,
            'inputs': [
              {
                'name': '_contributor',
                'type': 'address'
              }
            ],
            'name': 'amountContributedBy',
            'outputs': [
              {
                'name': 'amountContributed',
                'type': 'uint256'
              }
            ],
            'type': 'function'
          },
          {
            'constant': true,
            'inputs': [],
            'name': 'paidOut',
            'outputs': [
              {
                'name': 'successfully',
                'type': 'bool'
              }
            ],
            'type': 'function'
          },
          {
            'constant': true,
            'inputs': [],
            'name': 'fundingGoal',
            'outputs': [
              {
                'name': 'amount',
                'type': 'uint256'
              }
            ],
            'type': 'function'
          },
          {
            'constant': false,
            'inputs': [],
            'name': 'payoutToBeneficiary',
            'outputs': [
              {
                'name': 'claimProxy',
                'type': 'address'
              }
            ],
            'type': 'function'
          },
          {
            'constant': true,
            'inputs': [],
            'name': 'calculator',
            'outputs': [
              {
                'name': 'target',
                'type': 'address'
              }
            ],
            'type': 'function'
          },
          {
            'constant': false,
            'inputs': [],
            'name': 'contributeMsgValue',
            'outputs': [],
            'type': 'function'
          },
          {
            'constant': true,
            'inputs': [],
            'name': 'expiry',
            'outputs': [
              {
                'name': 'timestamp',
                'type': 'uint256'
              }
            ],
            'type': 'function'
          },
          {
            'constant': true,
            'inputs': [
              {
                'name': '_contributor',
                'type': 'address'
              }
            ],
            'name': 'contributionCreated',
            'outputs': [
              {
                'name': 'created',
                'type': 'uint256'
              }
            ],
            'type': 'function'
          },
          {
            'constant': true,
            'inputs': [],
            'name': 'token',
            'outputs': [
              {
                'name': 'target',
                'type': 'address'
              }
            ],
            'type': 'function'
          },
          {
            'anonymous': false,
            'inputs': [
              {
                'indexed': false,
                'name': '_contributor',
                'type': 'address'
              },
              {
                'indexed': false,
                'name': '_tokenAmountClaimed',
                'type': 'uint256'
              }
            ],
            'name': 'TokensClaimed',
            'type': 'event'
          },
          {
            'anonymous': false,
            'inputs': [
              {
                'indexed': false,
                'name': '_contributor',
                'type': 'address'
              }
            ],
            'name': 'ContributionMade',
            'type': 'event'
          },
          {
            'anonymous': false,
            'inputs': [
              {
                'indexed': false,
                'name': '_claimProxy',
                'type': 'address'
              },
              {
                'indexed': false,
                'name': '_payoutAmount',
                'type': 'uint256'
              }
            ],
            'name': 'BeneficiaryPayoutClaimed',
            'type': 'event'
          },
          {
            'anonymous': false,
            'inputs': [
              {
                'indexed': false,
                'name': '_claimProxy',
                'type': 'address'
              },
              {
                'indexed': false,
                'name': '_refundAmount',
                'type': 'uint256'
              },
              {
                'indexed': false,
                'name': '_contributor',
                'type': 'address'
              }
            ],
            'name': 'ContributorRefundClaimed',
            'type': 'event'
          }
        ],
        'bytecode': ''
      }
    };

    this.classes = {};
    for (var key in this.headers) {
      this.classes[key] = new ContractWrapper(this.headers[key], _web3);
    }

    this.objects = {};
    for (var i in env.objects) {
      var obj = env.objects[i];
      this.objects[i] = this.classes[obj['class']].at(obj.address);
    }
  }

  return {
    class: constructor,
    environments: environments
  };
})();

if (typeof module !== 'undefined' && module.exports) {
  module.exports = dapple['weifund-contracts'];
}
