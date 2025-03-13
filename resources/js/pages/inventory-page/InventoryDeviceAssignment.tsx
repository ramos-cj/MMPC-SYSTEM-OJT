import React, { useState, useEffect } from "react";
import { Head } from "@inertiajs/react";
import SidebarInventory from "@/components/sidebar-inventory";
import "@/styles/DeviceAssignment.css";
import { FaTrash, FaExchangeAlt } from "react-icons/fa";

interface Device {
    id: number;
    classification: string;
    brand_name: string;
    model: string;
    serial_number: string;
    condition: string;
    remarks: string;
    assigned_to: string | null;
}

interface AssignedDevice {
    user_id: number;
    employee_number: string;
    full_name: string;
    classification: string;
    brand_name: string;
    model: string;
    serial_number: string;
}

const InventoryDeviceAssignment: React.FC = () => {
    const [devices, setDevices] = useState<Device[]>([]);
    const [assignedDevices, setAssignedDevices] = useState<AssignedDevice[]>([]);
    const [employeeName, setEmployeeName] = useState("");
    const [selectedClassification, setSelectedClassification] = useState("");
    const [availableBrands, setAvailableBrands] = useState<string[]>([]);
    const [selectedBrand, setSelectedBrand] = useState("");
    const [availableModels, setAvailableModels] = useState<string[]>([]);
    const [selectedModel, setSelectedModel] = useState("");
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [showTransferModal, setShowTransferModal] = useState(false);
    const [deviceToModify, setDeviceToModify] = useState<AssignedDevice | null>(null);
    const [newAssignee, setNewAssignee] = useState("");

    // Fetch available devices and assigned devices
    useEffect(() => {
        fetch("/inventory-device-assignment/available-devices")
            .then((res) => res.json())
            .then((data: Device[]) => {
                const filteredDevices = data.filter((device: Device) =>
                    (device.remarks === "Available" || device.remarks === "Free") && !device.assigned_to
                );
                setDevices(filteredDevices);
            })
            .catch((error) => console.error("Error fetching devices:", error));

        fetch("/inventory-device-assignment/assigned-devices")
            .then((res) => res.json())
            .then((data: AssignedDevice[]) => setAssignedDevices(data))
            .catch((error) => console.error("Error fetching assigned devices:", error));
    }, []);

    // Filter available brands based on selected classification
    useEffect(() => {
        if (selectedClassification) {
            const filteredBrands = [...new Set(devices
                .filter(device => device.classification === selectedClassification)
                .map(device => device.brand_name))];
            setAvailableBrands(filteredBrands);
            setSelectedBrand("");
            setAvailableModels([]);
        }
    }, [selectedClassification, devices]);

    // Filter available models based on selected brand
    useEffect(() => {
        if (selectedBrand) {
            const filteredModels = [...new Set(devices
                .filter(device => device.classification === selectedClassification && device.brand_name === selectedBrand)
                .map(device => device.model))];
            setAvailableModels(filteredModels);
            setSelectedModel("");
        }
    }, [selectedBrand, devices]);

    // Assign a device to a user
    const handleAssignDevice = () => {
        if (!employeeName || !selectedClassification || !selectedBrand || !selectedModel) {
            alert("Please fill in all fields.");
            return;
        }

        fetch("/inventory-device-assignment/assign", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "X-CSRF-TOKEN": (document.querySelector('meta[name="csrf-token"]') as HTMLMetaElement)?.content || "",
            },
            body: JSON.stringify({
                employee_name: employeeName,
                classification: selectedClassification,
                brand_name: selectedBrand,
                model: selectedModel
            }),
            credentials: "include",
        })
        
        .then((res) => res.json())
        .then((newAssignment) => {
            setAssignedDevices((prev) => [...prev, newAssignment]);
            setDevices((prev) => prev.filter(device => device.serial_number !== newAssignment.serial_number));
            setEmployeeName("");
            setSelectedClassification("");
            setSelectedBrand("");
            setSelectedModel("");
        })
        .catch((error) => console.error("Error assigning device:", error));
    };

    // Open delete modal
    const handleRemoveDevice = (device: AssignedDevice) => {
        setDeviceToModify(device);
        setShowDeleteModal(true);
    };

    // Remove device from user
    const confirmRemoveDevice = () => {
        if (!deviceToModify) return;

        fetch("/inventory-device-assignment/remove", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ serial_number: deviceToModify.serial_number })
        })
        .then(() => {
            setAssignedDevices((prev) => prev.filter(d => d.serial_number !== deviceToModify.serial_number));
            setShowDeleteModal(false);
        })
        .catch((error) => console.error("Error removing device:", error));
    };

    // Open transfer modal
    const handleTransferDevice = (device: AssignedDevice) => {
        setDeviceToModify(device);
        setShowTransferModal(true);
    };

    // Transfer device to another employee
    const confirmTransferDevice = () => {
        if (!deviceToModify || !newAssignee) return;

        fetch("/inventory-device-assignment/transfer", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ serial_number: deviceToModify.serial_number, new_assignee: newAssignee })
        })
        .then(() => {
            setShowTransferModal(false);
            setNewAssignee("");
        })
        .catch((error) => console.error("Error transferring device:", error));
    };

    return (
        <>
            <Head title="Inventory Device Assignment" />
            <div className="dashboard-wrapper">
                <SidebarInventory />
                <div className="assign-content-container">
                    <h2 className="title">DEVICE ASSIGNMENT</h2>

                    {/* Device Assignment Form */}
                    <div className="form-container">
                        <input type="text" placeholder="Enter Full Name" className="input-field" value={employeeName} onChange={(e) => setEmployeeName(e.target.value)} />
                        <select className="dropdown" value={selectedClassification} onChange={(e) => setSelectedClassification(e.target.value)}>
                            <option value="">Choose Device</option>
                            {devices.map(d => d.classification).filter((v, i, a) => a.indexOf(v) === i).map(classification => (
                                <option key={classification} value={classification}>{classification}</option>
                            ))}
                        </select>
                        <select className="dropdown" value={selectedBrand} onChange={(e) => setSelectedBrand(e.target.value)}>
                            <option value="">Choose Brand</option>
                            {availableBrands.map(brand => <option key={brand} value={brand}>{brand}</option>)}
                        </select>
                        <select className="dropdown" value={selectedModel} onChange={(e) => setSelectedModel(e.target.value)}>
                            <option value="">Choose Model</option>
                            {availableModels.map(model => <option key={model} value={model}>{model}</option>)}
                        </select>
                        <button className="assign-button" onClick={handleAssignDevice}>Assign Device</button>
                    </div>

                    {/* Assigned Devices Table */}
                    <div className="table-container">
                        <table className="device-table">
                            <thead>
                                <tr>
                                    <th>User ID</th>
                                    <th>Employee No.</th>
                                    <th>Full Name</th>
                                    <th>Classification</th>
                                    <th>Brand</th>
                                    <th>Model</th>
                                    <th>Serial Number</th>
                                    <th>Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {assignedDevices.map((device) => (
                                    <tr key={device.serial_number}>
                                        <td>{device.user_id}</td>
                                        <td>{device.employee_number}</td>
                                        <td>{device.full_name}</td>
                                        <td>{device.classification}</td>
                                        <td>{device.brand_name}</td>
                                        <td>{device.model}</td>
                                        <td>{device.serial_number}</td>
                                        <td>
                                            <FaTrash className="delete-icon" onClick={() => handleRemoveDevice(device)} />
                                            <FaExchangeAlt className="transfer-icon" onClick={() => handleTransferDevice(device)} />
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </>
    );
};

export default InventoryDeviceAssignment;
