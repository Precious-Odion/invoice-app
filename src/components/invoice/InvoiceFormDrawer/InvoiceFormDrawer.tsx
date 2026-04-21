import { useMemo, useState } from "react";
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
  senderStreet?: string;
  senderCity?: string;
  senderPostCode?: string;
  senderCountry?: string;
  clientStreet?: string;
  clientCity?: string;
  clientPostCode?: string;
  clientCountry?: string;
  createdAt?: string;
  items?: string;
}

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
    items: [createEmptyItem()],
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

  if (mode === "edit" && !invoice) {
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

      const hasInvalidItems =
        formValues.items.length === 0 ||
        formValues.items.some(
          (item) =>
            !item.name.trim() ||
            Number(item.quantity) <= 0 ||
            Number(item.price) <= 0,
        );

      if (hasInvalidItems) {
        nextErrors.items = "At least one valid item must be added";
      }
    }

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
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
            className="invoice-form"
            onSubmit={(event) => event.preventDefault()}
          >
            <section className="invoice-form__section">
              <h2 className="invoice-form__section-title">Bill From</h2>

              <div className="invoice-form__field invoice-form__field--full">
                <label htmlFor="senderStreet">Street Address</label>
                <input
                  id="senderStreet"
                  value={formValues.senderAddress.street}
                  onChange={(event) =>
                    updateAddressField(
                      "senderAddress",
                      "street",
                      event.target.value,
                    )
                  }
                />
              </div>

              <div className="invoice-form__row invoice-form__row--triple">
                <div className="invoice-form__field">
                  <label htmlFor="senderCity">City</label>
                  <input
                    id="senderCity"
                    value={formValues.senderAddress.city}
                    onChange={(event) =>
                      updateAddressField(
                        "senderAddress",
                        "city",
                        event.target.value,
                      )
                    }
                  />
                </div>

                <div className="invoice-form__field">
                  <label htmlFor="senderPostCode">Post Code</label>
                  <input
                    id="senderPostCode"
                    value={formValues.senderAddress.postCode}
                    onChange={(event) =>
                      updateAddressField(
                        "senderAddress",
                        "postCode",
                        event.target.value,
                      )
                    }
                  />
                </div>

                <div className="invoice-form__field">
                  <label htmlFor="senderCountry">Country</label>
                  <input
                    id="senderCountry"
                    value={formValues.senderAddress.country}
                    onChange={(event) =>
                      updateAddressField(
                        "senderAddress",
                        "country",
                        event.target.value,
                      )
                    }
                  />
                </div>
              </div>
            </section>

            <section className="invoice-form__section">
              <h2 className="invoice-form__section-title">Bill To</h2>

              <div className="invoice-form__field invoice-form__field--full">
                <label htmlFor="clientName">Client&apos;s Name</label>
                <input
                  id="clientName"
                  value={formValues.clientName}
                  onChange={(event) =>
                    updateField("clientName", event.target.value)
                  }
                />
                {errors.clientName ? (
                  <p className="invoice-form__error">
                    className=
                    {errors.clientName ? "invoice-form__input--error" : ""}
                  </p>
                ) : null}
              </div>

              <div className="invoice-form__field invoice-form__field--full">
                <label htmlFor="clientEmail">Client&apos;s Email</label>
                <input
                  id="clientEmail"
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
                  value={formValues.clientAddress.street}
                  onChange={(event) =>
                    updateAddressField(
                      "clientAddress",
                      "street",
                      event.target.value,
                    )
                  }
                />
              </div>

              <div className="invoice-form__row invoice-form__row--triple">
                <div className="invoice-form__field">
                  <label htmlFor="clientCity">City</label>
                  <input
                    id="clientCity"
                    value={formValues.clientAddress.city}
                    onChange={(event) =>
                      updateAddressField(
                        "clientAddress",
                        "city",
                        event.target.value,
                      )
                    }
                  />
                </div>

                <div className="invoice-form__field">
                  <label htmlFor="clientPostCode">Post Code</label>
                  <input
                    id="clientPostCode"
                    value={formValues.clientAddress.postCode}
                    onChange={(event) =>
                      updateAddressField(
                        "clientAddress",
                        "postCode",
                        event.target.value,
                      )
                    }
                  />
                </div>

                <div className="invoice-form__field">
                  <label htmlFor="clientCountry">Country</label>
                  <input
                    id="clientCountry"
                    value={formValues.clientAddress.country}
                    onChange={(event) =>
                      updateAddressField(
                        "clientAddress",
                        "country",
                        event.target.value,
                      )
                    }
                  />
                </div>
              </div>

              <div className="invoice-form__row invoice-form__row--double">
                <div className="invoice-form__field">
                  <label htmlFor="invoiceDate">Invoice Date</label>
                  <input
                    id="invoiceDate"
                    type="date"
                    value={formValues.createdAt}
                    onChange={(event) =>
                      updateField("createdAt", event.target.value)
                    }
                  />
                </div>

                <div className="invoice-form__field">
                  <label htmlFor="paymentTerms">Payment Terms</label>
                  <select
                    id="paymentTerms"
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
                  value={formValues.description}
                  onChange={(event) =>
                    updateField("description", event.target.value)
                  }
                />
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

                {formValues.items.map((item) => (
                  <div className="invoice-items__row" key={item.id}>
                    <input
                      value={item.name}
                      onChange={(event) =>
                        updateItemField(item.id, "name", event.target.value)
                      }
                    />
                    <input
                      type="number"
                      min="1"
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
                ))}
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
