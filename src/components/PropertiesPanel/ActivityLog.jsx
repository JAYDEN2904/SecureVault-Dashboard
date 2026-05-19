import './PropertiesPanel.css'

export default function ActivityLog() {

  const items = [
    { summary: 'Viewed', time: 'Today · 9:42 AM' },
    { summary: 'Edited', time: 'Yesterday · 4:16 PM' },
    { summary: 'Shared with Legal Ops', time: 'Mon · 11:03 AM' },
  ]

  return (
    <section className="activity-log" aria-label="Recent activity">
      <h3 className="activity-log__heading">Activity</h3>
      <ul className="activity-log__list">
        {items.map((item) => (
          <li key={`${item.summary}-${item.time}`} className="activity-log__item">
            <span className="activity-log__summary">{item.summary}</span>
            <span className="activity-log__time">{item.time}</span>
          </li>
        ))}
      </ul>
    </section>
  )
}
