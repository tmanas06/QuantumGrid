// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

contract QuantumGridSimple {
    // Game Session Structure
    struct GameSession {
        address player;
        uint256 betAmount;
        uint256 gridSize;
        uint256 quantumFields;
        uint256 difficulty;
        uint256 startTime;
        bool isActive;
        uint256[] quantumPositions;
    }

    // Game Result Structure
    struct GameResult {
        address player;
        uint256 betAmount;
        uint256 score;
        uint256 winnings;
        bool won;
        uint256 timestamp;
    }

    // Player Statistics
    struct PlayerStats {
        uint256 totalGamesPlayed;
        uint256 totalWinnings;
        uint256 bestScore;
        uint256 winStreak;
        uint256 longestWinStreak;
        uint256 lastGameTime;
    }

    // Leaderboard Entry
    struct LeaderboardEntry {
        address player;
        uint256 score;
        uint256 timestamp;
    }

    // State Variables
    mapping(bytes32 => GameSession) public activeGames;
    mapping(address => bytes32[]) public playerGames;
    mapping(address => uint256) public playerWinnings;
    mapping(address => PlayerStats) public playerStats;
    mapping(address => bytes32) public requestToPlayer;
    
    // Leaderboards
    LeaderboardEntry[] public dailyLeaderboard;
    LeaderboardEntry[] public weeklyLeaderboard;
    LeaderboardEntry[] public allTimeLeaderboard;
    
    // Contract State
    address public owner;
    uint256 public houseBalance;
    uint256 public totalGamesPlayed;
    uint256 public totalWinningsPaid;
    uint256 public houseFee = 300; // 3% in basis points
    uint256 public maxBetAmount = 10 ether;
    uint256 public minBetAmount = 0.001 ether;
    
    // Constants
    uint256 public constant MAX_GRID_SIZE = 20;
    uint256 public constant MIN_GRID_SIZE = 5;
    uint256 public constant MAX_QUANTUM_FIELDS = 50;

    // Events
    event GameStarted(address indexed player, uint256 betAmount, uint256 gridSize, uint256 quantumFields, uint256 difficulty);
    event GameCompleted(address indexed player, uint256 betAmount, uint256 score, uint256 winnings, bool won);
    event WinningsClaimed(address indexed player, uint256 amount);
    event HouseFunded(address indexed funder, uint256 amount);
    event LeaderboardUpdated(address indexed player, uint256 score, uint256 position);
    event PlayerStatsUpdated(address indexed player, uint256 totalGames, uint256 totalWinnings, uint256 bestScore);

    // Modifiers
    modifier onlyOwner() {
        require(msg.sender == owner, "Only owner can call this function");
        _;
    }

    modifier nonReentrant() {
        require(!_locked, "Reentrant call");
        _locked = true;
        _;
        _locked = false;
    }

    bool private _locked;

    modifier gameActive(bytes32 gameId) {
        require(activeGames[gameId].isActive, "Game not active");
        _;
    }

    modifier validBet(uint256 betAmount) {
        require(betAmount >= minBetAmount && betAmount <= maxBetAmount, "Invalid bet amount");
        _;
    }

    constructor() {
        owner = msg.sender;
    }

    // Fund the house
    function fundHouse() external payable {
        require(msg.value > 0, "Must send ETH to fund house");
        houseBalance += msg.value;
        emit HouseFunded(msg.sender, msg.value);
    }

    // Start a new game (simplified for testnet deployment)
    function startGame(
        uint256 gridSize,
        uint256 quantumFields,
        uint256 difficulty
    ) external payable validBet(msg.value) {
        require(gridSize >= MIN_GRID_SIZE && gridSize <= MAX_GRID_SIZE, "Invalid grid size");
        require(quantumFields <= MAX_QUANTUM_FIELDS, "Too many quantum fields");
        require(difficulty >= 10 && difficulty <= 90, "Invalid difficulty");

        bytes32 gameId = keccak256(abi.encodePacked(msg.sender, block.timestamp, block.number));
        
        // Generate quantum positions using block data (simplified for testnet)
        uint256[] memory quantumPositions = new uint256[](quantumFields);
        for (uint256 i = 0; i < quantumFields; i++) {
            quantumPositions[i] = uint256(keccak256(abi.encodePacked(block.timestamp, i, msg.sender, block.difficulty))) % (gridSize * gridSize);
        }

        activeGames[gameId] = GameSession({
            player: msg.sender,
            betAmount: msg.value,
            gridSize: gridSize,
            quantumFields: quantumFields,
            difficulty: difficulty,
            startTime: block.timestamp,
            isActive: true,
            quantumPositions: quantumPositions
        });

        playerGames[msg.sender].push(gameId);
        houseBalance += msg.value;

        emit GameStarted(msg.sender, msg.value, gridSize, quantumFields, difficulty);
    }

    // Submit game result (simplified for testnet deployment)
    function submitGameResult(
        uint256 score,
        uint256 revealedCells,
        uint256[] calldata revealedPositions,
        bytes32 gameHash
    ) external {
        // Find the active game for this player
        bytes32 gameId = bytes32(0);
        for (uint256 i = 0; i < playerGames[msg.sender].length; i++) {
            bytes32 currentGameId = playerGames[msg.sender][i];
            if (activeGames[currentGameId].isActive) {
                gameId = currentGameId;
                break;
            }
        }
        
        require(gameId != bytes32(0), "No active game found");
        require(activeGames[gameId].isActive, "Game not active");

        GameSession storage game = activeGames[gameId];
        game.isActive = false;

        // Calculate winnings (simplified calculation)
        uint256 winnings = 0;
        bool won = false;
        
        if (score > 1000) { // Simple win condition
            winnings = (game.betAmount * score) / 1000; // Simplified winnings calculation
            if (winnings > houseBalance) {
                winnings = houseBalance;
            }
            houseBalance -= winnings;
            totalWinningsPaid += winnings;
            won = true;
        }

        // Update player statistics
        playerStats[msg.sender].totalGamesPlayed++;
        playerStats[msg.sender].totalWinnings += winnings;
        if (score > playerStats[msg.sender].bestScore) {
            playerStats[msg.sender].bestScore = score;
        }
        
        if (won) {
            playerStats[msg.sender].winStreak++;
            if (playerStats[msg.sender].winStreak > playerStats[msg.sender].longestWinStreak) {
                playerStats[msg.sender].longestWinStreak = playerStats[msg.sender].winStreak;
            }
        } else {
            playerStats[msg.sender].winStreak = 0;
        }
        
        playerStats[msg.sender].lastGameTime = block.timestamp;
        playerWinnings[msg.sender] += winnings;
        totalGamesPlayed++;

        // Update leaderboards
        _updateLeaderboards(msg.sender, score);

        emit GameCompleted(msg.sender, game.betAmount, score, winnings, won);
        emit PlayerStatsUpdated(msg.sender, playerStats[msg.sender].totalGamesPlayed, playerStats[msg.sender].totalWinnings, playerStats[msg.sender].bestScore);
    }

    // Claim winnings
    function claimWinnings() external {
        uint256 winnings = playerWinnings[msg.sender];
        require(winnings > 0, "No winnings to claim");
        
        playerWinnings[msg.sender] = 0;
        payable(msg.sender).transfer(winnings);
        
        emit WinningsClaimed(msg.sender, winnings);
    }

    // Get player statistics
    function getPlayerStats(address player) external view returns (PlayerStats memory) {
        return playerStats[player];
    }

    // Get player winnings
    function getPlayerWinnings(address player) external view returns (uint256) {
        return playerWinnings[player];
    }

    // Get daily leaderboard
    function getDailyLeaderboard() external view returns (LeaderboardEntry[] memory) {
        return dailyLeaderboard;
    }

    // Get weekly leaderboard
    function getWeeklyLeaderboard() external view returns (LeaderboardEntry[] memory) {
        return weeklyLeaderboard;
    }

    // Get all-time leaderboard
    function getAllTimeLeaderboard() external view returns (LeaderboardEntry[] memory) {
        return allTimeLeaderboard;
    }

    // Get contract statistics
    function getStats() external view returns (
        uint256 _houseBalance,
        uint256 _totalGamesPlayed,
        uint256 _totalWinningsPaid,
        uint256 _houseFee,
        uint256 _minBet,
        uint256 _maxBet
    ) {
        return (
            houseBalance,
            totalGamesPlayed,
            totalWinningsPaid,
            houseFee,
            minBetAmount,
            maxBetAmount
        );
    }

    // Update leaderboards (internal)
    function _updateLeaderboards(address player, uint256 score) internal {
        LeaderboardEntry memory entry = LeaderboardEntry({
            player: player,
            score: score,
            timestamp: block.timestamp
        });

        // Add to all-time leaderboard
        allTimeLeaderboard.push(entry);
        _sortLeaderboard(allTimeLeaderboard);

        // Add to daily leaderboard (simplified - in real implementation, you'd check dates)
        dailyLeaderboard.push(entry);
        _sortLeaderboard(dailyLeaderboard);

        // Add to weekly leaderboard (simplified - in real implementation, you'd check dates)
        weeklyLeaderboard.push(entry);
        _sortLeaderboard(weeklyLeaderboard);

        emit LeaderboardUpdated(player, score, 0); // Position calculation simplified
    }

    // Sort leaderboard by score (internal)
    function _sortLeaderboard(LeaderboardEntry[] storage leaderboard) internal {
        // Simple bubble sort (for small arrays)
        for (uint256 i = 0; i < leaderboard.length - 1; i++) {
            for (uint256 j = 0; j < leaderboard.length - i - 1; j++) {
                if (leaderboard[j].score < leaderboard[j + 1].score) {
                    LeaderboardEntry memory temp = leaderboard[j];
                    leaderboard[j] = leaderboard[j + 1];
                    leaderboard[j + 1] = temp;
                }
            }
        }
    }

    // Owner functions
    function setBetLimits(uint256 _minBet, uint256 _maxBet) external onlyOwner {
        require(_minBet > 0 && _maxBet > _minBet, "Invalid bet limits");
        minBetAmount = _minBet;
        maxBetAmount = _maxBet;
    }

    function setHouseFee(uint256 _fee) external onlyOwner {
        require(_fee <= 1000, "Fee too high"); // Max 10%
        houseFee = _fee;
    }

    function emergencyWithdraw() external onlyOwner {
        uint256 balance = address(this).balance;
        payable(owner).transfer(balance);
        houseBalance = 0;
    }

    // Receive ETH
    receive() external payable {
        houseBalance += msg.value;
    }
}
