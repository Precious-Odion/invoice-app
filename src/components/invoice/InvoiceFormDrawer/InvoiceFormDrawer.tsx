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
  paymentTerms?: string;
  senderStreet?: string;
  senderCity?: string;
  senderPostCode?: string;
  senderCountry?: string;
  clientStreet?: string;
  clientCity?: string;
  clientPostCode?: string;
  clientCountry?: string;
  items?: string;
  summary?: string;
}

function createEmptyItem(): InvoiceItem {
  return {
    id: globalThis.crypto?.randomUUID?.() ?? `${Date.now()}-${Math.random()}`,
    name: "",
    quantity: 0,
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

function isValidName(value: string) {
  return /^[A-Za-z]+(?:[A-Za-z\s'-]*[A-Za-z])?$/.test(value.trim());
}

function isValidCityOrCountry(value: string) {
  return /^[A-Za-z]+(?:[A-Za-z\s'-]*[A-Za-z])?$/.test(value.trim());
}

function isValidStreet(value: string) {
  return /^[A-Za-z0-9\s,.'#/-]+$/.test(value.trim());
}

function isValidDescription(value: string) {
  return /^[A-Za-z0-9\s,.'&()/-]+$/.test(value.trim());
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

  const closeDrawer = () => {
    if (isEdit && invoice) {
      navigate(`/invoice/${invoice.id}`);
      return;
    }

    navigate("/");
  };

  const [formValues, setFormValues] =
    useState<InvoiceFormValues>(initialValues);
  const [errors, setErrors] = useState<FormErrors>({});
  const formRef = useRef<HTMLFormElement>(null);

  const isEdit = mode === "edit";

  if (isEdit && !invoice) {
    return (
      <section className="invoice-drawer" onClick={closeDrawer}>
        <div
          className="invoice-drawer__panel"
          onClick={(event) => event.stopPropagation()}
        >
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

  const isItemInvalid = (item: InvoiceItem) => {
    return (
      !item.name.trim() || Number(item.quantity) <= 0 || Number(item.price) <= 0
    );
  };

  const updateField = <K extends keyof InvoiceFormValues>(
    key: K,
    value: InvoiceFormValues[K],
  ) => {
    setFormValues((current) => ({
      ...current,
      [key]: value,
    }));

    setErrors((current) => ({
      ...current,
      [key]: undefined,
      summary: undefined,
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

    const errorKeyMap = {
      senderAddress: {
        street: "senderStreet",
        city: "senderCity",
        postCode: "senderPostCode",
        country: "senderCountry",
      },
      clientAddress: {
        street: "clientStreet",
        city: "clientCity",
        postCode: "clientPostCode",
        country: "clientCountry",
      },
    } as const;

    const errorKey = errorKeyMap[section][field] as keyof FormErrors;

    setErrors((current) => ({
      ...current,
      [errorKey]: undefined,
      summary: undefined,
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

    setErrors((current) => ({
      ...current,
      items: undefined,
      summary: undefined,
    }));
  };

  const addItem = () => {
    setFormValues((current) => ({
      ...current,
      items: [...current.items, createEmptyItem()],
    }));

    setErrors((current) => ({
      ...current,
      items: undefined,
      summary: undefined,
    }));
  };

  const removeItem = (itemId: string) => {
    setFormValues((current) => ({
      ...current,
      items: current.items.filter((item) => item.id !== itemId),
    }));

    setErrors((current) => ({
      ...current,
      items: undefined,
      summary: undefined,
    }));
  };

  const validateSingleField = (field: keyof FormErrors) => {
    let errorMessage = "";

    switch (field) {
      case "clientName":
        if (!formValues.clientName.trim()) {
          errorMessage = "Client's name can't be empty";
        } else if (!isValidName(formValues.clientName)) {
          errorMessage = "Client's name contains invalid characters";
        }
        break;

      case "clientEmail":
        if (!formValues.clientEmail.trim()) {
          errorMessage = "Client's email can't be empty";
        } else if (!isValidEmail(formValues.clientEmail)) {
          errorMessage = "Invalid email format";
        }
        break;

      case "description":
        if (!formValues.description.trim()) {
          errorMessage = "Project description can't be empty";
        } else if (!isValidDescription(formValues.description)) {
          errorMessage = "Project description contains invalid characters";
        }
        break;

      case "createdAt":
        if (!formValues.createdAt.trim()) {
          errorMessage = "Invoice date can't be empty";
        }
        break;

      case "paymentTerms":
        if (![1, 7, 14, 30].includes(formValues.paymentTerms)) {
          errorMessage = "Select a valid payment term";
        }
        break;

      case "senderStreet":
        if (!formValues.senderAddress.street.trim()) {
          errorMessage = "Sender street can't be empty";
        } else if (!isValidStreet(formValues.senderAddress.street)) {
          errorMessage = "Sender street contains invalid characters";
        }
        break;

      case "senderCity":
        if (!formValues.senderAddress.city.trim()) {
          errorMessage = "Sender city can't be empty";
        } else if (!isValidCityOrCountry(formValues.senderAddress.city)) {
          errorMessage = "Sender city contains invalid characters";
        }
        break;

      case "senderPostCode":
        if (!formValues.senderAddress.postCode.trim()) {
          errorMessage = "Sender post code can't be empty";
        }
        break;

      case "senderCountry":
        if (!formValues.senderAddress.country.trim()) {
          errorMessage = "Sender country can't be empty";
        } else if (!isValidCityOrCountry(formValues.senderAddress.country)) {
          errorMessage = "Sender country contains invalid characters";
        }
        break;

      case "clientStreet":
        if (!formValues.clientAddress.street.trim()) {
          errorMessage = "Client street can't be empty";
        } else if (!isValidStreet(formValues.clientAddress.street)) {
          errorMessage = "Client street contains invalid characters";
        }
        break;

      case "clientCity":
        if (!formValues.clientAddress.city.trim()) {
          errorMessage = "Client city can't be empty";
        } else if (!isValidCityOrCountry(formValues.clientAddress.city)) {
          errorMessage = "Client city contains invalid characters";
        }
        break;

      case "clientPostCode":
        if (!formValues.clientAddress.postCode.trim()) {
          errorMessage = "Client post code can't be empty";
        }
        break;

      case "clientCountry":
        if (!formValues.clientAddress.country.trim()) {
          errorMessage = "Client country can't be empty";
        } else if (!isValidCityOrCountry(formValues.clientAddress.country)) {
          errorMessage = "Client country contains invalid characters";
        }
        break;

      default:
        break;
    }

    setErrors((current) => ({
      ...current,
      [field]: errorMessage || undefined,
    }));
  };

  const validateDraftFields = () => {
    const nextErrors: FormErrors = {};

    if (formValues.clientName.trim() && !isValidName(formValues.clientName)) {
      nextErrors.clientName = "Client's name contains invalid characters";
    }

    if (
      formValues.clientEmail.trim() &&
      !isValidEmail(formValues.clientEmail)
    ) {
      nextErrors.clientEmail = "Invalid email format";
    }

    if (
      formValues.description.trim() &&
      !isValidDescription(formValues.description)
    ) {
      nextErrors.description =
        "Project description contains invalid characters";
    }

    if (
      formValues.senderAddress.street.trim() &&
      !isValidStreet(formValues.senderAddress.street)
    ) {
      nextErrors.senderStreet = "Sender street contains invalid characters";
    }

    if (
      formValues.senderAddress.city.trim() &&
      !isValidCityOrCountry(formValues.senderAddress.city)
    ) {
      nextErrors.senderCity = "Sender city contains invalid characters";
    }

    if (
      formValues.senderAddress.country.trim() &&
      !isValidCityOrCountry(formValues.senderAddress.country)
    ) {
      nextErrors.senderCountry = "Sender country contains invalid characters";
    }

    if (
      formValues.clientAddress.street.trim() &&
      !isValidStreet(formValues.clientAddress.street)
    ) {
      nextErrors.clientStreet = "Client street contains invalid characters";
    }

    if (
      formValues.clientAddress.city.trim() &&
      !isValidCityOrCountry(formValues.clientAddress.city)
    ) {
      nextErrors.clientCity = "Client city contains invalid characters";
    }

    if (
      formValues.clientAddress.country.trim() &&
      !isValidCityOrCountry(formValues.clientAddress.country)
    ) {
      nextErrors.clientCountry = "Client country contains invalid characters";
    }

    const validItems = formValues.items.filter((item) => !isItemInvalid(item));
    const invalidItems = formValues.items.filter((item) => isItemInvalid(item));

    if (validItems.length === 0 && formValues.items.length > 0) {
      nextErrors.items = "At least one valid item must be added";
    } else if (invalidItems.length > 0) {
      nextErrors.items = "Some item rows are incomplete or invalid";
    }

    if (Object.keys(nextErrors).length > 0) {
      nextErrors.summary = "Please fix the highlighted fields before saving.";
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

  const isPendingFormValid = () => {
    const hasValidClientName =
      formValues.clientName.trim() && isValidName(formValues.clientName);

    const hasValidClientEmail =
      formValues.clientEmail.trim() && isValidEmail(formValues.clientEmail);

    const hasValidDescription =
      formValues.description.trim() &&
      isValidDescription(formValues.description);

    const hasValidCreatedAt = formValues.createdAt.trim();

    const hasValidPaymentTerms = [1, 7, 14, 30].includes(
      formValues.paymentTerms,
    );

    const hasValidSenderStreet =
      formValues.senderAddress.street.trim() &&
      isValidStreet(formValues.senderAddress.street);

    const hasValidSenderCity =
      formValues.senderAddress.city.trim() &&
      isValidCityOrCountry(formValues.senderAddress.city);

    const hasValidSenderPostCode = formValues.senderAddress.postCode.trim();

    const hasValidSenderCountry =
      formValues.senderAddress.country.trim() &&
      isValidCityOrCountry(formValues.senderAddress.country);

    const hasValidClientStreet =
      formValues.clientAddress.street.trim() &&
      isValidStreet(formValues.clientAddress.street);

    const hasValidClientCity =
      formValues.clientAddress.city.trim() &&
      isValidCityOrCountry(formValues.clientAddress.city);

    const hasValidClientPostCode = formValues.clientAddress.postCode.trim();

    const hasValidClientCountry =
      formValues.clientAddress.country.trim() &&
      isValidCityOrCountry(formValues.clientAddress.country);

    const validItems = formValues.items.filter((item) => !isItemInvalid(item));
    const invalidItems = formValues.items.filter((item) => isItemInvalid(item));

    return (
      Boolean(hasValidClientName) &&
      Boolean(hasValidClientEmail) &&
      Boolean(hasValidDescription) &&
      Boolean(hasValidCreatedAt) &&
      hasValidPaymentTerms &&
      Boolean(hasValidSenderStreet) &&
      Boolean(hasValidSenderCity) &&
      Boolean(hasValidSenderPostCode) &&
      Boolean(hasValidSenderCountry) &&
      Boolean(hasValidClientStreet) &&
      Boolean(hasValidClientCity) &&
      Boolean(hasValidClientPostCode) &&
      Boolean(hasValidClientCountry) &&
      validItems.length > 0 &&
      invalidItems.length === 0
    );
  };

  const validate = (status: "draft" | "pending") => {
    const nextErrors: FormErrors = {};

    if (status === "pending") {
      if (!formValues.clientName.trim()) {
        nextErrors.clientName = "Client's name can't be empty";
      } else if (!isValidName(formValues.clientName)) {
        nextErrors.clientName = "Client's name contains invalid characters";
      }

      if (!formValues.clientEmail.trim()) {
        nextErrors.clientEmail = "Client's email can't be empty";
      } else if (!isValidEmail(formValues.clientEmail)) {
        nextErrors.clientEmail = "Invalid email format";
      }

      if (!formValues.description.trim()) {
        nextErrors.description = "Project description can't be empty";
      } else if (!isValidDescription(formValues.description)) {
        nextErrors.description =
          "Project description contains invalid characters";
      }

      if (!formValues.createdAt.trim()) {
        nextErrors.createdAt = "Invoice date can't be empty";
      }

      if (![1, 7, 14, 30].includes(formValues.paymentTerms)) {
        nextErrors.paymentTerms = "Select a valid payment term";
      }

      if (!formValues.senderAddress.street.trim()) {
        nextErrors.senderStreet = "Sender street can't be empty";
      } else if (!isValidStreet(formValues.senderAddress.street)) {
        nextErrors.senderStreet = "Sender street contains invalid characters";
      }

      if (!formValues.senderAddress.city.trim()) {
        nextErrors.senderCity = "Sender city can't be empty";
      } else if (!isValidCityOrCountry(formValues.senderAddress.city)) {
        nextErrors.senderCity = "Sender city contains invalid characters";
      }

      if (!formValues.senderAddress.postCode.trim()) {
        nextErrors.senderPostCode = "Sender post code can't be empty";
      }

      if (!formValues.senderAddress.country.trim()) {
        nextErrors.senderCountry = "Sender country can't be empty";
      } else if (!isValidCityOrCountry(formValues.senderAddress.country)) {
        nextErrors.senderCountry = "Sender country contains invalid characters";
      }

      if (!formValues.clientAddress.street.trim()) {
        nextErrors.clientStreet = "Client street can't be empty";
      } else if (!isValidStreet(formValues.clientAddress.street)) {
        nextErrors.clientStreet = "Client street contains invalid characters";
      }

      if (!formValues.clientAddress.city.trim()) {
        nextErrors.clientCity = "Client city can't be empty";
      } else if (!isValidCityOrCountry(formValues.clientAddress.city)) {
        nextErrors.clientCity = "Client city contains invalid characters";
      }

      if (!formValues.clientAddress.postCode.trim()) {
        nextErrors.clientPostCode = "Client post code can't be empty";
      }

      if (!formValues.clientAddress.country.trim()) {
        nextErrors.clientCountry = "Client country can't be empty";
      } else if (!isValidCityOrCountry(formValues.clientAddress.country)) {
        nextErrors.clientCountry = "Client country contains invalid characters";
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

    if (Object.keys(nextErrors).length > 0) {
      nextErrors.summary = "Please fix the highlighted fields before saving.";
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
    const isValid =
      status === "draft" ? validateDraftFields() : validate(status);

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

  const isPendingSubmitDisabled = !isPendingFormValid();

  return (
    <section className="invoice-drawer" onClick={closeDrawer}>
      <div
        className="invoice-drawer__panel"
        onClick={(event) => event.stopPropagation()}
      >
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
                <label
                  htmlFor="senderStreet"
                  className={
                    errors.senderStreet ? "invoice-form__label--error" : ""
                  }
                >
                  Street Address
                </label>
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
                  onBlur={() => validateSingleField("senderStreet")}
                />
                {errors.senderStreet ? (
                  <p className="invoice-form__error">{errors.senderStreet}</p>
                ) : null}
              </div>

              <div className="invoice-form__row invoice-form__row--triple">
                <div className="invoice-form__field">
                  <label
                    htmlFor="senderCity"
                    className={
                      errors.senderCity ? "invoice-form__label--error" : ""
                    }
                  >
                    City
                  </label>
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
                    onBlur={() => validateSingleField("senderCity")}
                  />
                  {errors.senderCity ? (
                    <p className="invoice-form__error">{errors.senderCity}</p>
                  ) : null}
                </div>

                <div className="invoice-form__field">
                  <label
                    htmlFor="senderPostCode"
                    className={
                      errors.senderPostCode ? "invoice-form__label--error" : ""
                    }
                  >
                    Post Code
                  </label>
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
                    onBlur={() => validateSingleField("senderPostCode")}
                  />
                  {errors.senderPostCode ? (
                    <p className="invoice-form__error">
                      {errors.senderPostCode}
                    </p>
                  ) : null}
                </div>

                <div className="invoice-form__field">
                  <label
                    htmlFor="senderCountry"
                    className={
                      errors.senderCountry ? "invoice-form__label--error" : ""
                    }
                  >
                    Country
                  </label>
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
                    onBlur={() => validateSingleField("senderCountry")}
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
                <label
                  htmlFor="clientName"
                  className={
                    errors.clientName ? "invoice-form__label--error" : ""
                  }
                >
                  Client&apos;s Name
                </label>
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
                  onBlur={() => validateSingleField("clientName")}
                />
                {errors.clientName ? (
                  <p className="invoice-form__error">{errors.clientName}</p>
                ) : null}
              </div>

              <div className="invoice-form__field invoice-form__field--full">
                <label
                  htmlFor="clientEmail"
                  className={
                    errors.clientEmail ? "invoice-form__label--error" : ""
                  }
                >
                  Client&apos;s Email
                </label>
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
                  onBlur={() => validateSingleField("clientEmail")}
                />
                {errors.clientEmail ? (
                  <p className="invoice-form__error">{errors.clientEmail}</p>
                ) : null}
              </div>

              <div className="invoice-form__field invoice-form__field--full">
                <label
                  htmlFor="clientStreet"
                  className={
                    errors.clientStreet ? "invoice-form__label--error" : ""
                  }
                >
                  Street Address
                </label>
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
                  onBlur={() => validateSingleField("clientStreet")}
                />
                {errors.clientStreet ? (
                  <p className="invoice-form__error">{errors.clientStreet}</p>
                ) : null}
              </div>

              <div className="invoice-form__row invoice-form__row--triple">
                <div className="invoice-form__field">
                  <label
                    htmlFor="clientCity"
                    className={
                      errors.clientCity ? "invoice-form__label--error" : ""
                    }
                  >
                    City
                  </label>
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
                    onBlur={() => validateSingleField("clientCity")}
                  />
                  {errors.clientCity ? (
                    <p className="invoice-form__error">{errors.clientCity}</p>
                  ) : null}
                </div>

                <div className="invoice-form__field">
                  <label
                    htmlFor="clientPostCode"
                    className={
                      errors.clientPostCode ? "invoice-form__label--error" : ""
                    }
                  >
                    Post Code
                  </label>
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
                    onBlur={() => validateSingleField("clientPostCode")}
                  />
                  {errors.clientPostCode ? (
                    <p className="invoice-form__error">
                      {errors.clientPostCode}
                    </p>
                  ) : null}
                </div>

                <div className="invoice-form__field">
                  <label
                    htmlFor="clientCountry"
                    className={
                      errors.clientCountry ? "invoice-form__label--error" : ""
                    }
                  >
                    Country
                  </label>
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
                    onBlur={() => validateSingleField("clientCountry")}
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
                  <label
                    htmlFor="invoiceDate"
                    className={
                      errors.createdAt ? "invoice-form__label--error" : ""
                    }
                  >
                    Invoice Date
                  </label>
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
                    onBlur={() => validateSingleField("createdAt")}
                  />
                  {errors.createdAt ? (
                    <p className="invoice-form__error">{errors.createdAt}</p>
                  ) : null}
                </div>

                <div className="invoice-form__field">
                  <label
                    htmlFor="paymentTerms"
                    className={
                      errors.paymentTerms ? "invoice-form__label--error" : ""
                    }
                  >
                    Payment Terms
                  </label>
                  <select
                    id="paymentTerms"
                    className={
                      errors.paymentTerms ? "invoice-form__input--error" : ""
                    }
                    value={formValues.paymentTerms}
                    onChange={(event) =>
                      updateField("paymentTerms", Number(event.target.value))
                    }
                    onBlur={() => validateSingleField("paymentTerms")}
                  >
                    <option value={1}>Net 1 Day</option>
                    <option value={7}>Net 7 Days</option>
                    <option value={14}>Net 14 Days</option>
                    <option value={30}>Net 30 Days</option>
                  </select>
                  {errors.paymentTerms ? (
                    <p className="invoice-form__error">{errors.paymentTerms}</p>
                  ) : null}
                </div>
              </div>

              <div className="invoice-form__field invoice-form__field--full">
                <label
                  htmlFor="projectDescription"
                  className={
                    errors.description ? "invoice-form__label--error" : ""
                  }
                >
                  Project Description
                </label>
                <input
                  id="projectDescription"
                  placeholder="e.g. Graphic Design Service"
                  className={
                    errors.description ? "invoice-form__input--error" : ""
                  }
                  value={formValues.description}
                  onChange={(event) =>
                    updateField("description", event.target.value)
                  }
                  onBlur={() => validateSingleField("description")}
                />
                {errors.description ? (
                  <p className="invoice-form__error">{errors.description}</p>
                ) : null}
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

                {formValues.items.map((item) => {
                  const nameHasError =
                    Boolean(errors.items) && !item.name.trim();
                  const quantityHasError =
                    Boolean(errors.items) && Number(item.quantity) <= 0;
                  const priceHasError =
                    Boolean(errors.items) && Number(item.price) <= 0;

                  return (
                    <div className="invoice-items__row" key={item.id}>
                      <input
                        placeholder="Item name"
                        className={
                          nameHasError ? "invoice-form__input--error" : ""
                        }
                        value={item.name}
                        onChange={(event) =>
                          updateItemField(item.id, "name", event.target.value)
                        }
                      />
                      <input
                        type="number"
                        min="1"
                        placeholder="0"
                        className={
                          quantityHasError ? "invoice-form__input--error" : ""
                        }
                        value={item.quantity === 0 ? "" : item.quantity}
                        onChange={(event) =>
                          updateItemField(
                            item.id,
                            "quantity",
                            event.target.value === ""
                              ? 0
                              : Number(event.target.value),
                          )
                        }
                      />
                      <input
                        type="number"
                        min="0"
                        step="0.01"
                        placeholder="0.00"
                        className={
                          priceHasError ? "invoice-form__input--error" : ""
                        }
                        value={item.price === 0 ? "" : String(item.price)}
                        onChange={(event) =>
                          updateItemField(
                            item.id,
                            "price",
                            event.target.value === ""
                              ? 0
                              : Number(event.target.value),
                          )
                        }
                      />
                      <p>{item.total.toFixed(2)}</p>
                      <button
                        type="button"
                        className="invoice-items__delete"
                        onClick={() => removeItem(item.id)}
                        aria-label="Delete item"
                        title="Delete item"
                      >
                        <svg
                          className="invoice-items__delete-icon"
                          viewBox="0 0 24 24"
                          aria-hidden="true"
                        >
                          <path
                            d="M9 3h6l1 2h4v2H4V5h4l1-2Zm1 6h2v8h-2V9Zm4 0h2v8h-2V9ZM7 9h2v8H7V9Zm-1 12a2 2 0 0 1-2-2V7h16v12a2 2 0 0 1-2 2H6Z"
                            fill="currentColor"
                          />
                        </svg>
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

        {errors.summary ? (
          <div className="invoice-form__summary-error">{errors.summary}</div>
        ) : null}

        <footer className="invoice-drawer__footer">
          {isEdit ? (
            <>
              <Button variant="secondary" onClick={closeDrawer}>
                Cancel
              </Button>
              <Button
                variant="primary"
                disabled={
                  invoice?.status === "pending"
                    ? isPendingSubmitDisabled
                    : false
                }
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
              <Button variant="light" onClick={closeDrawer}>
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
                  disabled={isPendingSubmitDisabled}
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
