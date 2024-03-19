import { useState, useEffect, useRef } from "react";
import axiosClient from "../../auth/apiClient";
import { Button, Modal, Form, Spinner } from "react-bootstrap";
import { Formik } from "formik";
import * as Yup from "yup";
import { toast } from "react-toastify";
import { BsFillPrinterFill } from "react-icons/bs";

import {
  HeaderSection,
  SumSection,
  Table,
  FilterSection,
  FastFilterSection,
  DocumentsContainer,
  SubHeaderSection,
} from "./DocumentsStyles";
import { Content, LayoutContainer } from "../PagesStyles";
import Sidebar from "../../components/Sidebar/Sidebar";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
dayjs.extend(utc);
import "react-datepicker/dist/react-datepicker.css";
import DatePicker from "react-datepicker";
import ReactToPrint from "react-to-print";
import DocumentToPrint from "./DocumentToPrint";

const BranchesInfo = [
  {
    Id: 1,
    Name: "Dolac",
    Address: "Trg Marka Marulića 6",
  },
  {
    Id: 2,
    Name: "Milna",
    Address: "Milna",
  },
  {
    Id: 3,
    Name: "Kebab",
    Address: "Fabrika 6",
  },
];

interface DocumentType {
  Id: number;
  Date?: string;
  Title: string;
  Type: number;
  Value: string;
  User_Id?: number;
}

const documentSchema = Yup.object().shape({
  Title: Yup.string().required("Naziv je obavezan"),
  Value: Yup.string().required("Vrijednost je obavezna"),
});

const offsetInMinutes = new Date().getTimezoneOffset();
const offsetInHours = -offsetInMinutes / 60;
const formattedOffset = offsetInHours > 0 ? offsetInHours : `${offsetInHours}`;
// convert to number
const offset = +formattedOffset;

