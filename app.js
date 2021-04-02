'use strict';
//Users Data
const account1 = {
  owner: 'Hasan Al Mamun',
  movements: [200, 450, -400, 3000, -650, -130, 70, 1300],
  interestRate: 1.9, // %
  pin: 1111,
};

const account2 = {
  owner: 'Noman Sheikh',
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 2.5,
  pin: 2222,
};

const account3 = {
  owner: 'Shabuj Mulla',
  movements: [200, -200, 340, -300, -20, 50, 400, -460],
  interestRate: 0.7,
  pin: 3333,
};

const account4 = {
  owner: 'Sujit Kundu',
  movements: [430, 1000, 700, 50, 90],
  interestRate: 1,
  pin: 4444,
};

const accounts = [account1, account2, account3, account4]

//Selecting All Elements
//Text Elements
const labelWelcome = document.querySelector('.welcome')
const labelDate = document.querySelector('.date')
const labelBalance = document.querySelector('.balance__value')
const labelSumIn = document.querySelector('.summary__value--in')
const labelSumOut = document.querySelector('.summary__value--out')
const labelSumInterest = document.querySelector('.summary__value--interest')
const labelTimer = document.querySelector('.timer')

//Container
const containerApp = document.querySelector('.app')
const containerMovements = document.querySelector('.movements')

//Inputs Elements
const inputLoginUser = document.querySelector('.login__input--user')
const inputLoginPin = document.querySelector('.login__input--pin')
const inputTransferTo = document.querySelector('.form__input--to')
const inputTransferAmmount = document.querySelector('.form__input--amount')
const inputLoanAmmount = document.querySelector('.form__input--loan--amount')
const inputCloseUser = document.querySelector('.form__input--close--user')
const inputClosePin = document.querySelector('.form__input--close--pin')

//Button Elements
const btnLogin = document.querySelector('.login__btn')
const btnTransfer = document.querySelector('.form__btn--transfer')
const btnLoan = document.querySelector('.form__btn--loan')
const btnClose = document.querySelector('.form__btn--close')
const btnSort = document.querySelector('.btn--sort')

//Getting The Current Date
function getDate() {
	const today = new Date()
	const day = String(today.getDate()).padStart(2, '0');
	const month = String(today.getMonth() + 1).padStart(2, '0');
	const year = today.getFullYear()
	return [day,month,year]
}
labelDate.textContent = `${getDate()[0]}/${getDate()[1]}/${getDate()[2]}`

// Set The Timer
function startTimer(duration, display) {
  let timer = duration, minutes, seconds;
  setInterval(function () {
    minutes = parseInt(timer / 60, 10);
    seconds = parseInt(timer % 60, 10);
    minutes = minutes < 10 ? "0" + minutes : minutes;
    seconds = seconds < 10 ? "0" + seconds : seconds;
    display.textContent = `${minutes}:${seconds}`;
    if (--timer < 0) {
      timer = duration;
    }
	}, 1000);
}

//Logout Happens When the timer runs out
function logoutTimer() {
  setInterval(() => {
    containerApp.classList.remove('open')
    labelWelcome.textContent = `Log in to get started`
  }, 3000000)
}

//Computing UserName Hasan Al Mamun => ham
function computingUserNames(acc) {
  acc.forEach(accs => {
    accs.userName = accs.owner.toLowerCase().split(' ').map(fWord => fWord[0]).join('')
  })
}
computingUserNames(accounts);

//Global Variable
let currentAccount;

//--------------------------------------Update the UI-------------------------------------
function updateUI(acc) {
  displayMovements(acc.movements)
  displayCurrentBalance(acc)
  displayTotalDeposite(acc.movements)
  displayTotalWithdrew(acc.movements)
  displayInterest(acc,acc.interestRate)  
}

//--------------------------------------Login Functionality---------------------------------------
function userLogin() {
  currentAccount = accounts.find(acc => acc.userName === inputLoginUser.value)
  if (currentAccount?.pin === Number(inputLoginPin.value)) {
    containerApp.classList.add('open')
    labelWelcome.textContent = `Welcome Back ${currentAccount.owner.split(' ')[0]}`
    //Clear Input Fields
    inputLoginUser.value = inputLoginPin.value = ''
    inputLoginPin.blur()
    //Display UI
    updateUI(currentAccount)
    //Timer
    startTimer(3000, labelTimer);
    logoutTimer()
  }
  else labelWelcome.textContent = `Wrong Credentials`
}

