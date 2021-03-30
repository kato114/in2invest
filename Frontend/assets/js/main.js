window.addEventListener('load', async function () {
	const tokenContract = '0x69C8a185428aafBA97A46A3cDFEA315E7dB92Dfb'
	const presaleContract = '0x45847690cB49b627389Ed05edC37Bc5266bEf79c'
	const maxSupply = 25000000
	let tokenRate = 0.002

	let connected = null
	let chainID = null
	let accounts = null
	let contract = null

	let presaleABI = [
		{
			inputs: [],
			name: 'deposit',
			outputs: [],
			stateMutability: 'payable',
			type: 'function',
		},
		{
			inputs: [
				{
					internalType: 'contract ClimbToken',
					name: '_token',
					type: 'address',
				},
			],
			stateMutability: 'nonpayable',
			type: 'constructor',
		},
		{
			anonymous: false,
			inputs: [
				{
					indexed: true,
					internalType: 'address',
					name: 'user',
					type: 'address',
				},
				{
					indexed: false,
					internalType: 'uint256',
					name: 'amount',
					type: 'uint256',
				},
			],
			name: 'Deposited',
			type: 'event',
		},
		{
			anonymous: false,
			inputs: [
				{
					indexed: true,
					internalType: 'address',
					name: 'previousOwner',
					type: 'address',
				},
				{
					indexed: true,
					internalType: 'address',
					name: 'newOwner',
					type: 'address',
				},
			],
			name: 'OwnershipTransferred',
			type: 'event',
		},
		{
			inputs: [
				{
					internalType: 'address',
					name: 'tokenAddress',
					type: 'address',
				},
				{
					internalType: 'uint256',
					name: 'tokenAmount',
					type: 'uint256',
				},
			],
			name: 'recoverBEP20',
			outputs: [],
			stateMutability: 'nonpayable',
			type: 'function',
		},
		{
			anonymous: false,
			inputs: [
				{
					indexed: false,
					internalType: 'address',
					name: 'token',
					type: 'address',
				},
				{
					indexed: false,
					internalType: 'uint256',
					name: 'amount',
					type: 'uint256',
				},
			],
			name: 'Recovered',
			type: 'event',
		},
		{
			inputs: [],
			name: 'releaseFunds',
			outputs: [],
			stateMutability: 'nonpayable',
			type: 'function',
		},
		{
			inputs: [],
			name: 'renounceOwnership',
			outputs: [],
			stateMutability: 'nonpayable',
			type: 'function',
		},
		{
			inputs: [
				{
					internalType: 'uint256',
					name: '_count',
					type: 'uint256',
				},
			],
			name: 'setRewardTokenCount',
			outputs: [],
			stateMutability: 'nonpayable',
			type: 'function',
		},
		{
			inputs: [
				{
					internalType: 'address payable',
					name: '_address',
					type: 'address',
				},
			],
			name: 'setWithdrawAddress',
			outputs: [],
			stateMutability: 'nonpayable',
			type: 'function',
		},
		{
			inputs: [
				{
					internalType: 'address',
					name: 'newOwner',
					type: 'address',
				},
			],
			name: 'transferOwnership',
			outputs: [],
			stateMutability: 'nonpayable',
			type: 'function',
		},
		{
			stateMutability: 'payable',
			type: 'receive',
		},
		{
			inputs: [
				{
					internalType: 'address',
					name: 'account',
					type: 'address',
				},
			],
			name: 'balanceOf',
			outputs: [
				{
					internalType: 'uint256',
					name: '',
					type: 'uint256',
				},
			],
			stateMutability: 'view',
			type: 'function',
		},
		{
			inputs: [
				{
					internalType: 'address',
					name: '',
					type: 'address',
				},
			],
			name: 'deposits',
			outputs: [
				{
					internalType: 'uint256',
					name: '',
					type: 'uint256',
				},
			],
			stateMutability: 'view',
			type: 'function',
		},
		{
			inputs: [],
			name: 'getDepositAmount',
			outputs: [
				{
					internalType: 'uint256',
					name: '',
					type: 'uint256',
				},
			],
			stateMutability: 'view',
			type: 'function',
		},
		{
			inputs: [],
			name: 'getRewardTokenCount',
			outputs: [
				{
					internalType: 'uint256',
					name: '',
					type: 'uint256',
				},
			],
			stateMutability: 'view',
			type: 'function',
		},
		{
			inputs: [],
			name: 'getWithdrawAddress',
			outputs: [
				{
					internalType: 'address',
					name: '',
					type: 'address',
				},
			],
			stateMutability: 'view',
			type: 'function',
		},
		{
			inputs: [],
			name: 'owner',
			outputs: [
				{
					internalType: 'address',
					name: '',
					type: 'address',
				},
			],
			stateMutability: 'view',
			type: 'function',
		},
		{
			inputs: [],
			name: 'rewardTokenCount',
			outputs: [
				{
					internalType: 'uint256',
					name: '',
					type: 'uint256',
				},
			],
			stateMutability: 'view',
			type: 'function',
		},
		{
			inputs: [],
			name: 'token',
			outputs: [
				{
					internalType: 'contract ClimbToken',
					name: '',
					type: 'address',
				},
			],
			stateMutability: 'view',
			type: 'function',
		},
		{
			inputs: [],
			name: 'totalDepositedBNBBalance',
			outputs: [
				{
					internalType: 'uint256',
					name: '',
					type: 'uint256',
				},
			],
			stateMutability: 'view',
			type: 'function',
		},
		{
			inputs: [],
			name: 'withdrwAddress',
			outputs: [
				{
					internalType: 'address payable',
					name: '',
					type: 'address',
				},
			],
			stateMutability: 'view',
			type: 'function',
		},
	]

	let tokenABI = [
		{ inputs: [], stateMutability: 'nonpayable', type: 'constructor' },
		{
			anonymous: false,
			inputs: [
				{ indexed: true, internalType: 'address', name: 'owner', type: 'address' },
				{ indexed: true, internalType: 'address', name: 'spender', type: 'address' },
				{ indexed: false, internalType: 'uint256', name: 'value', type: 'uint256' },
			],
			name: 'Approval',
			type: 'event',
		},
		{ anonymous: false, inputs: [{ indexed: true, internalType: 'address', name: 'account', type: 'address' }], name: 'MinterAdded', type: 'event' },
		{ anonymous: false, inputs: [{ indexed: true, internalType: 'address', name: 'account', type: 'address' }], name: 'MinterRemoved', type: 'event' },
		{
			anonymous: false,
			inputs: [
				{ indexed: true, internalType: 'address', name: 'previousOwner', type: 'address' },
				{ indexed: true, internalType: 'address', name: 'newOwner', type: 'address' },
			],
			name: 'OwnershipTransferred',
			type: 'event',
		},
		{
			anonymous: false,
			inputs: [
				{ indexed: true, internalType: 'address', name: 'from', type: 'address' },
				{ indexed: true, internalType: 'address', name: 'to', type: 'address' },
				{ indexed: false, internalType: 'uint256', name: 'value', type: 'uint256' },
			],
			name: 'Transfer',
			type: 'event',
		},
		{ inputs: [{ internalType: 'address', name: 'account', type: 'address' }], name: 'addMinter', outputs: [], stateMutability: 'nonpayable', type: 'function' },
		{
			inputs: [
				{ internalType: 'address', name: 'owner', type: 'address' },
				{ internalType: 'address', name: 'spender', type: 'address' },
			],
			name: 'allowance',
			outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
			stateMutability: 'view',
			type: 'function',
		},
		{
			inputs: [
				{ internalType: 'address', name: 'spender', type: 'address' },
				{ internalType: 'uint256', name: 'amount', type: 'uint256' },
			],
			name: 'approve',
			outputs: [{ internalType: 'bool', name: '', type: 'bool' }],
			stateMutability: 'nonpayable',
			type: 'function',
		},
		{ inputs: [{ internalType: 'address', name: 'account', type: 'address' }], name: 'balanceOf', outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }], stateMutability: 'view', type: 'function' },
		{
			inputs: [
				{ internalType: 'address', name: '_from', type: 'address' },
				{ internalType: 'uint256', name: '_amount', type: 'uint256' },
			],
			name: 'burn',
			outputs: [],
			stateMutability: 'nonpayable',
			type: 'function',
		},
		{ inputs: [], name: 'decimals', outputs: [{ internalType: 'uint8', name: '', type: 'uint8' }], stateMutability: 'view', type: 'function' },
		{
			inputs: [
				{ internalType: 'address', name: 'spender', type: 'address' },
				{ internalType: 'uint256', name: 'subtractedValue', type: 'uint256' },
			],
			name: 'decreaseAllowance',
			outputs: [{ internalType: 'bool', name: '', type: 'bool' }],
			stateMutability: 'nonpayable',
			type: 'function',
		},
		{ inputs: [], name: 'getOwner', outputs: [{ internalType: 'address', name: '', type: 'address' }], stateMutability: 'view', type: 'function' },
		{
			inputs: [
				{ internalType: 'address', name: 'spender', type: 'address' },
				{ internalType: 'uint256', name: 'addedValue', type: 'uint256' },
			],
			name: 'increaseAllowance',
			outputs: [{ internalType: 'bool', name: '', type: 'bool' }],
			stateMutability: 'nonpayable',
			type: 'function',
		},
		{ inputs: [{ internalType: 'address', name: 'account', type: 'address' }], name: 'isMinter', outputs: [{ internalType: 'bool', name: '', type: 'bool' }], stateMutability: 'view', type: 'function' },
		{
			inputs: [
				{ internalType: 'address', name: '_to', type: 'address' },
				{ internalType: 'uint256', name: '_amount', type: 'uint256' },
			],
			name: 'mint',
			outputs: [],
			stateMutability: 'nonpayable',
			type: 'function',
		},
		{ inputs: [{ internalType: 'uint256', name: 'amount', type: 'uint256' }], name: 'mint', outputs: [{ internalType: 'bool', name: '', type: 'bool' }], stateMutability: 'nonpayable', type: 'function' },
		{ inputs: [], name: 'name', outputs: [{ internalType: 'string', name: '', type: 'string' }], stateMutability: 'view', type: 'function' },
		{ inputs: [], name: 'owner', outputs: [{ internalType: 'address', name: '', type: 'address' }], stateMutability: 'view', type: 'function' },
		{
			inputs: [
				{ internalType: 'address', name: '_to', type: 'address' },
				{ internalType: 'uint256', name: '_amount', type: 'uint256' },
			],
			name: 'presale',
			outputs: [],
			stateMutability: 'nonpayable',
			type: 'function',
		},
		{ inputs: [{ internalType: 'address', name: 'account', type: 'address' }], name: 'removeMinter', outputs: [], stateMutability: 'nonpayable', type: 'function' },
		{ inputs: [], name: 'renounceMinter', outputs: [], stateMutability: 'nonpayable', type: 'function' },
		{ inputs: [], name: 'renounceOwnership', outputs: [], stateMutability: 'nonpayable', type: 'function' },
		{ inputs: [], name: 'symbol', outputs: [{ internalType: 'string', name: '', type: 'string' }], stateMutability: 'view', type: 'function' },
		{ inputs: [], name: 'totalSupply', outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }], stateMutability: 'view', type: 'function' },
		{
			inputs: [
				{ internalType: 'address', name: 'recipient', type: 'address' },
				{ internalType: 'uint256', name: 'amount', type: 'uint256' },
			],
			name: 'transfer',
			outputs: [{ internalType: 'bool', name: '', type: 'bool' }],
			stateMutability: 'nonpayable',
			type: 'function',
		},
		{
			inputs: [
				{ internalType: 'address', name: 'sender', type: 'address' },
				{ internalType: 'address', name: 'recipient', type: 'address' },
				{ internalType: 'uint256', name: 'amount', type: 'uint256' },
			],
			name: 'transferFrom',
			outputs: [{ internalType: 'bool', name: '', type: 'bool' }],
			stateMutability: 'nonpayable',
			type: 'function',
		},
		{ inputs: [{ internalType: 'address', name: 'newOwner', type: 'address' }], name: 'transferOwnership', outputs: [], stateMutability: 'nonpayable', type: 'function' },
	]

	const init = async () => {
		showLoader()

		chainID = await window.ethereum.request({ method: 'eth_chainId' })
		accounts = await window.ethereum.request({ method: 'eth_accounts' })

		if (chainID == 56 && accounts.length > 0) {
			connected = true

			window.web3 = new Web3(window.ethereum)
			contract = new window.web3.eth.Contract(presaleABI, presaleContract)
			tcontract = new window.web3.eth.Contract(tokenABI, tokenContract)

			contract.methods
				.getRewardTokenCount()
				.call()
				.then(function (rate) {
					tokenRate = rate / 1e18
				})

			contract.methods
				.balanceOf(accounts[0])
				.call()
				.then(function (balance) {
					document.getElementById('wallet_balance').innerText = format(balance / 1e8)
				})

			tcontract.methods
				.totalSupply()
				.call()
				.then(function (balance) {
					let percent = (balance / 1e8 / maxSupply) * 100
					document.getElementById('contract_balance').innerText = format(balance / 1e8)
					document.querySelector('.percent').style.width = percent + '%'
				})

			document.getElementById('btn_connect').innerHTML = 'Connected'
			document.getElementById('btn_connect').classList.add('connected')
			document.getElementById('inp_bnb').value = ''
			document.getElementById('inp_iii').value = ''
		} else {
			connected = false
		}

		hideLoader()
	}

	const connect = async () => {
		let chainID = await window.ethereum.request({ method: 'eth_chainId' })
		if (chainID != 56) {
			toastr('Please change network as Binance Smart Chain.')
			return
		}

		if (window.ethereum && window.ethereum.isMetaMask && window.ethereum.isConnected()) {
			window.web3 = new Web3(window.ethereum)
			window.ethereum.enable()
			return true
		}
		return false
	}

	const swap = async () => {
		if (connected) {
			let balance_bnb = document.getElementById('inp_bnb').value * 1e18
			if (balance_bnb >= 1 * 1e18 && balance_bnb <= 20 * 1e18) {
				contract.methods
					.deposit()
					.send({ from: accounts[0], value: balance_bnb }, function (res) {
						if (res != null) hideLoader()
					})
					.then(async function (res) {
						init()
					})

				showLoader()
			} else {
				toastr('Please input BNB amount correctly.')
			}
		} else {
			toastr('Please connect MetaMask')
		}
	}

	const sync = (from, to, rate) => {
		document.getElementById(to).value = document.getElementById(from).value * rate
	}

	const format = (balance) => {
		balance = balance.toLocaleString(0, { minimumFractionDigits: 0 })
		return balance
	}

	const toastr = (msg) => {
		let alert_lsit = document.querySelector('.alert_list')
		let alert = document.createElement('div')

		alert.innerHTML = msg
		alert_lsit.appendChild(alert)

		setTimeout(() => {
			alert.remove()
		}, 2500)
	}

	const showLoader = () => {
		document.querySelector('.loader').classList.add('active')
	}

	const hideLoader = () => {
		document.querySelector('.loader').classList.remove('active')
	}

	window.ethereum.on('accountsChanged', (accounts) => {
		init()
	})

	window.ethereum.on('chainChanged', (chainId) => {
		window.location.reload()
	})

	document.getElementById('btn_connect').addEventListener('click', connect)
	document.getElementById('btn_swap').addEventListener('click', swap)
	document.getElementById('inp_bnb').addEventListener('keyup', () => {
		sync('inp_bnb', 'inp_iii', 1 / tokenRate)
	})
	document.getElementById('inp_iii').addEventListener('keyup', () => {
		sync('inp_iii', 'inp_bnb', tokenRate)
	})

	init()
})
