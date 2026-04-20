import "./EmptyState.css";

export function EmptyState() {
  return (
    <section className="empty-state">
      <div className="empty-state__illustration" aria-hidden="true">
        <div className="empty-state__envelope" />
        <div className="empty-state__person" />
      </div>

      <h2 className="empty-state__title">There is nothing here</h2>

      <p className="empty-state__text">
        Create a new invoice by clicking the
        <br />
        <strong>New Invoice</strong> button and get started
      </p>
    </section>
  );
}
