// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract CodingToken is ERC20, Ownable {
    // Internship structure to hold internship details
    struct Internship {
        string title;
        uint256 tokenCost; // Token cost to unlock the internship
        bool isUnlocked; // Track if a user has unlocked the internship
    }

    // Problem structure to hold problem statement details
    struct Problem {
        string description;   // Problem statement description
        uint256 reward;       // Token reward for solving the problem
        bool isSolved;        // Track if the problem has been solved
    }

    // Array to store available internships
    Internship[] public internships;

    // Array to store all problems
    Problem[] public problems;

    // Map each address to internships they have unlocked
    mapping(address => Internship[]) public unlockedInternships;

    // Map to track which problems a user has solved
    mapping(address => mapping(uint256 => bool)) public solvedProblems;

    constructor(string memory name, string memory symbol, uint256 initialSupply) 
        ERC20(name, symbol)
        Ownable(msg.sender)
    {
        _mint(msg.sender, initialSupply * (10 ** decimals())); // Mint initial supply to the deployer
    }

    // ---------- Internship Functions ----------

    // Function to add an internship to the platform
    function addInternship(string memory title, uint256 tokenCost) public onlyOwner {
        internships.push(Internship({
            title: title,
            tokenCost: tokenCost,
            isUnlocked: false
        }));
    }

    // Function to unlock an internship if the user has enough tokens
    function unlockInternship(uint256 internshipIndex) public {
    require(internshipIndex < internships.length, "Invalid internship index");
    Internship storage internship = internships[internshipIndex];
    require(balanceOf(msg.sender) >= internship.tokenCost, "Not enough tokens");

    // Deduct tokens from user
    _burn(msg.sender, internship.tokenCost);

    // Set the internship as unlocked in the original internships array
    internship.isUnlocked = true;

    // Add the unlocked internship to the user's unlockedInternships mapping
    unlockedInternships[msg.sender].push(Internship({
        title: internship.title,
        tokenCost: internship.tokenCost,
        isUnlocked: true
    }));
}


    // ---------- Problem Functions ----------

    // Function to add a problem statement with a reward
    function addProblem(string memory description, uint256 reward) public onlyOwner {
        problems.push(Problem({
            description: description,
            reward: reward,
            isSolved: false
        }));
    }

    // Function for users to solve a problem and get the associated token reward
    function solveProblem(uint256 problemIndex) public {
        require(problemIndex < problems.length, "Invalid problem index");
        Problem storage problem = problems[problemIndex];
        require(!problem.isSolved, "Problem already solved");
        require(!solvedProblems[msg.sender][problemIndex], "You have already solved this problem");

        // Mark problem as solved
        problem.isSolved = true;
        solvedProblems[msg.sender][problemIndex] = true;

        // Reward the user with the token amount associated with the problem
        _mint(msg.sender, problem.reward);
    }

    // ---------- Token Reward Function ----------

    // Function to directly reward tokens to any address
    // function rewardTokens(address to, uint256 amount) public onlyOwner {
    //     _mint(to, amount);
    // }

    // ---------- View Functions ----------

    // Get available internships
    function getInternships() public view returns (Internship[] memory) {
        return internships;
    }

    // Get internships unlocked by the user
    function getUnlockedInternships(address user) public view returns (Internship[] memory) {
        return unlockedInternships[user];
    }

    // Get all available problems
    function getProblems() public view returns (Problem[] memory) {
        return problems;
    }

    // Check if a user has solved a particular problem
    function hasSolvedProblem(address user, uint256 problemIndex) public view returns (bool) {
        return solvedProblems[user][problemIndex];
    }
}
