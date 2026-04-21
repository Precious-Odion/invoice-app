import { useMemo, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useInvoices } from "../../../context/InvoiceContext";
import type { InvoiceFormValues, InvoiceItem } from "../../../types/invoice";
import { Button } from "../../common/Button/Button";
import "./InvoiceFormDrawer.css";

interface InvoiceFormDrawerProps {
  mode: "new" | "edit";
}

interface FormErrors {
  clientName?: string;
  clientEmail?: string;
  description?: string;
  createdAt?: string;
  senderStreet?: string;
  senderCity?: string;
  senderPostCode?: string;
  senderCountry?: string;
  clientStreet?: string;
  clientCity?: string;
  clientPostCode?: string;
  clientCountry?: string;
  items?: string;
}

const formRef = useRef<HTMLFormElement>(null);

function createEmptyItem(): InvoiceItem {
  return {
    id: globalThis.crypto?.randomUUID?.() ?? `${Date.now()}-${Math.random()}`,
    name: "",
    quantity: 1,
    price: 0,
    total: 0,
  };
}

function createInitialValues(): InvoiceFormValues {
  return {
    createdAt: new Date().toISOString().split("T")[0],
    description: "",
    paymentTerms: 30,
    clientName: "",
    clientEmail: "",
    status: "pending",
    senderAddress: {
      street: "",
      city: "",
      postCode: "",
      country: "",
    },
    clientAddress: {
      street: "",
      city: "",
      postCode: "",
      country: "",
    },
    items: [],
  };
}

function isValidEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export function InvoiceFormDrawer({ mode }: InvoiceFormDrawerProps) {
  const navigate = useNavigate();
  const { id } = useParams();
  const { getInvoiceById, createInvoice, updateInvoice } = useInvoices();
  const invoice = mode === "edit" && id ? getInvoiceById(id) : undefined;

  const initialValues = useMemo<InvoiceFormValues>(() => {
    if (!invoice) {
      return createInitialValues();
    }

    return {
      createdAt: invoice.createdAt,
      description: invoice.description,
      paymentTerms: invoice.paymentTerms,
      clientName: invoice.clientName,
      clientEmail: invoice.clientEmail,
      status: invoice.status,
      senderAddress: invoice.senderAddress,
      clientAddress: invoice.clientAddress,
      items: invoice.items,
    };
  }, [invoice]);

  const [formValues, setFormValues] =
    useState<InvoiceFormValues>(initialValues);
  const [errors, setErrors] = useState<FormErrors>({});

  const isEdit = mode === "edit";

  if (isEdit && !invoice) {
    return (
      <section className="invoice-drawer">
        <div className="invoice-drawer__panel">
          <div className="invoice-drawer__scroll">
            <h1 className="invoice-drawer__title">Invoice not found</h1>
            <p className="invoice-form__error">
              The invoice you are trying to edit does not exist.
            </p>
          </div>

          <footer className="invoice-drawer__footer">
            <Button variant="secondary" onClick={() => navigate("/")}>
              Go Back
            </Button>
          </footer>
        </div>
      </section>
    );
  }

  const updateField = <K extends keyof InvoiceFormValues>(
    key: K,
    value: InvoiceFormValues[K],
  ) => {
    setFormValues((current) => ({
      ...current,
      [key]: value,
    }));
  };

  const updateAddressField = (
    section: "senderAddress" | "clientAddress",
    field: keyof InvoiceFormValues["senderAddress"],
    value: string,
  ) => {
    setFormValues((current) => ({
      ...current,
      [section]: {
        ...current[section],
        [field]: value,
      },
    }));
  };

  const updateItemField = (
    itemId: string,
    field: keyof InvoiceItem,
    value: string | number,
  ) => {
    setFormValues((current) => ({
      ...current,
      items: current.items.map((item) => {
        if (item.id !== itemId) {
          return item;
        }

        const updatedItem = {
          ...item,
          [field]: value,
        };

        const quantity = Number(updatedItem.quantity);
        const price = Number(updatedItem.price);

        return {
          ...updatedItem,
          quantity,
          price,
          total: quantity * price,
        };
      }),
    }));
  };

  const addItem = () => {
    setFormValues((current) => ({
      ...current,
      items: [...current.items, createEmptyItem()],
    }));
  };

  const removeItem = (itemId: string) => {
    setFormValues((current) => ({
      ...current,
      items: current.items.filter((item) => item.id !== itemId),
    }));
  };

  const isItemInvalid = (item: InvoiceItem) => {
    return (
      !item.name.trim() || Number(item.quantity) <= 0 || Number(item.price) <= 0
    );
  };

  const validate = (status: "draft" | "pending") => {
    const nextErrors: FormErrors = {};

    if (status === "pending") {
      if (!formValues.clientName.trim()) {
        nextErrors.clientName = "Client's name can't be empty";
      }

      if (!formValues.clientEmail.trim()) {
        nextErrors.clientEmail = "Client's email can't be empty";
      } else if (!isValidEmail(formValues.clientEmail)) {
        nextErrors.clientEmail = "Invalid email format";
      }

      if (!formValues.description.trim()) {
        nextErrors.description = "Project description can't be empty";
      }

      if (!formValues.createdAt.trim()) {
        nextErrors.createdAt = "Invoice date can't be empty";
      }

      if (![1, 7, 14, 30].includes(formValues.paymentTerms)) {
        nextErrors.createdAt = "Select a valid payment term";
      }

      if (!formValues.senderAddress.street.trim()) {
        nextErrors.senderStreet = "Sender street can't be empty";
      }

      if (!formValues.senderAddress.city.trim()) {
        nextErrors.senderCity = "Sender city can't be empty";
      }

      if (!formValues.senderAddress.postCode.trim()) {
        nextErrors.senderPostCode = "Sender post code can't be empty";
      }

      if (!formValues.senderAddress.country.trim()) {
        nextErrors.senderCountry = "Sender country can't be empty";
      }

      if (!formValues.clientAddress.street.trim()) {
        nextErrors.clientStreet = "Client street can't be empty";
      }

      if (!formValues.clientAddress.city.trim()) {
        nextErrors.clientCity = "Client city can't be empty";
      }

      if (!formValues.clientAddress.postCode.trim()) {
        nextErrors.clientPostCode = "Client post code can't be empty";
      }

      if (!formValues.clientAddress.country.trim()) {
        nextErrors.clientCountry = "Client country can't be empty";
      }

      const validItems = formValues.items.filter(
        (item) => !isItemInvalid(item),
      );
      const invalidItems = formValues.items.filter((item) =>
        isItemInvalid(item),
      );
      if (validItems.length === 0) {
        nextErrors.items = "At least one valid item must be added";
      } else if (invalidItems.length > 0) {
        nextErrors.items = "Some item rows are incomplete or invalid";
      }
    }

    setErrors(nextErrors);

    const isValid = Object.keys(nextErrors).length === 0;

    if (!isValid) {
      requestAnimationFrame(() => {
        const firstErrorField = formRef.current?.querySelector(
          ".invoice-form__input--error",
        ) as HTMLInputElement | HTMLSelectElement | null;

        firstErrorField?.focus();
      });
    }

    return isValid;
  };

  const handleSubmit = (status: "draft" | "pending") => {
    const isValid = validate(status);

    if (!isValid) {
      return;
    }

    const payload: InvoiceFormValues = {
      ...formValues,
      status,
      items: formValues.items.map((item) => ({
        ...item,
        quantity: Number(item.quantity),
        price: Number(item.price),
        total: Number(item.quantity) * Number(item.price),
      })),
    };

    if (isEdit && invoice) {
      updateInvoice(invoice.id, payload);
      navigate(`/invoice/${invoice.id}`);
      return;
    }

    const createdInvoice = createInvoice(payload);
    navigate(`/invoice/${createdInvoice.id}`);
  };

  return (
    <section className="invoice-drawer">
      <div className="invoice-drawer__panel">
        <div className="invoice-drawer__scroll">
          <h1 className="invoice-drawer__title">
            {isEdit ? (
              <>
                Edit <span className="invoice-drawer__id">#{invoice?.id}</span>
              </>
            ) : (
              "New Invoice"
            )}
          </h1>

          <form
            ref={formRef}
            className="invoice-form"
            onSubmit={(event) => event.preventDefault()}
          >
            <section className="invoice-form__section">
              <h2 className="invoice-form__section-title">Bill From</h2>

              <div className="invoice-form__field invoice-form__field--full">
                <label htmlFor="senderStreet">Street Address</label>
                <input
                  id="senderStreet"
                  className={
                    errors.senderStreet ? "invoice-form__input--error" : ""
                  }
                  value={formValues.senderAddress.street}
                  onChange={(event) =>
                    updateAddressField(
                      "senderAddress",
                      "street",
                      event.target.value,
                    )
                  }
                />
                {errors.senderStreet ? (
                  <p className="invoice-form__error">{errors.senderStreet}</p>
                ) : null}
              </div>

              <div className="invoice-form__row invoice-form__row--triple">
                <div className="invoice-form__field">
                  <label htmlFor="senderCity">City</label>
                  <input
                    id="senderCity"
                    className={
                      errors.senderCity ? "invoice-form__input--error" : ""
                    }
                    value={formValues.senderAddress.city}
                    onChange={(event) =>
                      updateAddressField(
                        "senderAddress",
                        "city",
                        event.target.value,
                      )
                    }
                  />
                  {errors.senderCity ? (
                    <p className="invoice-form__error">{errors.senderCity}</p>
                  ) : null}
                </div>

                <div className="invoice-form__field">
                  <label htmlFor="senderPostCode">Post Code</label>
                  <input
                    id="senderPostCode"
                    className={
                      errors.senderPostCode ? "invoice-form__input--error" : ""
                    }
                    value={formValues.senderAddress.postCode}
                    onChange={(event) =>
                      updateAddressField(
                        "senderAddress",
                        "postCode",
                        event.target.value,
                      )
                    }
                  />
                  {errors.senderPostCode ? (
                    <p className="invoice-form__error">
                      {errors.senderPostCode}
                    </p>
                  ) : null}
                </div>

                <div className="invoice-form__field">
                  <label htmlFor="senderCountry">Country</label>
                  <input
                    id="senderCountry"
                    className={
                      errors.senderCountry ? "invoice-form__input--error" : ""
                    }
                    value={formValues.senderAddress.country}
                    onChange={(event) =>
                      updateAddressField(
                        "senderAddress",
                        "country",
                        event.target.value,
                      )
                    }
                  />
                  {errors.senderCountry ? (
                    <p className="invoice-form__error">
                      {errors.senderCountry}
                    </p>
                  ) : null}
                </div>
              </div>
            </section>

            <section className="invoice-form__section">
              <h2 className="invoice-form__section-title">Bill To</h2>

              <div className="invoice-form__field invoice-form__field--full">
                <label htmlFor="clientName">Client&apos;s Name</label>
                <input
                  id="clientName"
                  placeholder="e.g. John Doe"
                  className={
                    errors.clientName ? "invoice-form__input--error" : ""
                  }
                  value={formValues.clientName}
                  onChange={(event) =>
                    updateField("clientName", event.target.value)
                  }
                />
                {errors.clientName ? (
                  <p className="invoice-form__error">{errors.clientName}</p>
                ) : null}
              </div>

              <div className="invoice-form__field invoice-form__field--full">
                <label htmlFor="clientEmail">Client&apos;s Email</label>
                <input
                  id="clientEmail"
                  type="email"
                  placeholder="e.g. email@example.com"
                  className={
                    errors.clientEmail ? "invoice-form__input--error" : ""
                  }
                  value={formValues.clientEmail}
                  onChange={(event) =>
                    updateField("clientEmail", event.target.value)
                  }
                />
                {errors.clientEmail ? (
                  <p className="invoice-form__error">{errors.clientEmail}</p>
                ) : null}
              </div>

              <div className="invoice-form__field invoice-form__field--full">
                <label htmlFor="clientStreet">Street Address</label>
                <input
                  id="clientStreet"
                  className={
                    errors.clientStreet ? "invoice-form__input--error" : ""
                  }
                  value={formValues.clientAddress.street}
                  onChange={(event) =>
                    updateAddressField(
                      "clientAddress",
                      "street",
                      event.target.value,
                    )
                  }
                />
                {errors.clientStreet ? (
                  <p className="invoice-form__error">{errors.clientStreet}</p>
                ) : null}
              </div>

              <div className="invoice-form__row invoice-form__row--triple">
                <div className="invoice-form__field">
                  <label htmlFor="clientCity">City</label>
                  <input
                    id="clientCity"
                    className={
                      errors.clientCity ? "invoice-form__input--error" : ""
                    }
                    value={formValues.clientAddress.city}
                    onChange={(event) =>
                      updateAddressField(
                        "clientAddress",
                        "city",
                        event.target.value,
                      )
                    }
                  />
                  {errors.clientCity ? (
                    <p className="invoice-form__error">{errors.clientCity}</p>
                  ) : null}
                </div>

                <div className="invoice-form__field">
                  <label htmlFor="clientPostCode">Post Code</label>
                  <input
                    id="clientPostCode"
                    className={
                      errors.clientPostCode ? "invoice-form__input--error" : ""
                    }
                    value={formValues.clientAddress.postCode}
                    onChange={(event) =>
                      updateAddressField(
                        "clientAddress",
                        "postCode",
                        event.target.value,
                      )
                    }
                  />
                  {errors.clientPostCode ? (
                    <p className="invoice-form__error">
                      {errors.clientPostCode}
                    </p>
                  ) : null}
                </div>

                <div className="invoice-form__field">
                  <label htmlFor="clientCountry">Country</label>
                  <input
                    id="clientCountry"
                    className={
                      errors.clientCountry ? "invoice-form__input--error" : ""
                    }
                    value={formValues.clientAddress.country}
                    onChange={(event) =>
                      updateAddressField(
                        "clientAddress",
                        "country",
                        event.target.value,
                      )
                    }
                  />
                  {errors.clientCountry ? (
                    <p className="invoice-form__error">
                      {errors.clientCountry}
                    </p>
                  ) : null}
                </div>
              </div>

              <div className="invoice-form__row invoice-form__row--double">
                <div className="invoice-form__field">
                  <label htmlFor="invoiceDate">Invoice Date</label>
                  <input
                    id="invoiceDate"
                    type="date"
                    className={
                      errors.createdAt ? "invoice-form__input--error" : ""
                    }
                    value={formValues.createdAt}
                    onChange={(event) =>
                      updateField("createdAt", event.target.value)
                    }
                  />
                  {errors.createdAt ? (
                    <p className="invoice-form__error">{errors.createdAt}</p>
                  ) : null}
                </div>

                <div className="invoice-form__field">
                  <label htmlFor="paymentTerms">Payment Terms</label>
                  <select
                    id="paymentTerms"
                    className={
                      errors.createdAt ? "invoice-form__input--error" : ""
                    }
                    value={formValues.paymentTerms}
                    onChange={(event) =>
                      updateField("paymentTerms", Number(event.target.value))
                    }
                  >
                    <option value={1}>Net 1 Day</option>
                    <option value={7}>Net 7 Days</option>
                    <option value={14}>Net 14 Days</option>
                    <option value={30}>Net 30 Days</option>
                  </select>
                </div>
              </div>

              <div className="invoice-form__field invoice-form__field--full">
                <label htmlFor="projectDescription">Project Description</label>
                <input
                  id="projectDescription"
                  placeholder="e.g. App Development Service"
                  className={
                    errors.description ? "invoice-form__input--error" : ""
                  }
                  value={formValues.description}
                  onChange={(event) =>
                    updateField("description", event.target.value)
                  }
                />
                {errors.description ? (
                  <p className="invoice-form__error">{errors.description}</p>
                ) : null}
              </div>
            </section>

            <section className="invoice-form__section">
              <h2 className="invoice-form__items-title">Item List</h2>

              <div className="invoice-items">
                {formValues.items.length > 0 ? (
                  <div className="invoice-items__header">
                    <span>Item Name</span>
                    <span>Qty.</span>
                    <span>Price</span>
                    <span>Total</span>
                    <span />
                  </div>
                ) : null}

                {formValues.items.map((item) => {
                  const itemHasError = errors.items
                    ? isItemInvalid(item)
                    : false;

                  return (
                    <div className="invoice-items__row" key={item.id}>
                      <input
                        className={
                          itemHasError && !item.name.trim()
                            ? "invoice-form__input--error"
                            : ""
                        }
                        value={item.name}
                        onChange={(event) =>
                          updateItemField(item.id, "name", event.target.value)
                        }
                      />
                      <input
                        type="number"
                        min="1"
                        className={
                          itemHasError && Number(item.quantity) <= 0
                            ? "invoice-form__input--error"
                            : ""
                        }
                        value={item.quantity}
                        onChange={(event) =>
                          updateItemField(
                            item.id,
                            "quantity",
                            Number(event.target.value),
                          )
                        }
                      />
                      <input
                        type="number"
                        min="0"
                        step="0.01"
                        className={
                          itemHasError && Number(item.price) <= 0
                            ? "invoice-form__input--error"
                            : ""
                        }
                        value={item.price}
                        onChange={(event) =>
                          updateItemField(
                            item.id,
                            "price",
                            Number(event.target.value),
                          )
                        }
                      />
                      <p>{item.total.toFixed(2)}</p>
                      <button
                        type="button"
                        className="invoice-items__delete"
                        onClick={() => removeItem(item.id)}
                      >
                        🗑
                      </button>
                    </div>
                  );
                })}
              </div>
              {errors.items ? (
                <p className="invoice-form__error">{errors.items}</p>
              ) : null}

              <button
                type="button"
                className="invoice-form__add-item"
                onClick={addItem}
              >
                + Add New Item
              </button>
            </section>
          </form>
        </div>

        <footer className="invoice-drawer__footer">
          {isEdit ? (
            <>
              <Button variant="secondary" onClick={() => navigate(-1)}>
                Cancel
              </Button>
              <Button
                variant="primary"
                onClick={() =>
                  handleSubmit(
                    invoice?.status === "draft" ? "draft" : "pending",
                  )
                }
              >
                Save Changes
              </Button>
            </>
          ) : (
            <>
              <Button variant="light" onClick={() => navigate("/")}>
                Discard
              </Button>
              <div className="invoice-drawer__footer-right">
                <Button
                  variant="secondary"
                  onClick={() => handleSubmit("draft")}
                >
                  Save as Draft
                </Button>
                <Button
                  variant="primary"
                  onClick={() => handleSubmit("pending")}
                >
                  Save &amp; Send
                </Button>
              </div>
            </>
          )}
        </footer>
      </div>
    </section>
  );
}
