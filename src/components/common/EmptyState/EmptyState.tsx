import emptyIllustration from "../../../assets/illustration-empty.png";
import "./EmptyState.css";

export function EmptyState() {
  return (
    <section className="empty-state">
      <img
        className="empty-state__image"
        src={emptyIllustration}
        alt=""
        aria-hidden="true"
      />

      <h2 className="empty-state__title">There is nothing here</h2>

      <p className="empty-state__text">
        Create a new invoice by clicking the
        <br />
        <strong>New Invoice</strong> button and get started
      </p>
    </section>
  );
}
