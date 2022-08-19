//SPDX-License-Identifier: UNLICENSED
pragma solidity <=0.8.10;

import "openzeppelin-solidity/contracts/token/ERC20/ERC20.sol";
import "openzeppelin-solidity/contracts/token/ERC20/extensions/ERC20Capped.sol";
import "openzeppelin-solidity/contracts/token/ERC20/utils/SafeERC20.sol";
import "openzeppelin-solidity/contracts/access/Ownable.sol";
import "openzeppelin-solidity/contracts/token/ERC20/extensions/ERC20Burnable.sol";
contract ImpetusLending is Ownable {

    ERC20 public lendingToken;
    ERC20 public usdtToken;
    uint256 public totalLentAmount = 0;
    uint256 public totalUnLentAmount = 0;

    // +----------+-----------+-------------+-------------+-------------+-------------+-------------+-------------+
    // |          |    200    |     500     |     1000    |     3000    |    5000     |    10000    |    25000    |
    // +----------+-----------+-------------+-------------+-------------+-------------+-------------+-------------+
    // |  30 days |   2100    |    5500     |    11500    |    36000    |    62500    |   130000    |   337500    |
    // +----------+-----------+-------------+-------------+-------------+-------------+-------------+-------------+
    // |  90 days |   2120    |    5550     |    11600    |    36300    |    63000    |   131000    |   340000    |
    // +----------+-----------+-------------+-------------+-------------+-------------+-------------+-------------+
    // | 180 days |   2140    |    5600     |    11700    |    36600    |    63500    |   132000    |   133000    |
    // +----------+-----------+-------------+-------------+-------------+-------------+-------------+-------------+
    // | 365 days |   2160    |    5650     |    11800    |    36900    |    64000    |   133000    |   345000    |
    // +----------+-----------+-------------+-------------+-------------+-------------+-------------+-------------+

    uint256 constant private _INVALID_INDEX = 999;

    uint256 public totalLender=0;

    uint[4]public lendingPools=[0,0,0,0];//30,90,180,365 days

    uint[7][4] public tokenAmountOuts = [
        [2100,5500,11500,36000,62500,130000,337500],// 30 days
        [2120,5550,11600,36300,63000,131000,340000],// 90
        [2140,5600,11700,36600,63500,132000,133000],//180
        [2160,5650,11800,36900,64000,133000,345000]//365
        ];

    uint[7][4] public detailLendingPool=[
        [0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0]
    ];
    
    struct LenderInfo {
        uint256 amount;
        uint releaseDate;
        bool isRelease;
        uint256 rewardDebt;
        uint termOption;
        uint package;
    }
    event Lend(address indexed _from, uint _duration , uint _value);
    event UnLend(address indexed _from, uint _duration, uint _value,uint256 _amountOut);

    mapping (address => LenderInfo[]) public lenders;

    constructor (ERC20 newToken,ERC20 usdt) {
        lendingToken = newToken;
        usdtToken=usdt;
    }

    function getLendingPoolIndex(uint256 termOption) public pure returns (uint256) {
        if (termOption == 30) {
            return 0;
        }
        if (termOption == 90) {
            return 1;
        }
        if (termOption == 180) {
            return 2;
        }
        if (termOption == 365) {
            return 3;
        }
        
        return _INVALID_INDEX; 
    }

    function getLendingPackageIndex(uint256 amount) public pure returns (uint256) {
        //200,500,1000,3000,5000,10000,25000
        if (amount == 200) {
            return 0;
        }
        if (amount == 500) {
            return 1;
        }
        if (amount == 1000) {
            return 2;
        }
        if (amount == 3000) {
            return 3;
        }
        if (amount == 5000) {
            return 4;
        }
        if (amount == 10000) {
            return 5;
        }
        if (amount == 25000) {
            return 6;
        }
        return _INVALID_INDEX; // Never reach
    }


    function lend(uint256 packageAmount, uint termOption) public {
        uint256 amount=packageAmount*10**usdtToken.decimals();
        uint256 lendingPackageIndex=getLendingPackageIndex(packageAmount);
        require(lendingPackageIndex!=_INVALID_INDEX,"Out of packages");

        uint256 lendingPoolIndex = getLendingPoolIndex(termOption);

        require(lendingPoolIndex!=_INVALID_INDEX,"Out of Pools");

        require(usdtToken.balanceOf(msg.sender) >= amount, "Insufficient balance");

        require(usdtToken.allowance(msg.sender, address(this)) >= amount, "Insufficient allowance");
        
        LenderInfo memory lender = LenderInfo(
                                        amount,
                                        block.timestamp + termOption * 1 days,
                                        false,
                                        tokenAmountOuts[lendingPoolIndex][lendingPackageIndex],
                                        termOption,
                                        packageAmount
                                        );

        lenders[msg.sender].push(lender);
        
        SafeERC20.safeTransferFrom(usdtToken, msg.sender, address(this), amount);

        totalLentAmount += amount;

        lendingPools[lendingPoolIndex] += amount;

        totalLender+=1;

        detailLendingPool[lendingPoolIndex][lendingPackageIndex]+=amount;

        emit Lend(msg.sender, termOption, amount);
    }

    function unLend(uint index) public{

        require(index < lenders[msg.sender].length, "Index out of bounds");

        LenderInfo storage lender = lenders[msg.sender][index];
        require(lender.amount > 0 , "Lend amount must be greater than zero");
        require(lender.isRelease == false , "Lend has already been released");

        require((lender.releaseDate <= block.timestamp), "You can't unLend before release date");

        uint256 willPaid =  lender.rewardDebt;

        require(willPaid <= lendingToken.balanceOf(address(this)), "Insufficient balance");
        
        lender.isRelease = true;
        
        lendingToken.transfer(msg.sender, willPaid);
        
        totalUnLentAmount += lender.amount;
        uint lendingPoolIndex=getLendingPoolIndex(lender.termOption);
        uint lendingPackageIndex=getLendingPoolIndex(lender.termOption);
        
        lendingPools[getLendingPoolIndex(lender.termOption)] -= lender.amount;

        totalLender-=1;
        detailLendingPool[lendingPackageIndex][lendingPoolIndex]-=lender.amount;

        emit UnLend(msg.sender,lender.termOption,lender.amount,lender.rewardDebt);
       
    }


    function getLenderInfo(address Lender) public view returns (LenderInfo[] memory){
        return lenders[Lender];
    }


    function getLenderInfo(address lender, uint256 from, uint256 to) public view returns (LenderInfo[] memory){
        LenderInfo[] memory lenderInfo = lenders[lender];

        require(from <= to, "From must be less than To");
        require(0 <= from && from < lenderInfo.length, "Invalid From index");
        require(0 <= to && to < lenderInfo.length, "Invalid To index");

        uint256 length = to - from + 1;
        LenderInfo[] memory result = new LenderInfo[](length);

        for (uint i = from; i <= to; i++) {
            result[i - from] = lenderInfo[i];
        }
        return result;
    }

    function withdraw() public onlyOwner {
        usdtToken.transfer(msg.sender, usdtToken.balanceOf(address(this)));
    }

    }