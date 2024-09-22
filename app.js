const codingTokenAbi = [
    
    {
        "inputs": [],
        "name": "getInternships",
        "outputs": [
            {
                "components": [
                    { "internalType": "string", "name": "title", "type": "string" },
                    { "internalType": "uint256", "name": "tokenCost", "type": "uint256" },
                    { "internalType": "bool", "name": "isUnlocked", "type": "bool" }
                ],
                "internalType": "struct CodingToken.Internship[]",
                "name": "",
                "type": "tuple[]"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "getProblems",
        "outputs": [
            {
                "components": [
                    { "internalType": "string", "name": "title", "type": "string" },
                    { "internalType": "uint256", "name": "tokenReward", "type": "uint256" },
                    { "internalType": "bool", "name": "isSolved", "type": "bool" }
                ],
                "internalType": "struct CodingToken.Problem[]",
                "name": "",
                "type": "tuple[]"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [{ "internalType": "uint256", "name": "problemIndex", "type": "uint256" }],
        "name": "solveProblem",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [{ "internalType": "uint256", "name": "internshipIndex", "type": "uint256" }],
        "name": "unlockInternship",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    }
];


const contractAddress = "0x1bBc89D4FaA14CE2676421e9d4CE83A9c18eBcB4";

let provider;
let signer;
let contract;

document.getElementById('connectWallet').addEventListener('click', async () => {
    if (typeof window.ethereum !== 'undefined') {
        await ethereum.request({ method: 'eth_requestAccounts' });
        provider = new ethers.providers.Web3Provider(window.ethereum);
        signer = provider.getSigner();
        const account = await signer.getAddress();
        document.getElementById('accountInfo').innerText = `Connected: ${account}`;
        
        contract = new ethers.Contract(contractAddress, codingTokenAbi, signer);

        loadProblems();
        loadInternships();
    } else {
        alert('Please install MetaMask!');
    }
});


async function loadProblems() {
    const problemList = document.getElementById('problemList');
    problemList.innerHTML = '';
    try {
        const problems = await contract.getProblems();
        problems.forEach((problem, index) => {
            const card = document.createElement("div");
            card.className = "bg-white shadow-md rounded-lg p-4 flex flex-col items-center";
            card.innerHTML = `
                <h3 class="font-semibold text-lg mb-2">${problem.title}</h3>
                <p class="text-gray-600">Reward: ${ethers.utils.formatUnits(problem.tokenReward, 18)} tokens</p>
                <p class="text-gray-600">Solved: ${problem.isSolved ? 'Yes' : 'No'}</p>
                <button onclick="document.getElementById('problemIndex').value=${index}" class="bg-blue-500 text-white py-1 px-2 rounded mt-2">Index ${index}</button>
            `;
            problemList.appendChild(card);
        });
    } catch (error) {
        console.error('Error fetching problems:', error);
    }
}


async function loadInternships() {
    const internshipList = document.getElementById('internshipList');
    internshipList.innerHTML = '';
    try {
        const internships = await contract.getInternships();
        internships.forEach((internship, index) => {
            const card = document.createElement("div");
            card.className = "bg-white shadow-md rounded-lg p-4 flex flex-col items-center";
            card.innerHTML = `
                <h3 class="font-semibold text-lg mb-2">${internship.title}</h3>
                <p class="text-gray-600">Cost: ${ethers.utils.formatUnits(internship.tokenCost, 18)} tokens</p>
                <p class="text-gray-600">Unlocked: ${internship.isUnlocked ? 'Yes' : 'No'}</p>
                <button onclick="document.getElementById('internshipIndex').value=${index}" class="bg-green-500 text-white py-1 px-2 rounded mt-2">Index ${index}</button>
            `;
            internshipList.appendChild(card);
        });
    } catch (error) {
        console.error('Error fetching internships:', error);
    }
}



async function solveProblem() {
    const problemIndex = document.getElementById('problemIndex').value;
    try {
        const tx = await contract.solveProblem(problemIndex);
        await tx.wait();
        alert('Problem solved!');
        loadProblems();
    } catch (error) {
        console.error('Error solving problem:', error);
    }
}


async function unlockInternship() {
    const internshipIndex = document.getElementById('internshipIndex').value;
    try {
        const tx = await contract.unlockInternship(internshipIndex);
        await tx.wait();
        alert('Internship unlocked!');
        loadInternships();
    } catch (error) {
        console.error('Error unlocking internship:', error);
    }
}
