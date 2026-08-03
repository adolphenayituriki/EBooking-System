const styles = {
  Pending: 'bg-amber-50 text-amber-700 border-amber-200',
  Confirmed: 'bg-green-50 text-green-700 border-green-200',
  Cancelled: 'bg-red-50 text-red-600 border-red-200',
  Completed: 'bg-blue-50 text-blue-700 border-blue-200',
};

export default function StatusBadge({ status }) {
  return <span className={`badge whitespace-nowrap ${styles[status] || styles.Pending}`}>{status}</span>;
}
