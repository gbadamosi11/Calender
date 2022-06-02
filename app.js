let now = new Date()

let monthList = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']
let dayList = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
let viewMode = {
    date : 'date',
    month : 'month',
    year: 'year'
}
let currentView = viewMode.date

let currentMonth = now.getMonth()
let currentYear = now.getFullYear()

let headerName = document.getElementById('headerName')
let prevButton = document.getElementById('prevButton')
let nextButton = document.getElementById('nextButton')
let dayNames = document.getElementById('dayNames')
let dayDates = document.getElementById('dayDates')
let monthSection = document.getElementById('monthSection')
let yearSection = document.getElementById('yearSection')

setCalender(currentMonth, currentYear)
setDayNames()
prevButton.addEventListener('click', prevButtonHandler)
nextButton.addEventListener('click', nextButtonHandler)
headerName.addEventListener('click', centerButtonHandler)

function closeSelectMonth(month, year) {
	currentView = viewMode.date
	currentMonth = month
	monthSection.classList.remove('show')
	setCalender(month, year)
}

function closeSelectYear(year) {
	currentView = viewMode.month
	currentYear = year
	yearSection.classList.remove('show')
	setSelectMonth(year)
}

function setSelectMonth(year) {
	currentView = viewMode.month
	monthSection.innerHTML = ''
	monthSection.classList.add('show')

	headerName.innerHTML = year
    
	for(let i = 0; i < monthList.length; i++) {
		let month = document.createElement('button')
		let monthName = document.createTextNode(monthList[i])
		if(year === now.getFullYear() && i === now.getMonth()) {
			let thisMonth = document.createElement('span')
			month.setAttribute('class', 'mark')
			thisMonth.appendChild(monthName)
			month.appendChild(thisMonth)
		} else {
			month.appendChild(monthName)
		}
		month.addEventListener('click', () => closeSelectMonth(i, year))
		monthSection.appendChild(month)
	}
}

function setSelectYear(year) {
	currentView = viewMode.year
	yearSection.innerHTML = ''
	yearSection.classList.add('show')

	let yearLocation =  year % 10 === 0 ? 10 : year % 10
	let topBoundary = yearLocation === 10? year: year + (10 - yearLocation)
	let bottomBoundary = topBoundary - 9

	headerName.innerHTML = `${bottomBoundary} - ${topBoundary}`

	for(let i = 0; i < 12; i ++) {
		let yearString = bottomBoundary + i - 1
		let yearButton = document.createElement('button')
		let yearPrint = document.createTextNode(yearString)
		if(i < 1 || i > 10) {
			yearButton.setAttribute('class', 'offset')
		}
		if(yearString === now.getFullYear()) {
			let thisYear = document.createElement('span')
			yearButton.setAttribute('class', 'mark')
			thisYear.appendChild(yearPrint)
			yearButton.appendChild(thisYear)
		} else {
			yearButton.appendChild(yearPrint)
		}
		yearButton.addEventListener('click', () => closeSelectYear(yearString))
		yearSection.appendChild(yearButton)
	}
}

function setDayNames() {
	for(let i of dayList) {
		let day = document.createElement('div')
		let dayName = document.createTextNode(i.substring(0,3))
		day.appendChild(dayName)
		dayNames.appendChild(day)
	}
}

function getPrevMonthAndYear() {
	return ({
		year: (currentMonth === 0) ? currentYear - 1 : currentYear,
		month: (currentMonth === 0) ? 11 : currentMonth - 1
	})
}

function getDayInMonth(year, month) {
	return (32 - new Date(year, month, 32).getDate())
}

function prevButtonHandler() {
	switch(currentView) {
		case viewMode.year: {
			prevDecade()
			break
		}
		case viewMode.month: {
			prevYear()
			break
		}
		default: prevMonth()
	}
}

function centerButtonHandler() {
	switch(currentView) {
		case viewMode.date: {
			setSelectMonth(currentYear)
			break
		}
		case viewMode.month: {
			setSelectYear(currentYear)
			break
		}
	}
}

function nextButtonHandler() {
	switch(currentView) {
		case viewMode.year: {
			nextDecade()
			break
		}
		case viewMode.month: {
			nextYear()
			break
		}
		default: nextMonth()
	}
}

function prevDecade() {
	currentYear = currentYear - 10
	setSelectYear(currentYear)
}
function nextDecade() {
	currentYear = currentYear + 10
	setSelectYear(currentYear)
}

function prevYear() {
	currentYear = currentYear - 1
	setSelectMonth(currentYear)
}
function nextYear() {
	currentYear = currentYear + 1
	setSelectMonth(currentYear)
}

function prevMonth() {
	let  { year, month } = getPrevMonthAndYear()
	currentYear = year
	currentMonth = month
	setCalender(currentMonth, currentYear)
}
function nextMonth() {
	currentYear = (currentMonth === 11) ? currentYear + 1 : currentYear
	currentMonth = (currentMonth === 11) ? 0 : currentMonth + 1
	setCalender(currentMonth, currentYear)
}

function setCalender(month, year) {
	let selectedMonth = monthList[month]
	headerName.innerHTML = `${selectedMonth} ${year}`
	let prevDate = getPrevMonthAndYear()

	let firstDay = (new Date(year, month)).getDay()
	let dayInMonth = getDayInMonth(year, month)
	let prevdayInMonth = getDayInMonth(prevDate.year, prevDate.month)
	dayDates.innerHTML = ''

	let nextDayInMonth = (dayInMonth + firstDay) % 7 === 0 ? 0 : 7 - ((dayInMonth + firstDay) % 7)
	let boundary = firstDay + dayInMonth + nextDayInMonth

	for(let i = 0; i < boundary; i++) {
		if(i < firstDay || i >= firstDay + dayInMonth) {
			let day = document.createElement('button')
			let date = i < firstDay ? prevdayInMonth - (firstDay - 1 - i) : nextDayInMonth - (boundary - i) + 1
			let dayDate = document.createTextNode(date)
			day.setAttribute('class', 'offset')
			day.appendChild(dayDate)
			dayDates.appendChild(day)
			continue
		}
		let date = i - firstDay + 1
		let day = document.createElement('button')
		let dayDate = document.createTextNode(date)
		if(month === now.getMonth() && year === now.getFullYear() && date === now.getDate()) {
			day.setAttribute('class', 'mark')
			let mark = document.createElement('span')
			mark.appendChild(dayDate)
			day.appendChild(mark)
			dayDates.appendChild(day)
			continue
		}
		day.appendChild(dayDate)
		dayDates.appendChild(day)
	}
}
