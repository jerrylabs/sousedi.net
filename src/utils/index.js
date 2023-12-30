export async function getEvents() {
  const response = await fetch(
    'https://www.googleapis.com/calendar/v3/calendars/34b01b0108fa086637a50976a921db6359b0b0e6c9254544f7d9fac11aab6658@group.calendar.google.com/events?key=AIzaSyAAEOD-G6kwkWu-AMClCcwY7vQStNi2cTo',
    {
      referrer: window.location.pathname,
      timeZone: 'Europe/Prague',
    }
  )
  const data = await response.json()
  return data.items.sort((x, y) => new Date(x.end.dateTime || x.end.date) - new Date(y.end.dateTime || y.end.date))
}

export function formatEvent(e) {
  let date, startDate, endDate
  if (!e.start.dateTime) {
    startDate = new Date(e.start.date)
    endDate = new Date(e.end.date)
    endDate = new Date(endDate.setDate(endDate.getDate() - 1))
    if (startDate.getTime() === endDate.getTime()) {
      date = new Intl.DateTimeFormat('cs-CZ', {
        day: 'numeric',
        month: 'long',
      }).format(startDate)
    } else {
      date = `${new Intl.DateTimeFormat('cs-CZ', {
        day: 'numeric',
        month: startDate.getMonth() === endDate.getMonth() ? undefined : 'long'
      }).format(startDate)} - ${new Intl.DateTimeFormat('cs-CZ', {
        day: 'numeric',
        month: 'long'
      }).format(endDate)}`
    }
  } else {
    startDate = new Date(e.start.dateTime)
    endDate = new Date(e.end.dateTime)
    console.log('xxx', startDate, endDate, startDate === endDate)
    const sameDay = startDate.getDay() === endDate.getDay()
    if (startDate.getTime() === endDate.getTime()) {
      date = new Intl.DateTimeFormat('cs-CZ', {
        day: 'numeric',
        month: 'long',
        hour: '2-digit',
        minute: '2-digit',
      }).format(startDate)
    } else {
      date = `${new Intl.DateTimeFormat('cs-CZ', {
        day: 'numeric',
        month: 'long',
        hour: '2-digit',
        minute: '2-digit',
      }).format(startDate)} - ${new Intl.DateTimeFormat('cs-CZ', {
        day: sameDay ? undefined : 'numeric',
        month: sameDay ? undefined : 'long',
        hour:  '2-digit',
        minute: '2-digit',
      }).format(endDate)}`
    }
  }
  return `
    <div class="event">
      <h2 class="event__title">${e.summary}</h2>
      <div class="event__date">${date}</div>
      ${e.location ? `<div class="event__place">${e.location}</div>` : ''}
      ${e.description ? `<div class="event__description ">${e.description}</div>` : ''}
    </div>
  `
}