//SPDX-License-Identifier: UNLICENSED
pragma solidity <=0.8.10;

import "openzeppelin-solidity/contracts/token/ERC20/ERC20.sol";
import "openzeppelin-solidity/contracts/token/ERC20/extensions/ERC20Capped.sol";
import "openzeppelin-solidity/contracts/token/ERC20/utils/SafeERC20.sol";
import "openzeppelin-solidity/contracts/access/Ownable.sol";
import "openzeppelin-solidity/contracts/token/ERC20/extensions/ERC20Burnable.sol";

contract ImpetusStaking is Ownable {

    ERC20 public stakeToken;
    uint256 public totalStakedAmount = 0;
    uint256 public totalUnStakedAmount = 0;

    // +----------+-----------+-------------+
    // |          |  min 2000 | Pool Limit  | 
    // +----------+-----------+-------------+
    // |  14 days |     90    |  20,000,000 |
    // +----------+-----------+-------------+
    // |  30 days |    120    |  20,000,000 |
    // +----------+-----------+-------------+

    uint256 constant private INVALID_INDEX = 999;


    uint256 constant public twoWeekPoolLimit = 20*10**6;

    uint256 constant public oneMonthPoolLimit = 20*10**6;

    uint256 constant public minAmount=2000;
    uint256 public totalStaker=0;

    uint[2] public stakedPool = [0,0];
    uint[2] public APR = [90,120];
    
    struct StakerInfo {
        uint256 amount;
        uint releaseDate;
        bool isRelease;
        uint256 rewardDebt;
        uint termOption;
    }
    event Stake(address indexed _from, uint _duration , uint _value);
    event UnStake(address indexed _from, uint _duration, uint _value);

    mapping (address => StakerInfo[]) public stakers;

    function getStakedPoolIndex(uint256 termOption) public pure returns (uint256) {
        if (termOption == 14) {
            return 0;
        }
        if (termOption == 30) {
            return 1;
        }
        return INVALID_INDEX; // Never reach
    }


    function twoWeekStake(uint256 _amount) underTwoWeekPoolRemain(_amount) public {
        stake(_amount, 14);
    }
    function oneMonthStake(uint256 _amount) underOneMonthPoolRemain(_amount) public {

        stake(_amount, 30);
    }

    function stake(uint256 _amount, uint _termOption) internal {

        require(_amount >= (minAmount*10**stakeToken.decimals()) , "Stake amount must be greater than 2000");
        uint256 stakedPoolIndex = getStakedPoolIndex(_termOption);

        require(stakedPoolIndex != INVALID_INDEX, "Invalid term option");

        require(stakeToken.balanceOf(msg.sender) >= _amount, "Insufficient balance");

        require(stakeToken.allowance(msg.sender, address(this)) >= _amount, "Insufficient allowance");
        
        StakerInfo memory staker = StakerInfo(
                                        _amount,
                                        block.timestamp + _termOption * 1 days,
                                        false,
                                        _termOption * _amount * APR[stakedPoolIndex] / 100 / 365,
                                        _termOption);

        stakers[msg.sender].push(staker);
        
        SafeERC20.safeTransferFrom(stakeToken, msg.sender, address(this), _amount);

        totalStakedAmount += _amount;

        stakedPool[stakedPoolIndex] += _amount;

        totalStaker+=1;

        emit Stake(msg.sender, _termOption, _amount);
    }

    function unStake(uint index) public{

        require(index < stakers[msg.sender].length, "Index out of bounds");

        StakerInfo storage staker = stakers[msg.sender][index];
        require(staker.amount > 0 , "Stake amount must be greater than zero");
        require(staker.isRelease == false , "Stake has already been released");

        require((staker.releaseDate <= block.timestamp), "You can't unstake before release date");

        uint256 willPaid =  staker.amount + staker.rewardDebt;

        require(willPaid <= stakeToken.balanceOf(address(this)), "Insufficient balance");
        
        staker.isRelease = true;
        
        stakeToken.transfer(msg.sender, willPaid);
        
        totalUnStakedAmount += staker.amount;
        
        stakedPool[getStakedPoolIndex(staker.termOption)] -= staker.amount;

        totalStaker-=1;
        emit UnStake(msg.sender,staker.termOption,staker.amount);
       
    }


    function getStakerInfo(address _staker) public view returns (StakerInfo[] memory){
        return stakers[_staker];
    }


    function getStakerInfo(address _staker, uint256 from, uint256 to) public view returns (StakerInfo[] memory){
        StakerInfo[] memory stakerInfo = stakers[_staker];

        require(from <= to, "From must be less than To");
        require(0 <= from && from < stakerInfo.length, "Invalid From index");
        require(0 <= to && to < stakerInfo.length, "Invalid To index");

        uint256 length = to - from + 1;
        StakerInfo[] memory result = new StakerInfo[](length);

        for (uint i = from; i <= to; i++) {
            result[i - from] = stakerInfo[i];
        }
        return result;
    }

    function getStakerInfoByTermOption(address _staker, uint _termOption, uint from, uint to)
        public view returns (StakerInfo[] memory){
        
        StakerInfo[] memory stakerInfo = stakers[_staker];

        require(from <= to, "From must be less than To");

        uint length = 0;
        for (uint i = 0; i < stakerInfo.length; i++) {
            if (stakerInfo[i].termOption == _termOption) {
                length ++;
            }
        }

        require(0 <= from && from < length, "Invalid From index");
        require(0 <= to && to < length, "Invalid To index");
        
        uint count = 0;
        uint index = 0;
        StakerInfo[] memory result = new StakerInfo[](to - from + 1);
        for (uint i = 0; i < stakerInfo.length; i++) {
            if (stakerInfo[i].termOption == _termOption) {
                if (from <= count && count <= to) {
                    result[index++] = stakerInfo[i];
                }
                if (count == to) {
                    break;
                }
                count ++;
            }
        }
        return result;
    }

    function getStakerInfoByRelease(address _staker, bool _isRelease, uint from, uint to)
        public view returns (StakerInfo[] memory){
        
        StakerInfo[] memory stakerInfo = stakers[_staker];

        require(from <= to, "From must be less than To");

        uint length = 0;
        for (uint i = 0; i < stakerInfo.length; i++) {
            if (stakerInfo[i].isRelease == _isRelease) {
                length ++;
            }
        }

        require(0 <= from && from < length, "Invalid From index");
        require(0 <= to && to < length, "Invalid To index");
        
        uint count = 0;
        uint index = 0;
        StakerInfo[] memory result = new StakerInfo[](to - from + 1);
        for (uint i = 0; i < stakerInfo.length; i++) {
            if (stakerInfo[i].isRelease == _isRelease) {
                if (from <= count && count <= to) {
                    result[index++] = stakerInfo[i];
                }
                if (count == to) {
                    break;
                }
                count ++;
            }
        }
        return result;
    }

    function getStakerInfoByTermOptionAndRelease(address _staker, uint _termOption, bool _isRelease, uint from, uint to)
        public view returns (StakerInfo[] memory){
        
        StakerInfo[] memory stakerInfo = stakers[_staker];

        require(from <= to, "From must be less than To");

        uint length = 0;
        for (uint i = 0; i < stakerInfo.length; i++) {
            if (stakerInfo[i].termOption == _termOption && stakerInfo[i].isRelease == _isRelease) {
                length ++;
            }
        }

        require(0 <= from && from < length, "Invalid From index");
        require(0 <= to && to < length, "Invalid To index");
        
        uint count = 0;
        uint index = 0;
        StakerInfo[] memory result = new StakerInfo[](to - from + 1);
        for (uint i = 0; i < stakerInfo.length; i++) {
            if (stakerInfo[i].termOption == _termOption && stakerInfo[i].isRelease == _isRelease) {
                if (from <= count && count <= to) {
                    result[index++] = stakerInfo[i];
                }
                if (count == to) {
                    break;
                }
                count ++;
            }
        }
        return result;
    }

    function getDetailStakedPool() public view returns (uint256[2] memory){
        return stakedPool;
    }

    
    function totalStakeByAddress(address _address) public view returns(uint) {
        uint total = 0;
        StakerInfo[] storage staker = stakers[_address];
        for (uint256 i = 0; i < staker.length; i++) {
            if (staker[i].isRelease == false) {
                total += staker[i].amount;
            }
        }
        return total;
    }

    function totalRewardDebtByAddress(address _address) public view returns(uint _staked) {
        uint total = 0;
        StakerInfo[] storage staker = stakers[_address];
        for (uint256 i = 0; i < staker.length; i++) {
            if (staker[i].isRelease == true) {
                total += staker[i].rewardDebt;
            }
        }
        return total;
    }

    function getStakeCount(address _address) public view returns (uint) {
        uint total = 0;
        StakerInfo[] storage staker = stakers[_address];
        for (uint256 i = 0; i < staker.length; i++) {
            if (staker[i].isRelease == false) {
                total += 1;
            }
        }
        return total;
    }

    function getStakeInfo(address _staker,uint _index) public view returns (uint256 _amount,uint _releaseDate,bool _isRelease,uint256 _rewardDebt) {
        return (stakers[_staker][_index].amount,stakers[_staker][_index].releaseDate,stakers[_staker][_index].isRelease,stakers[_staker][_index].rewardDebt);
    }
    
    function getStakeInfoByIndex(uint _index) public view returns (address _staker,uint256 _amount,uint _releaseDate,bool _isRelease,uint256 _rewardDebt) {
        StakerInfo storage staker = stakers[msg.sender][_index];
        return (_staker,staker.amount,staker.releaseDate,staker.isRelease,staker.rewardDebt);
    }

    function totalStakerInfoByTermOption(address _staker, uint _termOption) public view returns (uint) {
        uint total = 0;
        StakerInfo[] storage staker = stakers[_staker];
        for (uint256 i = 0; i < staker.length; i++) {
            if (staker[i].termOption == _termOption) {
                total ++;
            }
        }
        return total;
    }

    function totalStakerInfoByTermOptionAndRelease(address _staker, uint _termOption, bool _isRelease) public view returns (uint) {
        uint total = 0;
        StakerInfo[] storage staker = stakers[_staker];
        for (uint256 i = 0; i < staker.length; i++) {
            if (staker[i].termOption == _termOption && staker[i].isRelease == _isRelease) {
                total ++;
            }
        }
        return total;
    }

    function totalStakerInfoByRelease(address _staker, bool _isRelease) public view returns (uint) {
        uint total = 0;
        StakerInfo[] storage staker = stakers[_staker];
        for (uint256 i = 0; i < staker.length; i++) {
            if (staker[i].isRelease == _isRelease) {
                total ++;
            }
        }
        return total;
    }

    function twoWeekPoolRemain() public view returns(uint256) {
        return twoWeekPoolLimit * 10**stakeToken.decimals() - stakedPool[0];
    }

    function oneMonthPoolRemain() public view returns(uint256) {
        return oneMonthPoolLimit * 10**stakeToken.decimals() - stakedPool[1];
    }

    modifier underTwoWeekPoolRemain(uint256 _amount) {
        require(twoWeekPoolRemain() >= _amount, "Two week pool limit reached");
        _;
    }

    modifier underOneMonthPoolRemain(uint256 _amount) {
        require(oneMonthPoolRemain() >= _amount, "One month pool limit reached");
        _;
    }

    constructor (ERC20 _stakeToken) {
        stakeToken = _stakeToken;
    }
}
