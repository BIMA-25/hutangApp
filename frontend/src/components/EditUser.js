import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import ReactDatePicker from "react-datepicker";
import 'react-datepicker/dist/react-datepicker.css';
import { FaCalendarAlt } from 'react-icons/fa';
import { Row, Col, Form, Button } from "react-bootstrap";

const EditUser = () => {
  const [name, setName] = useState("");
  const [status, setStatus] = useState("berikan");
  const [transaksi, SetTransaksi] = useState("hutangbaru");
  const [nominal, setNominal] = useState();
  const [hutangUser, setHutangUser] = useState([]);
  const [bayarHutangUser, setBayarHutangUser] = useState([]);
  const [date, setDate] = useState(null);
  const [ket, setKet] = useState("");
  const [kembalian, setKembalian] = useState(0);

  const navigate = useNavigate();
  const { id } = useParams();

  // transaksi == "hutangbaru" ? console.log(transaksi) : console.log(transaksi)

  useEffect(() => {
    getUserById();
  }, []);

  const getUserById = async () => {
    const response = await axios.get(`http://localhost:5001/users/${id}`);
    setHutangUser(response.data.hutang)
    setBayarHutangUser(response.data.bayar)
    setName(response.data.name);
    setStatus(response.data.status);
    setNominal(response.data.nominal);
    setDate(response.data.date);
    setKet(response.data.ket);
    setKembalian(response.data.kembalian);
    console.log(response.data.kembalian);
    console.log(kembalian);

  };

  const updateUser = async (e) => {
    e.preventDefault();
    const transactionAmount = parseFloat(nominal); // Convert nominal to a float
    let remainingDebt = 0;
    let kembalianDebt = 0;

    // Calculate remaining debt based on transaction type
    if (transaksi === "hutangbaru") {
      remainingDebt = transactionAmount;
      kembalianDebt = -transactionAmount;
    } else if (transaksi === "bayarhutang") {
      remainingDebt = -transactionAmount;
    }

    // Update sisahutang in the database
    const updatedSisaHutang = (hutangUser.reduce((acc, curr) => acc + parseFloat(curr.hutang), 0) + remainingDebt) - (bayarHutangUser.reduce((acc, curr) => acc + parseFloat(curr.bayar), 0));
    const updatedKembalian = (kembalianDebt + kembalian) - updatedSisaHutang;

    console.log(updatedSisaHutang);

    const hutangSchema = {
      sisahutang: updatedSisaHutang <= 0 ? 0 : updatedSisaHutang,
      kembalian: updatedKembalian <0 ? 0 : updatedKembalian,
      hutang: [...hutangUser, {
        date: date,
        hutang: nominal,
        ket: ket ? ket : "tidak ada keterangan",
      }]
    }

    const bayarHutangSchema = {
      sisahutang: updatedSisaHutang <= 0 ?  0 : updatedSisaHutang,
      kembalian: updatedKembalian,
      bayar: [...bayarHutangUser, {
        bayar: nominal,
        date: date,
        ket: ket ? ket : "tidak ada keterangan",

      }]
    }

    // const kembalianSchema = {
    //   sisahutang: updatedSisaHutang < 0 ? 0 : updatedSisaHutang,
    //   kembalian: updatedSisaHutang < 0 ? Math.abs(updatedSisaHutang) : 0,
    //   // sisahutang: updatedSisaHutang < 0 ? 0 : updatedSisaHutang,
    //   // kembalian: updatedKembalian,
    //   bayar: [...bayarHutangUser, {
    //     bayar: nominal,
    //     date: date,
    //     ket: "dari kurangan kembalian"
    //   }]
    // }
    try {
      await axios.patch(`http://localhost:5001/users/${id}`, transaksi === "hutangbaru" ?
        hutangSchema
        : transaksi === "bayarhutang" ? bayarHutangSchema : hutangSchema
      );
      navigate("/");
    } catch (error) {
      console.log(error);
    }
  };

  const handleChange = date => {
    setDate(date);
  };

  return (
    <Row >
      <Col md={3}></Col>
      <Col md={6}>
        <Form onSubmit={updateUser} className="mt-3">
          <Form.Group as={Row} controlId="formName" className="m-1">
            <Form.Label column sm={4}>Nama</Form.Label>
            <Col sm={8}>
              <Form.Control
                readOnly
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Name"
              />
            </Col>
          </Form.Group>

          <Form.Group as={Row} controlId="formJenisTransaksi" className="m-1">
            <Form.Label column sm={4}>Jenis Transaksi</Form.Label>
            <Col sm={8}>
              <Form.Control
                as="select"
                value={status}
                onChange={(e) => SetTransaksi(e.target.value)}
                className="form-control" // Add form-control class
                style={{ appearance: "auto", borderRadius: "0" }} // Custom styling for appearance
              >
                <option value="hutangbaru">Berikan</option>
                <option value="bayarhutang">Terima</option>
              </Form.Control>
            </Col>
          </Form.Group>


          <Form.Group as={Row} controlId="formNominal" className="m-1">
            <Form.Label column sm={4}>Nominal</Form.Label>
            <Col sm={8}>
              <Form.Control
                type="text"
                value={nominal}
                onChange={(e) => {
                  // Filter out non-numeric characters
                  const input = e.target.value.replace(/\D/, '');
                  setNominal(input);
                }}
                onKeyPress={(e) => {
                  // Allow only numeric characters and specific keyboard keys (e.g., Backspace, Arrow keys)
                  const charCode = e.charCode;
                  if (charCode < 48 || charCode > 57) {
                    e.preventDefault();
                  }
                }}
                placeholder="nominal"
              />
            </Col>
          </Form.Group>
          <Form.Group as={Row} controlId="formDate" className="m-1">
            <Form.Label column sm={4}>Date</Form.Label>
            <Col sm={8}>
              <div className="input-group">
                <ReactDatePicker
                  selected={date}
                  onChange={handleChange}
                  dateFormat="dd/MM/yyyy"
                  isClearable
                  placeholderText="pilih tanggal"
                  customInput={<Form.Control readOnly />}
                />
                <div className="input-group-append">
                  <span className="input-group-text">
                    <FaCalendarAlt />
                  </span>
                </div>
              </div>
            </Col>
          </Form.Group>

          <Form.Group as={Row} controlId="formKeterangan" className="m-1">
            <Form.Label column sm={4}>Keterangan</Form.Label>
            <Col sm={8}>
              <Form.Control
                as="textarea"
                rows={4}
                value={ket}
                onChange={(e) => setKet(e.target.value)}
                placeholder="keterangan"
              />
            </Col>
          </Form.Group>

          <Form.Group as={Row} className="m-1">
            <Col md={4}></Col>
            <Col md={4}></Col>
            <Col sm={4} className="d-flex justify-content-end">
              <Button type="submit" className="button is-success">Update</Button>
            </Col>
          </Form.Group>
        </Form>
      </Col>
      <Col md={3}></Col>
    </Row>
  );
};

export default EditUser;
