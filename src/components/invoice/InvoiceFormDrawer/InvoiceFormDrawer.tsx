import { Button } from "../../common/Button/Button";
import "./InvoiceFormDrawer.css";

interface InvoiceFormDrawerProps {
  mode: "new" | "edit";
}

export function InvoiceFormDrawer({ mode }: InvoiceFormDrawerProps) {
  const isEdit = mode === "edit";

  return (
    <section className="invoice-drawer">
      <div className="invoice-drawer__panel">
        <div className="invoice-drawer__scroll">
          <h1 className="invoice-drawer__title">
            {isEdit ? (
              <>
                Edit <span className="invoice-drawer__id">#XM9141</span>
              </>
            ) : (
              "New Invoice"
            )}
          </h1>

          <form className="invoice-form">
            <section className="invoice-form__section">
              <h2 className="invoice-form__section-title">Bill From</h2>

              <div className="invoice-form__field invoice-form__field--full">
                <label htmlFor="senderStreet">Street Address</label>
                <input id="senderStreet" defaultValue="19 Union Terrace" />
              </div>

              <div className="invoice-form__row invoice-form__row--triple">
                <div className="invoice-form__field">
                  <label htmlFor="senderCity">City</label>
                  <input id="senderCity" defaultValue="London" />
                </div>

                <div className="invoice-form__field">
                  <label htmlFor="senderPostCode">Post Code</label>
                  <input id="senderPostCode" defaultValue="E1 3EZ" />
                </div>

                <div className="invoice-form__field">
                  <label htmlFor="senderCountry">Country</label>
                  <input id="senderCountry" defaultValue="United Kingdom" />
                </div>
              </div>
            </section>

            <section className="invoice-form__section">
              <h2 className="invoice-form__section-title">Bill To</h2>

              <div className="invoice-form__field invoice-form__field--full">
                <label htmlFor="clientName">Client&apos;s Name</label>
                <input id="clientName" defaultValue="Alex Grim" />
              </div>

              <div className="invoice-form__field invoice-form__field--full">
                <label htmlFor="clientEmail">Client&apos;s Email</label>
                <input id="clientEmail" defaultValue="alexgrim@mail.com" />
              </div>

              <div className="invoice-form__field invoice-form__field--full">
                <label htmlFor="clientStreet">Street Address</label>
                <input id="clientStreet" defaultValue="84 Church Way" />
              </div>

              <div className="invoice-form__row invoice-form__row--triple">
                <div className="invoice-form__field">
                  <label htmlFor="clientCity">City</label>
                  <input id="clientCity" defaultValue="Bradford" />
                </div>

                <div className="invoice-form__field">
                  <label htmlFor="clientPostCode">Post Code</label>
                  <input id="clientPostCode" defaultValue="BD1 9PB" />
                </div>

                <div className="invoice-form__field">
                  <label htmlFor="clientCountry">Country</label>
                  <input id="clientCountry" defaultValue="United Kingdom" />
                </div>
              </div>

              <div className="invoice-form__row invoice-form__row--double">
                <div className="invoice-form__field">
                  <label htmlFor="invoiceDate">Invoice Date</label>
                  <input id="invoiceDate" defaultValue="21 Aug 2021" />
                </div>

                <div className="invoice-form__field">
                  <label htmlFor="paymentTerms">Payment Terms</label>
                  <select id="paymentTerms" defaultValue="30">
                    <option value="1">Net 1 Day</option>
                    <option value="7">Net 7 Days</option>
                    <option value="14">Net 14 Days</option>
                    <option value="30">Net 30 Days</option>
                  </select>
                </div>
              </div>

              <div className="invoice-form__field invoice-form__field--full">
                <label htmlFor="projectDescription">Project Description</label>
                <input id="projectDescription" defaultValue="Graphic Design" />
              </div>
            </section>

            <section className="invoice-form__section">
              <h2 className="invoice-form__items-title">Item List</h2>

              <div className="invoice-items">
                <div className="invoice-items__header">
                  <span>Item Name</span>
                  <span>Qty.</span>
                  <span>Price</span>
                  <span>Total</span>
                  <span />
                </div>

                {[
                  {
                    name: "Banner Design",
                    quantity: 1,
                    price: 156,
                    total: 156,
                  },
                  { name: "Email Design", quantity: 2, price: 200, total: 400 },
                ].map((item) => (
                  <div className="invoice-items__row" key={item.name}>
                    <input defaultValue={item.name} />
                    <input defaultValue={item.quantity} />
                    <input defaultValue={item.price.toFixed(2)} />
                    <p>{item.total.toFixed(2)}</p>
                    <button type="button" className="invoice-items__delete">
                      🗑
                    </button>
                  </div>
                ))}
              </div>

              <button type="button" className="invoice-form__add-item">
                + Add New Item
              </button>
            </section>
          </form>
        </div>

        <footer className="invoice-drawer__footer">
          {isEdit ? (
            <>
              <Button variant="secondary">Cancel</Button>
              <Button variant="primary">Save Changes</Button>
            </>
          ) : (
            <>
              <Button variant="light">Discard</Button>
              <div className="invoice-drawer__footer-right">
                <Button variant="secondary">Save as Draft</Button>
                <Button variant="primary">Save &amp; Send</Button>
              </div>
            </>
          )}
        </footer>
      </div>
    </section>
  );
}
