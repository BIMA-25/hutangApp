import axios from "axios";
import { useState, useEffect } from "react";
import {
  Col,
  Container,
  Form,
  ListGroup,
  Row,
  Table,
  Button,
} from "react-bootstrap";
import { useNavigate, useParams } from "react-router-dom";
import { Link } from "react-router-dom";
import "./App.css"; // Pastikan mengimpor file CSS

export default function DetailUser() {
  const [searchTerm, setSearchTerm] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [users, setUser] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [status, setStatus] = useState("berikan");
  const [hutangUser, setHutangUser] = useState([]);
  const [bayarHutangUser, setBayarHutangUser] = useState([]);
  const [date, setDate] = useState(null);
  const [ket, setKet] = useState("");
  const [kembalian, setKembalian] = useState("");
  const [sisahutang, setsisahutang] = useState("");
  const { id } = useParams();

  useEffect(() => {
    getUserById();
  }, []);

  const lunaskanUser = async (id, navigate, sisahutang, kembalian) => {
    const now = new Date();
    const hariIni = now.toISOString();
    const schemaLunasHutang = {
      sisahutang: 0,
      bayar: [
        ...bayarHutangUser,
        {
          bayar: Math.abs(sisahutang),
          date: hariIni,
          ket: "dilunaskan",
        },
      ],
    };
    const schemaLunasKembalian = {
      sisahutang: 0,
      hutang: [
        ...hutangUser,
        {
          hutang: Math.abs(sisahutang),
          date: hariIni,
          ket: "dilunaskan",
        },
      ],
    };

    const update = async (schema) => {
      if (window.confirm("Apakah anda yakin untuk melunaskan hutang ?")) {
        try {
          await axios.patch(`http://localhost:5001/users/${id}`, schema);
          navigate("/"); // Navigate to a temporary route
        } catch (error) {
          console.log(error);
        }
      }
    };

    if (sisahutang > 0) {
      update(schemaLunasHutang);
    } else if (sisahutang < 0) {
      update(schemaLunasKembalian);
    } else {
      window.confirm("tidak ada hutang atau hutang kembalian");
    }
  };

  const getUserById = async () => {
    const response = await axios.get(`http://localhost:5001/users/${id}`);
    setHutangUser(response.data.hutang);
    setsisahutang(response.data.sisahutang);
    setBayarHutangUser(response.data.bayar);
    setName(response.data.name);
    setStatus(response.data.status);
    setDate(response.data.date);
    setKet(response.data.ket);
    setKembalian(response.data.kembalian);
  };

  const deleteUser = async (id, navigate) => {
    try {
      await axios.delete(`http://localhost:5001/users/${id}`);
      navigate("/");
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      <Row className="mt-4">
        <Col xs={12} md={8}>
          <Row>
            <Col xs={4} md={4}>
              <h5>Nama Pelanggan</h5>
            </Col>
            <Col xs={1} md={1}>
              <h5>:</h5>
            </Col>
            <Col xs={7} md={7}>
              <h5>{name}</h5>
            </Col>
          </Row>
          <Row>
            <Col xs={4} md={4}>
              <h5>hutang pelanggan</h5>
            </Col>
            <Col xs={1} md={1}>
              <h5>:</h5>
            </Col>
            <Col xs={7} md={7}>
              <h5>{sisahutang <= 0 ? 0 : Math.abs(sisahutang)}</h5>
            </Col>
          </Row>
          <Row>
            <Col xs={4} md={4}>
              <h5>anda berhutang</h5>
            </Col>
            <Col xs={1} md={1}>
              <h5>:</h5>
            </Col>
            <Col xs={7} md={7}>
              <h5>{sisahutang <= 0 ? Math.abs(sisahutang) : 0}</h5>
            </Col>
          </Row>
        </Col>
        <Col xs={12} md={4}>
          <Row>
            <Col md={6}></Col>
            <Col md={6}>
              <Button
                variant="warning"
                size="sm"
                className="mx-1 mb-2"
                style={{ width: "100%" }}
                onClick={() => {
                  lunaskanUser(id, navigate, sisahutang, sisahutang);
                }}
              >
                Lunaskan
              </Button>
            </Col>
          </Row>
          <Row>
            <Col md={6}></Col>
            <Col md={6}>
              <Button
                variant="success"
                size="sm"
                className="mx-1 mb-2"
                style={{ width: "100%" }}
                onClick={() => {
                  navigate(`/editpel/${id}`); // Navigate to the edit page
                }}
              >
                Edit Pelanggan
              </Button>
            </Col>
          </Row>
          <Row>
            <Col md={6}></Col>
            <Col md={6}>
              <Button
                variant="danger"
                size="sm"
                className="mx-1 mb-2"
                style={{ width: "100%" }}
                onClick={() => {
                  if (
                    window.confirm(`Apakah anda yakin untuk menghapus ${name}`)
                  ) {
                    deleteUser(id, navigate);
                  }
                }}
              >
                Hapus Pelanggan
              </Button>
            </Col>
          </Row>
        </Col>
      </Row>
      <Row></Row>

      <Row className="mt-4">
        <Col>
          <h6 className="text-center">Detail Hutang</h6>
          <Table striped hover className="custom-table">
            <thead>
              <tr>
                <th className="judul-tabel">tanggal</th>
                <th className="judul-tabel">jumlah</th>
                <th className="judul-tabel">keterangan</th>
              </tr>
            </thead>
            <tbody>
              {hutangUser.length != 0 ? (
                hutangUser.map((item, index) => {
                  const date =
                    typeof item.date === "string"
                      ? new Date(item.date)
                      : item.date;
                  return (
                    <tr key={index}>
                      <td>
                        {date instanceof Date && !isNaN(date)
                          ? date.toLocaleDateString("en-GB")
                          : ""}
                      </td>
                      <td>{item.hutang}</td>
                      <td>{item.ket}</td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={3} className="text-center">
                    belum ada data
                  </td>
                </tr>
              )}
            </tbody>
          </Table>
        </Col>
        <Col>
          <h6 className="text-center">Detail Bayar Hutang</h6>
          <Table striped hover className="custom-table">
            <thead>
              <tr>
                <th className="judul-tabel">tanggal</th>
                <th className="judul-tabel">jumlah</th>
                <th className="judul-tabel">keterangan</th>
              </tr>
            </thead>
            <tbody>
              {bayarHutangUser.length != 0 ? (
                bayarHutangUser.map((item, index) => {
                  const date =
                    typeof item.date === "string"
                      ? new Date(item.date)
                      : item.date;
                  return (
                    <tr key={index}>
                      <td>
                        {date instanceof Date && !isNaN(date)
                          ? date.toLocaleDateString("en-GB")
                          : ""}
                      </td>
                      <td>{item.bayar}</td>
                      <td>{item.ket}</td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={3} className="text-center">
                    belum ada data
                  </td>
                </tr>
              )}
            </tbody>
          </Table>
        </Col>
      </Row>
    </>
  );
}
