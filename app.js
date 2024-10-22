const codingTokenAbi = [
    // ABI code
    {
        "inputs": [],
        "name": "balanceOf",
        "outputs": [
            {
                "internalType": "uint256",
                "name": "",
                "type": "uint256"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
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
        document.getElementById('accountInfo').innerHTML = `<h3 class="font-semibold text-md text-left mx-6 px-6 text-white mx-68 sm:px-16 py-4 rounded-xl mt-6" style = "background-color:#2A3347; color:#919FB5;">
        Connected: ${account}</h3>
        `;
        
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
            card.className = "bg-white shadow-md rounded-xl p-6 flex flex-col   ";
            card.style = "background-color:#162034;"
            card.innerHTML = `

                <h3 class="font-semibold text-white text-2xl mb-1 ">${problem.title}</h3>
                <p class="font-semibold mb-3"  style="color:#899AB1;">Reward: ${ethers.utils.formatUnits(problem.tokenReward, 18)} tokens</p>
                <button onclick="document.getElementById('problemIndex').value=${index}" class="bg-blue-500 w-36 text-white py-1 px-4 rounded-md font-semibold mt-2" style="background-color : #0E9DDD"; >Index ${index}</button>
                <p class="px-5 py-1 w-fit rounded-lg mt-3 text-sm" style="background-color:#13273F; color:#37B7F0;">Solved: ${problem.isSolved ? 'Yes' : 'No'}</p>

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
            card.className = "bg-white shadow-md rounded-xl p-6 flex flex-col";
            card.style = "background-color:#162034;"
            card.innerHTML = `
                <h3 class="font-semibold text-white text-2xl mb-1 ">${internship.title}</h3>
                <p class="font-semibold mb-3"  style="color:#899AB1;">Cost: ${ethers.utils.formatUnits(internship.tokenCost, 18)} tokens</p>
                <button onclick="document.getElementById('internshipIndex').value=${index}" class="bg-blue-500 w-36 text-white py-1 px-4 rounded-md font-semibold mt-2" style="background-color : #BE185D";>Index ${index}</button>
                <p class="px-5 py-1 w-fit rounded-lg mt-3 text-sm" style="background-color:#252038; color:#F472B6;">Unlocked: ${internship.isUnlocked ? 'Yes' : 'No'}</p>

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
        alert("Problem Already Solved")
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

document.getElementById('checkBalance').addEventListener('click', async () => {
    try {
        const account = await signer.getAddress();
        const balance = await contract.balanceOf(account); // assuming balanceOf is a function in your contract
        document.getElementById('balanceInfo').innerHTML = `<h3 class="font-semibold text-lg bg-green-500 text-white mx-68 px-4 py-4">
        Balance: ${ethers.utils.formatUnits(balance, 18)} tokens</h3>`;
    } catch (error) {
        console.error('Error fetching balance:', error);
    }
});