//Login To The Account :Happens on click
btnLogin.addEventListener('click', (e) => {
  e.preventDefault()
	userLogin()
})

//-------------------------------------------Close Account funtionality-----------------------------
function userLogout() {
  if (currentAccount.userName === inputCloseUser.value &&
    currentAccount.pin === Number(inputClosePin.value)) {
    const index = accounts.findIndex(acc =>acc.userName === currentAccount.userName)
    accounts.splice(index, 1)
    containerApp.classList.remove('open')
    labelWelcome.textContent = `Login to get started`
  }
  inputCloseUser.value = inputClosePin.value = ''
}

//Close Account :Happens on click
btnClose.addEventListener('click', (e) => {
  e.preventDefault()
  userLogout()
})


//-----------------------------------------Movements Functionality-------------------------------
//Display The Movements
function displayMovements(movements) {
  containerMovements.innerHTML = ''
  movements.forEach((mov, i) => {
    const type = mov < 0 ? `withdrawal` : `deposit`
    const html = `<div class="movements__row">
				<div class="movements__type movements__type--${type}">${i+1} ${type}</div>
				<div class="movements__value">${Math.abs(mov)}৳</div>
			</div>`
    containerMovements.insertAdjacentHTML('afterbegin', html)
  })
}


//------------Calculating The Summary: Depending on the accounts movements array------------------

//sum Of movements Array
const sum = (accumulator, curMov) => accumulator + curMov

//Calculate the Balance: With reduceMethod
function displayCurrentBalance(accs) {
  accs.balance = accs.movements.reduce(sum,0)//CallBack Function
  labelBalance.textContent = accs.balance + '৳'
}

//Calulate Total Deposites
function displayTotalDeposite(accs) {
  const incomes = accs
    .filter(mov => mov > 0)
    .reduce(sum) //CallBack Function
  labelSumIn.textContent = `${incomes}৳`
}

//Calulate Total Withdrawal
function displayTotalWithdrew(accs) {
  const expenses = accs.filter(mov => mov < 0)
  if (!expenses.length) labelSumOut.textContent = `0000৳`
  else {
    const totalExpenses = expenses.reduce(sum)
    labelSumOut.textContent = `${Math.abs(totalExpenses)}৳`
  }
}

//Calculate The Interest
function displayInterest(acc,interestRate) {
  const totalBalance = acc.balance
  const interest = (totalBalance * interestRate) / 100
  labelSumInterest.textContent = `${interest}৳`    
}

//-----------------------------Transfer Money Functionality-----------------------------
function transferMoney() {
  const amount = Number(inputTransferAmmount.value)
  const transferTo = inputTransferTo.value
  const receiverAcc = accounts.find(acc => acc.userName === transferTo)

  inputTransferAmmount.value = inputTransferTo.value = ''
  inputTransferAmmount.blur()
  if (amount > 0 && amount <= currentAccount.balance &&
    receiverAcc && receiverAcc.userName !== currentAccount.userName) {
    currentAccount.movements.push(-amount)
    receiverAcc.movements.push(amount)
    
    //Update The UI
    updateUI(currentAccount)  
  }
  else  {
    alert(`Wrong Conditions`)
  }
}

//Happens on click or Enter that btn
btnTransfer.addEventListener('click', (e) => {
  e.preventDefault()
  transferMoney()
})

//------------------------------------Request Loan Functionality-----------------------------------
function requestLoan() {
  let loan = Number(inputLoanAmmount.value)
  // const bigDeposite = currentAccount.movements.reduce((total,curValue)=> Math.max(total,curValue))
  // const bigDeposite = Math.max(...currentAccount.movements)
  const anyDeposite = currentAccount.movements.some(mov => mov >= loan * .1)

  if (loan > 0 && anyDeposite) {
  currentAccount.movements.push(loan)
  updateUI(currentAccount)
  }
  inputLoanAmmount.value = ''
}

btnLoan.addEventListener('click', e => {
  e.preventDefault()
  requestLoan()
})