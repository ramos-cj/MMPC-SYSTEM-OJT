import { useState, useEffect } from "react";
import { Head } from "@inertiajs/react";
import SidebarInventory from "@/components/sidebar-inventory";
import mmpcLogo from '@/assets/mmpc-logo1.png'; 
import { FaSearch, FaTrash, FaEdit, FaTimes } from "react-icons/fa";
import "@/styles/DeviceList.css";
import "@/styles/userlist.css";

interface Device {
  id: number;
  tag_no: string;
  classification: string;
  brand_model: string;
  condition: string;
  remarks: string;
  device_remarks?: string;
  location: string;
  serial_number: string;
  estimated_acquisition_year: string;
  with_warranty: string;
  computer_name?: string;
  qr_code: string;
  need_to_be_repair: string;
  activation_updates: string;
  image_file?: string;
  employee_name?: string;
  supplier_name?: string;
  invoice_number?: string;
  warranty_years?: string;
  last_inventory_count?: string;
  it_in_charge?: string;
  ticket_number?: string;
  reason_for_disposal?: string;
}

export default function InventoryDisposedList() {
  const [devices, setDevices] = useState<Device[]>([]);
  const [selectedDevice, setSelectedDevice] = useState<Device | null>(null);
  const [selectedClassification, setSelectedClassification] = useState("");
  const [selectedBrand, setSelectedBrand] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [entriesPerPage, setEntriesPerPage] = useState(15);
  const [currentPage, setCurrentPage] = useState(1);
  const [brands, setBrands] = useState<string[]>([]);

  const classifications = ["Laptop", "Phone", "Tablet"];

  useEffect(() => {
    fetch("/disposed-devices")  // <-- fetch from disposed_devices API endpoint
      .then((res) => res.json())
      .then((data: Device[]) => {
        setDevices(data);

        // Extract unique brands from disposed devices for brand dropdown
        const uniqueBrands = Array.from(new Set(data.map((d) => d.brand_model)));
        setBrands(uniqueBrands);
      })
      .catch((err) => console.error("Error fetching disposed devices:", err));
  }, []);

  // Filter devices by searchTerm, classification, brand
  const filteredDevices = devices.filter((device) => {
    const matchesSearch =
      device.brand_model.toLowerCase().includes(searchTerm.toLowerCase()) ||
      device.computer_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      device.employee_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      device.tag_no.includes(searchTerm);

    const matchesClassification = selectedClassification === "" || device.classification === selectedClassification;
    const matchesBrand = selectedBrand === "" || device.brand_model === selectedBrand;

    return matchesSearch && matchesClassification && matchesBrand;
  });

  // Pagination logic on filtered devices
  const indexOfLastEntry = currentPage * entriesPerPage;
  const indexOfFirstEntry = indexOfLastEntry - entriesPerPage;
  const currentDevices = filteredDevices.slice(indexOfFirstEntry, indexOfLastEntry);
  const totalPages = Math.ceil(filteredDevices.length / entriesPerPage);

  // Modal open/close handlers
  const handleDeviceClick = (device: Device) => setSelectedDevice(device);
  const closeModal = () => setSelectedDevice(null);

  return (
    <>
      <Head title="Inventory Disposed Device List" />
      <div className="dashboard-wrapper">
        <SidebarInventory />
        <div className="device-list-container">
          <h2>Disposed Device List ({filteredDevices.length} devices)</h2>

          <div className="filter-container" style={{ display: "flex", alignItems: "center", gap: "1rem", flexWrap: "wrap" }}>
            <label className="entries-label" style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
              Show
              <select
                value={entriesPerPage}
                onChange={(e) => {
                  setEntriesPerPage(Number(e.target.value));
                  setCurrentPage(1);
                }}
                className="entries-select"
              >
                {[15, 30, 45, 60, 75, 100].map((num) => (
                  <option key={num} value={num}>
                    {num}
                  </option>
                ))}
              </select>
              entries
            </label>

            <div className="search-container" style={{ display: "flex", alignItems: "center", gap: "0.25rem", flex: "1 1 300px" }}>
              <FaSearch className="search-icon" />
              <input
                type="text"
                placeholder="Search..."
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setCurrentPage(1);
                }}
                style={{ flexGrow: 1 }}
              />
            </div>

            <select
              value={selectedClassification}
              onChange={(e) => {
                setSelectedClassification(e.target.value);
                setCurrentPage(1);
              }}
              style={{ minWidth: 120 }}
            >
              <option value="">Select Classification</option>
              {classifications.map((cls) => (
                <option key={cls} value={cls}>
                  {cls}
                </option>
              ))}
            </select>

            <select
              value={selectedBrand}
              onChange={(e) => {
                setSelectedBrand(e.target.value);
                setCurrentPage(1);
              }}
              style={{ minWidth: 120 }}
            >
              <option value="">Select Brand</option>
              {brands.map((brand) => (
                <option key={brand} value={brand}>
                  {brand}
                </option>
              ))}
            </select>
          </div>

          <div className="device-table-container" style={{ marginTop: "1rem" }}>
            <table>
              <thead>
                <tr>
                  <th>Device ID</th>
                  <th>Ticket Number</th>
                  <th>Host Name</th>
                  <th>Tag No.</th>
                  <th>Serial Number</th>
                  <th>Brand / Model</th>
                  <th>Classification</th>
                  <th>Remarks</th>
                  <th>Reason For Disposal</th>
                </tr>
              </thead>
              <tbody>
                {currentDevices.map((device, index) => (
                  <tr key={device.id}>
                    <td>{indexOfFirstEntry + index + 1}</td>
                    <td className="clickable" onClick={() => handleDeviceClick(device)}>{device.ticket_number}</td>
                    <td className="clickable" onClick={() => handleDeviceClick(device)}>{device.computer_name || "N/A"}</td>
                    <td>{device.tag_no}</td>
                    <td>{device.serial_number}</td>
                    <td>{device.brand_model}</td>
                    <td>{device.classification}</td>
                    <td>{device.remarks}</td>
                    <td>{device.reason_for_disposal}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="pagination" style={{ marginTop: "1rem" }}>
            <button disabled={currentPage === 1} onClick={() => setCurrentPage(currentPage - 1)}>Previous</button>
            {[...Array(totalPages)].map((_, index) => (
              <button
                key={index + 1}
                className={currentPage === index + 1 ? "active" : ""}
                onClick={() => setCurrentPage(index + 1)}
              >
                {index + 1}
              </button>
            ))}
            <button disabled={currentPage === totalPages} onClick={() => setCurrentPage(currentPage + 1)}>Next</button>
          </div>
        </div>
      </div>

      {selectedDevice && (
        <div className="modal-overlay">
          <div className="details-modal-content">
            <div className="details-modal-header">
              <img src={mmpcLogo} alt="MMPC Logo" className="mmpc-logo" />
              <h2>Device's Information</h2>
              <FaTimes className="close-icon1" onClick={closeModal} />
            </div>

            <div className="image-device-details">
              {selectedDevice.image_file ? (
                <a href={`/device-image/${selectedDevice.image_file}`} target="_blank" rel="noopener noreferrer">
                  <img
                    src={`/device-image/${selectedDevice.image_file}`}
                    alt="Device Image"
                    className="device-image"
                    onError={(e) => (e.currentTarget.style.display = "none")}
                  />
                </a>
              ) : (
                <p>No Image Available</p>
              )}
            </div>

            <div className="device-details">
              {[
                { label :"Ticket Number:", value: selectedDevice.ticket_number},
                { label: "Computer Name", value: selectedDevice.computer_name },
                { label: "Serial Number", value: selectedDevice.serial_number },
                { label: "Tag No", value: selectedDevice.tag_no },
                { label: "Classification", value: selectedDevice.classification },
                { label: "Brand / Model", value: selectedDevice.brand_model },
                { label: "Location", value: selectedDevice.location },
                { label: "With Activation Updates", value: selectedDevice.activation_updates },
                { label: "Have QR Code", value: selectedDevice.qr_code },
                { label: "Estimated Acquisition Year", value: selectedDevice.estimated_acquisition_year },
                { label: "With Warranty", value: selectedDevice.with_warranty },
                { label: "Warranty (Years)", value: selectedDevice.warranty_years },
                { label: "Condition", value: selectedDevice.condition },
                { label: "Supplier Name", value: selectedDevice.supplier_name },
                { label: "Invoice Number", value: selectedDevice.invoice_number },
                { label: "Last Inventory Count", value: selectedDevice.last_inventory_count },
                { label: "IT In-Charge", value: selectedDevice.it_in_charge },
                { label: "Installed Software (Remarks)", value: selectedDevice.device_remarks, isTextarea: true },
                { label: "Defects/Issues", value: selectedDevice.need_to_be_repair },
                { label: "Remarks (Status)", value: selectedDevice.remarks },
                { label :"Reasons for Disposal:", value: selectedDevice.reason_for_disposal},
              ].map(({ label, value, isTextarea }) => (
                <div className="input-group" key={label}>
                  <label>{label}:</label>
                  {isTextarea ? (
                    <textarea value={value || ""} readOnly className="remarks-textarea" />
                  ) : (
                    <input type="text" value={value || ""} readOnly />
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
