const STORAGE_KEY="period-tracker"

function storeNewPeriod(s,e) {
  const periods = getAllPeriods()
  periods.push({startDate:s,endDate:e})
  periods.sort((a,b)=> new Date(b.startDate) - new Date(a.startDate))

  window.localStorage.setItem(STORAGE_KEY,JSON.stringify(periods))
}

function getAllPeriods() {
  const dat = window.localStorage.getItem(STORAGE_KEY)
  const periods = dat ? JSON.parse(dat) : []
  return periods
}

function renderPastPeriods() {
  const pastPeriodContainer = document.getElementById("past-periods")
  const periods = getAllPeriods()
  if ( periods.length === 0 ) {
    return
  }

  pastPeriodContainer.textContent = ""
  const pastPeriodHeader = document.createElement("h2")
  pastPeriodHeader.textContent = "Past Periods"

  const pastPeriodList = document.createElement("ul")
  periods.forEach((p) => {
    const pEl = document.createElement("li")
    pEl.textContent = `From ${formatDate(p.startDate)} to ${formatDate(p.endDate)}`
    pastPeriodList.appendChild(pEl)
  })

  pastPeriodContainer.appendChild(pastPeriodHeader)
  pastPeriodContainer.appendChild(pastPeriodList)
}

function formatDate(dateString) {
  const date = new Date(dateString)
  return date.toLocaleDateString("en-US", {timezone: "UTC"})
}

function main() {
  const newPeriodFormEl = document.getElementsByTagName("form")[0]
  const startDateInputEl = document.getElementById("start-date")
  const endDateInputEl = document.getElementById("end-date")

  newPeriodFormEl.addEventListener("submit",(ev)=> {
    ev.preventDefault()
    const startDate = startDateInputEl.value
    const endDate = endDateInputEl.value

    if (! validDates(startDate,endDate)) {
      newPeriodFormEl.reset()
      return
    }

    storeNewPeriod(startDate,endDate)

    renderPastPeriods()

    newPeriodFormEl.reset()
  })
}

function validDates(s,e) {
  if (!s||!e||s>e) {
    console.log(`invalid dates: ${s},${e}`)
    return false
  }
  return true
}

renderPastPeriods()
main()