const Documents = () => {
  const [documents, setDocuments] = useState<DocumentType[]>([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editDocument, setEditDocument] = useState<DocumentType | null>(null);
  const [startDate, setStartDate] = useState<Date | null>(new Date());
  const [endDate, setEndDate] = useState<Date | null>(new Date());
  const [activeFilter, setActiveFilter] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [branchNumber, setBranchNumber] = useState<number | null>(null);
  const [documentToDelete, setDocumentToDelete] = useState<DocumentType | null>(
    null
  );

  const printComponentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setBranchNumber(
      Number(window?.localStorage.getItem("chosenCurrentUserRole"))
    );
  }, []);

  const getDocuments = async (start?: string, end?: string) => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      const startParam =
        start || dayjs(startDate).add(1, "hour").utc().format("YYYY-MM-DD"); // Added 1 hour to the start date because of the UTC +1 timezone
      const endParam =
        end || dayjs(endDate).add(1, "hour").utc().format("YYYY-MM-DD"); // Added 1 hour to the end date because of the UTC +1 timezone
      if (startParam) params.append("startDate", startParam);
      if (endParam) params.append("endDate", endParam);

      const response = await axiosClient.get(
        `/api/documents?${params.toString()}`
      );
      setDocuments(response.data.documents);
    } catch (error) {
      console.error("Error fetching documents", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDateChange = (date: Date | null, dateType: "start" | "end") => {
    const formattedDate = date ? dayjs(date).utc().format("YYYY-MM-DD") : null;
    if (dateType === "start") {
      setStartDate(formattedDate ? new Date(formattedDate) : null);
    } else if (dateType === "end") {
      setEndDate(formattedDate ? new Date(formattedDate) : null);
    }
  };

  useEffect(() => {
    getDocuments();
  }, []);

  const openDeleteModal = (document: DocumentType) => {
    setDocumentToDelete(document);
    setShowDeleteModal(true);
  };

  const filterToday = () => {
    const startOfToday = dayjs()
      .startOf("day")
      .add(offset, "hour") // Added 1 hour
      .utc()
      .format("YYYY-MM-DD");
    const endOfToday = dayjs()
      .endOf("day")
      .add(offset, "hour") // Added 1 hour
      .utc()
      .format("YYYY-MM-DD");
    setStartDate(dayjs(startOfToday).toDate());
    setEndDate(dayjs(endOfToday).toDate());
    getDocuments(startOfToday, endOfToday);
    setActiveFilter("today");
  };

  const filterYesterday = () => {
    const startOfYesterday = dayjs()
      .subtract(1, "day")
      .startOf("day")
      .add(offset, "hour") // Added 1 hour
      .utc()
      .format("YYYY-MM-DD");
    const endOfYesterday = dayjs()
      .subtract(1, "day")
      .endOf("day")
      .add(offset, "hour") // Added 1 hour
      .utc()
      .format("YYYY-MM-DD");
    setStartDate(dayjs(startOfYesterday).toDate());
    setEndDate(dayjs(endOfYesterday).toDate());
    getDocuments(startOfYesterday, endOfYesterday);
    setActiveFilter("yesterday");
  };

  const filterThisWeek = () => {
    const startOfWeek =
      dayjs().day() === 0
        ? dayjs().subtract(6, "days").startOf("day")
        : dayjs()
            .subtract(dayjs().day() - 1, "days")
            .startOf("day");

    const endOfWeek = startOfWeek.add(6, "days").endOf("day");

    setStartDate(startOfWeek.add(offset, "hour").utc().toDate());
    setEndDate(endOfWeek.add(offset, "hour").utc().toDate());
    getDocuments(
      startOfWeek.add(offset, "hour").utc().format("YYYY-MM-DD"),
      endOfWeek.add(offset, "hour").utc().format("YYYY-MM-DD")
    );
    setActiveFilter("thisWeek");
  };

  const filterLastWeek = () => {
    const startOfLastWeek =
      dayjs().day() === 0
        ? dayjs().subtract(13, "days").startOf("day")
        : dayjs()
            .subtract(dayjs().day() + 6, "days")
            .startOf("day");

    const endOfLastWeek = startOfLastWeek.add(6, "days").endOf("day");

    setStartDate(startOfLastWeek.add(offset, "hour").utc().toDate());
    setEndDate(endOfLastWeek.add(offset, "hour").utc().toDate());
    getDocuments(
      startOfLastWeek.add(offset, "hour").utc().format("YYYY-MM-DD"),
      endOfLastWeek.add(offset, "hour").utc().format("YYYY-MM-DD")
    );
    setActiveFilter("lastWeek");
  };

  const filterThisMonth = () => {
    const startOfMonth = dayjs()
      .startOf("month")
      .add(offset, "hour")
      .utc()
      .format("YYYY-MM-DD"); // Added 1 hour
    const endOfMonth = dayjs()
      .endOf("month")
      .add(offset, "hour") // Added 1 hour
      .utc()
      .format("YYYY-MM-DD");
    setStartDate(dayjs(startOfMonth).toDate());
    setEndDate(dayjs(endOfMonth).toDate());
    getDocuments(startOfMonth, endOfMonth);
    setActiveFilter("thisMonth");
  };

  const filterLastMonth = () => {
    const startOfLastMonth = dayjs()
      .subtract(1, "month")
      .startOf("month")
      .add(offset, "hour") // Added 1 hour
      .utc()
      .format("YYYY-MM-DD");
    const endOfLastMonth = dayjs()
      .subtract(1, "month")
      .endOf("month")
      .add(offset, "hour") // Added 1 hour
      .utc()
      .format("YYYY-MM-DD");
    setStartDate(dayjs(startOfLastMonth).toDate());
    setEndDate(dayjs(endOfLastMonth).toDate());
    getDocuments(startOfLastMonth, endOfLastMonth);
    setActiveFilter("lastMonth");
  };

  const filterThisYear = () => {
    const startOfThisYear = dayjs()
      .startOf("year")
      .add(offset, "hour")
      .utc()
      .format("YYYY-MM-DD"); // Added 1 hour
    const endOfThisYear = dayjs()
      .endOf("year")
      .add(offset, "hour") // Added 1 hour
      .utc()
      .format("YYYY-MM-DD");
    setStartDate(dayjs(startOfThisYear).toDate());
    setEndDate(dayjs(endOfThisYear).toDate());
    getDocuments(startOfThisYear, endOfThisYear);
    setActiveFilter("thisYear");
  };

  const handleAddDocument = async (values: DocumentType) => {
    const userId = JSON.parse(localStorage.getItem("currentUserId") || "{}");
    values.User_Id = userId;
    try {
      await axiosClient.post("/api/documents", values);
      toast.success("Dokument je uspješno kreiran!");
      getDocuments();
      setShowAddModal(false);
    } catch (error) {
      console.error("Error adding document", error);
    }
  };

  const handleUpdateDocument = async (values: DocumentType) => {
    if (!editDocument) return;

    let updateValues = { ...values };

    const originalDate = dayjs(editDocument.Date).format("YYYY-MM-DD");
    const selectedDate = dayjs(values.Date).format("YYYY-MM-DD");

    if (originalDate === selectedDate) {
      delete updateValues.Date;
    }

    try {
      await axiosClient.put(`/api/documents/${editDocument.Id}`, updateValues);
      toast.success("Dokument je uspješno uređen!");
      getDocuments();
      setShowEditModal(false);
    } catch (error) {
      console.error("Error updating document", error);
    }
  };

  const handleDelete = async () => {
    if (!documentToDelete) return;

    try {
      await axiosClient.delete(`/api/documents/${documentToDelete.Id}`);
      toast.success("Dokument je uspješno obrisan!");
      getDocuments();
    } catch (error) {
      console.error("Error deleting document", error);
    } finally {
      setShowDeleteModal(false);
      setDocumentToDelete(null); // Reset the document to delete
    }
  };

  const openEditModal = (document: DocumentType) => {
    setEditDocument(document);
    setShowEditModal(true);
  };

  const total = documents.reduce((acc, doc) => {
    const value = parseFloat(doc.Value) || 0;
    if (doc.Type === 1) {
      return acc + value;
    } else if (doc.Type === 2) {
      return acc - value;
    }
    return acc;
  }, 0);

  const zaduzenjaTotal = documents.reduce((acc, doc) => {
    const value = parseFloat(doc.Value) || 0;
    if (doc.Type === 1) {
      return acc + value;
    }
    return acc;
  }, 0);

  const razduzenjaTotal = documents.reduce((acc, doc) => {
    const value = parseFloat(doc.Value) || 0;
    if (doc.Type === 2) {
      return acc + value;
    }
    return acc;
  }, 0);

  const printComponent = (
    <div style={{ display: "none" }}>
      <DocumentToPrint
        ref={printComponentRef}
        branch={
          branchNumber
            ? `${BranchesInfo[branchNumber - 1].Name}, ${
                BranchesInfo[branchNumber - 1].Address
              }`
            : ""
        }
        documents={documents}
        total={total}
        startDate={startDate}
        endDate={endDate}
        today={new Date()}
      />
    </div>
  );

  return (
    <LayoutContainer>
      <Sidebar />
      <Content>
        <DocumentsContainer>
          {loading ? (
            <div className="d-flex justify-content-center">
              <Spinner animation="border" role="status">
                <span className="visually-hidden">Loading...</span>
              </Spinner>
            </div>
          ) : (
            <>
              <HeaderSection>
                <SubHeaderSection>
                  <h2>Knjiga popisa o nabavi i prodaji robe</h2>

                  <span>
                    <strong>Poslovnica: </strong>
                    {branchNumber && BranchesInfo[branchNumber - 1].Name
                      ? `${BranchesInfo[branchNumber - 1].Name}, ${
                          BranchesInfo[branchNumber - 1].Address
                        }`
                      : "N/A"}
                  </span>
                  <ReactToPrint
                    trigger={() => (
                      <div className="print">
                        <BsFillPrinterFill />
                      </div>
                    )}
                    content={() => printComponentRef.current || null}
                  />
                </SubHeaderSection>
                <Button
                  variant="primary"
                  style={{ marginBottom: "20px" }}
                  onClick={() => setShowAddModal(true)}
                >
                  Dodaj novi
                </Button>
              </HeaderSection>

              <FilterSection>
                <div>
                  <strong>Današnji datum: &nbsp;</strong>
                  {dayjs().format("DD.MM.YYYY.")}
                </div>
                <div>
                  <DatePicker
                    selected={startDate}
                    onChange={(date: Date) => handleDateChange(date, "start")}
                    dateFormat="dd.MM.yyyy"
                    className="form-control"
                  />

                  <DatePicker
                    selected={endDate}
                    onChange={(date: Date) => handleDateChange(date, "end")}
                    dateFormat="dd.MM.yyyy"
                    className="form-control"
                  />
                  <Button
                    onClick={() => {
                      getDocuments();
                      setActiveFilter("custom");
                    }}
                    variant={
                      activeFilter === "custom" ? "success" : "secondary"
                    }
                  >
                    Filtiraj
                  </Button>
                </div>
                {/* Display the total */}
              </FilterSection>

              <SumSection>
                <div>
                  <span className="total">
                    <strong>Ukupno: </strong>
                    {total.toFixed(2) + "€"}{" "}
                  </span>
                </div>
                <FastFilterSection>
                  <Button
                    onClick={filterToday}
                    variant={activeFilter === "today" ? "success" : "secondary"}
                  >
                    Danas
                  </Button>
                  <Button
                    onClick={filterYesterday}
                    variant={
                      activeFilter === "yesterday" ? "success" : "secondary"
                    }
                  >
                    Jučer
                  </Button>
                  <Button
                    onClick={filterThisWeek}
                    variant={
                      activeFilter === "thisWeek" ? "success" : "secondary"
                    }
                  >
                    Ovaj Tjedan
                  </Button>
                  <Button
                    onClick={filterLastWeek}
                    variant={
                      activeFilter === "lastWeek" ? "success" : "secondary"
                    }
                  >
                    Prošli Tjedan
                  </Button>
                  <Button
                    onClick={filterThisMonth}
                    variant={
                      activeFilter === "thisMonth" ? "success" : "secondary"
                    }
                  >
                    Ovaj Mjesec
                  </Button>
                  <Button
                    onClick={filterLastMonth}
                    variant={
                      activeFilter === "lastMonth" ? "success" : "secondary"
                    }
                  >
                    Prošli Mjesec
                  </Button>
                  <Button
                    onClick={filterThisYear}
                    variant={
                      activeFilter === "thisYear" ? "success" : "secondary"
                    }
                  >
                    Ova Godina
                  </Button>
                </FastFilterSection>
              </SumSection>

              <SumSection>
                <div className="otherTotal">
                  <span>
                    <strong>Zaduženja: </strong>
                    {zaduzenjaTotal.toFixed(2) + "€"}{" "}
                  </span>
                  <span>
                    <strong>Razduženja: </strong>
                    {razduzenjaTotal.toFixed(2) + "€"}{" "}
                  </span>
                </div>
              </SumSection>
              <Table className="table">
                <thead>
                  <tr>
                    <th>Red br.</th>
                    <th>Datum upisa isprave</th>
                    <th>Naziv i broj isprave</th>
                    <th>Zaduženje [€]</th>
                    <th>Razduženje [€]</th>
                    <th>Uredi</th>
                    <th>Obriši</th>
                  </tr>
                </thead>
                <tbody>
                  {documents.map((doc: DocumentType) => (
                    <tr key={doc.Id}>
                      <td>{doc.Id}</td>
                      <td>{dayjs(doc.Date).format("DD.MM.YYYY.")}</td>
                      <td>{doc.Title}</td>
                      <td>{doc.Type === 1 ? doc.Value : ""}</td>
                      <td>{doc.Type === 2 ? doc.Value : ""}</td>
                      <td>
                        <Button
                          variant="warning"
                          onClick={() => openEditModal(doc)}
                        >
                          Uredi
                        </Button>
                      </td>
                      <td>
                        <Button
                          onClick={() => openDeleteModal(doc)}
                          variant="danger"
                        >
                          Obriši
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>

              <Modal
                show={showDeleteModal}
                onHide={() => setShowDeleteModal(false)}
              >
                <Modal.Header closeButton>
                  <Modal.Title>Potvrda brisanja</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                  Jeste li sigurni da želite obrisati dokument?
                </Modal.Body>
                <Modal.Footer>
                  <Button
                    variant="secondary"
                    onClick={() => setShowDeleteModal(false)}
                  >
                    Odustani
                  </Button>
                  <Button variant="danger" onClick={handleDelete}>
                    Obriši
                  </Button>
                </Modal.Footer>
              </Modal>

              <Modal show={showAddModal} onHide={() => setShowAddModal(false)}>
                <Modal.Header closeButton>
                  <Modal.Title>Add Document</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                  <Formik
                    initialValues={{
                      Id: 0,
                      Date: dayjs(new Date()).format("YYYY-MM-DD"),
                      Title: "",
                      Type: 1,
                      Value: "",
                    }}
                    validationSchema={documentSchema}
                    onSubmit={(values, { setSubmitting }) => {
                      handleAddDocument(values);
                      setSubmitting(false);
                    }}
                  >
                    {({
                      handleSubmit,
                      handleChange,
                      values,
                      touched,
                      errors,
                      setFieldValue,
                    }) => (
                      <Form noValidate onSubmit={handleSubmit}>
                        <Form.Group className="mb-3" controlId="formTitle">
                          <Form.Label>Naziv</Form.Label>
                          <Form.Control
                            type="text"
                            name="Title"
                            value={values.Title}
                            onChange={handleChange}
                            isValid={touched.Title && !errors.Title}
                            isInvalid={!!errors.Title}
                          />
                          <Form.Control.Feedback type="invalid">
                            {errors.Title}
                          </Form.Control.Feedback>
                        </Form.Group>
                        <Form.Group className="mb-3" controlId="formDate">
                          <Form.Label className="d-block">Datum</Form.Label>
                          <DatePicker
                            selected={
                              values.Date ? new Date(values.Date) : null
                            }
                            dateFormat="dd.MM.yyyy."
                            onChange={(date: Date) =>
                              setFieldValue(
                                "Date",
                                dayjs(date).format("YYYY-MM-DD")
                              )
                            }
                            className="form-control"
                          />
                          {touched.Date && errors.Date ? (
                            <div className="invalid-feedback d-block">
                              {errors.Date}
                            </div>
                          ) : null}
                        </Form.Group>
                        <Form.Group className="mb-3" controlId="formType">
                          <Form.Label>Vrsta</Form.Label>
                          <Form.Control
                            as="select"
                            name="Type"
                            value={values.Type}
                            onChange={handleChange}
                            isValid={touched.Type && !errors.Type}
                            isInvalid={!!errors.Type}
                          >
                            <option value="1">Zaduženje</option>
                            <option value="2">Razduženje</option>
                          </Form.Control>
                          <Form.Control.Feedback type="invalid">
                            {errors.Type}
                          </Form.Control.Feedback>
                        </Form.Group>
                        <Form.Group className="mb-3" controlId="formValue">
                          <Form.Label>Vrijednost</Form.Label>
                          <Form.Control
                            type="text"
                            name="Value"
                            value={values.Value}
                            onChange={(e) => {
                              const value = e.target.value.replace(",", ".");
                              setFieldValue("Value", value);
                            }}
                            isValid={touched.Value && !errors.Value}
                            isInvalid={!!errors.Value}
                          />
                          <Form.Control.Feedback type="invalid">
                            {errors.Value}
                          </Form.Control.Feedback>
                        </Form.Group>
                        <Button
                          className="mt-3"
                          variant="primary"
                          type="submit"
                        >
                          Submit
                        </Button>
                      </Form>
                    )}
                  </Formik>
                </Modal.Body>
              </Modal>

              <Modal
                show={showEditModal}
                onHide={() => setShowEditModal(false)}
              >
                <Modal.Header closeButton>
                  <Modal.Title>Edit Document</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                  {editDocument && (
                    <Formik
                      initialValues={editDocument}
                      validationSchema={documentSchema}
                      onSubmit={(values, { setSubmitting }) => {
                        handleUpdateDocument(values);
                        setSubmitting(false);
                      }}
                    >
                      {({
                        handleSubmit,
                        handleChange,
                        values,
                        touched,
                        errors,
                        setFieldValue,
                      }) => (
                        <Form noValidate onSubmit={handleSubmit}>
                          <Form.Group
                            className="mb-3"
                            controlId="formEditTitle"
                          >
                            <Form.Label>Title</Form.Label>
                            <Form.Control
                              type="text"
                              name="Title"
                              value={values.Title}
                              onChange={handleChange}
                              isValid={touched.Title && !errors.Title}
                              isInvalid={!!errors.Title}
                            />
                            <Form.Control.Feedback type="invalid">
                              {errors.Title}
                            </Form.Control.Feedback>
                          </Form.Group>
                          <Form.Group
                            className="mb-3 "
                            controlId="formEditDate"
                          >
                            <Form.Label className="d-block">Date</Form.Label>
                            <DatePicker
                              selected={
                                values.Date ? new Date(values.Date) : null
                              }
                              dateFormat="dd.MM.yyyy."
                              onChange={(date: Date) =>
                                setFieldValue(
                                  "Date",
                                  dayjs(date).format("YYYY-MM-DD")
                                )
                              }
                              className="form-control"
                            />
                            {touched.Date && errors.Date ? (
                              <div className="invalid-feedback d-block">
                                {errors.Date}
                              </div>
                            ) : null}
                          </Form.Group>
                          <Form.Group className="mb-3" controlId="formEditType">
                            <Form.Label>Type</Form.Label>
                            <Form.Control
                              as="select"
                              name="Type"
                              value={values.Type}
                              onChange={handleChange}
                              isValid={touched.Type && !errors.Type}
                              isInvalid={!!errors.Type}
                            >
                              <option value="1">Zaduženje</option>
                              <option value="2">Razduženje</option>
                            </Form.Control>
                            <Form.Control.Feedback type="invalid">
                              {errors.Type}
                            </Form.Control.Feedback>
                          </Form.Group>
                          <Form.Group
                            className="mb-3"
                            controlId="formEditValue"
                          >
                            <Form.Label>Value</Form.Label>
                            <Form.Control
                              type="text"
                              name="Value"
                              value={values.Value}
                              onChange={(e) => {
                                const value = e.target.value.replace(",", ".");
                                setFieldValue("Value", value);
                              }}
                              isValid={touched.Value && !errors.Value}
                              isInvalid={!!errors.Value}
                            />
                            <Form.Control.Feedback type="invalid">
                              {errors.Value}
                            </Form.Control.Feedback>
                          </Form.Group>
                          <Button
                            className="mt-3"
                            variant="primary"
                            type="submit"
                          >
                            Update
                          </Button>
                        </Form>
                      )}
                    </Formik>
                  )}
                </Modal.Body>
              </Modal>
            </>
          )}
        </DocumentsContainer>
      </Content>
      {printComponent}
    </LayoutContainer>
  );
};

export default Documents;
