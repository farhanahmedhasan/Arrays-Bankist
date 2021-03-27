'use strict';
//Users Data
const account1 = {
  owner: 'hasan',
  movements: [200, 450, -400, 3000, -650, -130, 70, 1300],
  interestRate: 1.2, // %
  pin: 1111,
};

const account2 = {
  owner: 'noman',
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5,
  pin: 2222,
};

const account3 = {
  owner: 'Shabuj',
  movements: [200, -200, 340, -300, -20, 50, 400, -460],
  interestRate: 0.7,
  pin: 3333,
};

const account4 = {
  owner: 'Sujit',
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

//--------------------------------------Login Functionality
function userLogin() {
  const loginUser = inputLoginUser.value
  const loginPin = Number(inputLoginPin.value)
	for (const values of accounts) {
		if (values.owner === loginUser && values.pin === loginPin) {
      containerApp.classList.add('open')
      labelWelcome.textContent = `Welcome to your acount ${loginUser}`
      loginForm.style.display = 'none'
      startTimer(300, labelTimer);
      logoutTimer()
      break;
		}
		else if (values.owner !== loginUser || values.pin !== loginPin){
      labelWelcome.textContent = `Wrong Credentials`
		}
	}
}

//Login To The Account :Happens on click
btnLogin.addEventListener('click', (e) => {
  e.preventDefault()
	userLogin()
})

//-------------------------------------------Logout Functionality
function userLogout() {
  const loginUser = inputLoginUser.value
  const loginPin = Number(inputLoginPin.value)
  const logoutUser = inputCloseUser.value
  const logoutPin = Number(inputClosePin.value)
  if (logoutUser === loginUser && logoutPin === loginPin) {
    containerApp.classList.remove('open')
    loginForm.style.display = 'block'
    labelWelcome.textContent = `Log in to get started`
  }
  else {
    alert(`Can't Log Out: Wrong Credentials`)
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
  }, 300000)
}