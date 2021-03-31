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
const loginForm = document.querySelector('.login')

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

//Computing UserName Hasan Al Mamun => ham
function computingUserNames(acc) {
  acc.forEach(accs => {
    accs.userName = accs.owner.toLowerCase().split(' ').map(fWord => fWord[0]).join('')
  })
}
computingUserNames(accounts);

//Global Variable
let currentAccount;


//--------------------------------------Login Functionality
function userLogin() {
  currentAccount = accounts.find(acc => acc.userName === inputLoginUser.value)
  if (currentAccount?.pin === Number(inputLoginPin.value)) {
    //Display UI Movements & Balance
    containerApp.classList.add('open')
    labelWelcome.textContent = `Welcome Back ${currentAccount.owner.split(' ')[0]}`
    displayMovements(currentAccount.movements)
    displayCurrentBalance(currentAccount.movements)
    
    //Clear Input Fields
    inputLoginUser.value = inputLoginPin.value = ''
    inputLoginPin.blur()

    //Display Summary
    displayTotalDeposite(currentAccount.movements)
    displayTotalWithdrew(currentAccount.movements)
    displayInterest(currentAccount.movements, currentAccount.interestRate)

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

//-------------------------------------------Logout Functionality
function userLogout() {
  const logOutAccount = accounts.find(acc => acc.userName === inputCloseUser.value)
  console.log(currentAccount, logOutAccount);
  if (logOutAccount === currentAccount) {
    if (logOutAccount.pin === Number(inputClosePin.value)) {
      containerApp.classList.remove('open')
      labelWelcome.textContent = `Log in to get started`
    }
    else {
      alert(`Wrong Credentials: Pfff try again`)
    }   
  }
  else {
    alert(`Wrong Credentials: Pfff try again`)
  }    
}

//Logout Account :Happens on click
btnClose.addEventListener('click', (e) => {
  e.preventDefault()
  userLogout()
})

//Logout Happens When the timer runs out
function logoutTimer() {
  setInterval(() => {
    containerApp.classList.remove('open')
    loginForm.style.display = 'block'
    labelWelcome.textContent = `Log in to get started`
  }, 3000000)
}

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


//------------Calculating The Balances: Depending on the accounts movements array
//Calulate Total Deposites
function displayTotalDeposite(accs) {
  const incomes = accs
    .filter(mov => mov > 0)
    .reduce((accumulator, curMove) => accumulator + curMove)
  labelSumIn.textContent = `${incomes}৳`
}

//Calulate Total Withdrawal
function displayTotalWithdrew(accs) {
  const expenses = accs.filter(mov => mov < 0)
  if (!expenses.length) labelSumOut.textContent = `0000৳`
  else {
    const totalExpenses = expenses.reduce((accumulator, curMove) => accumulator + curMove)
    labelSumOut.textContent = `${Math.abs(totalExpenses)}৳`
  }
}

//Calculate The Interest
function displayInterest(accs, interestRate) {
  const totalInterest = accs
    .filter(mov => mov > 0)
    .map(deposite => (deposite * interestRate) / 100)
    .filter((int) => int > 10) //Will Exclude if your Interest is less than 10tk
  
  if (!totalInterest.length)labelSumInterest.textContent = `0000৳`
  else {
    const finalInterest  = totalInterest.reduce((accumulator, interest) => accumulator + interest)
    labelSumInterest.textContent = `${finalInterest}৳`    
  }
}

//Calculate the Balance: With reduceMethod
function displayCurrentBalance(accs) {
  const totalBalance = accs.reduce((accumulator, curMov) => accumulator + curMov, 0)
  labelBalance.textContent = totalBalance + '৳'
}