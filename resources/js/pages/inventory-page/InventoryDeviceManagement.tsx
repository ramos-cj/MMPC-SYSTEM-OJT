import React, { useState } from "react";
import { router } from "@inertiajs/react";
import SidebarInventory from "@/components/sidebar-inventory";
import "@/styles/DeviceManagement.css";

const InventoryDeviceManagement: React.FC = () => {
    const [formData, setFormData] = useState({
        tag_no: "",
        activation_updates: "",
        classification: "",
        estimated_acquisition_year: "",
        brand_model: "",
        location: "",
        serial_number: "",
        qr_code: "",
        with_warranty: "",
        computer_name: "",
        remarks: "",
        condition: "",
        image_file: null as File | null,
        need_to_be_repair: "",
        supplier_name: "", 
        invoice_number: "", 
        warranty_years: "",  
        last_inventory_count: "",
        it_in_charge: "",  
        ticket_number: "", 
        reason_for_disposal: ""
    });

    const [errorMessage, setErrorMessage] = useState<string | null>(null); // State for error message

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0] || null;
        setFormData((prev) => ({
            ...prev,
            image_file: file,
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
    
        const data = new FormData();
        Object.entries(formData).forEach(([key, value]) => {
            if (value !== null) data.append(key, value as string | Blob);
        });
    
        router.post("/inventory-devicemanagement/save", data, {
            forceFormData: true,  // Ensure InertiaJS correctly handles FormData
            onSuccess: () => alert("Device saved successfully!"),
            onError: (errors) => {
                const errorMsg = Object.values(errors).join("\n");
                setErrorMessage(errorMsg);
            },
        });
    };

    return (
        <div className="device-management-container">
            <SidebarInventory />
            <div className="device-management-content">
                <h2>Device Management</h2>
                <form onSubmit={handleSubmit} className="device-form">
                    <div className="form-grid">
                        <div className="form-group">
                            <label>Fixed Asset Tag No.</label>
                            <input type="text" name="tag_no" placeholder="Enter Tag Number" value={formData.tag_no} onChange={handleChange} required />
                        </div>

                        <div className="form-group">
                            <label>Activation Updates</label>
                            <select name="activation_updates" value={formData.activation_updates} onChange={handleChange} required>
                                <option value="">Choose Activation Updates</option>
                                <option value="Yes">Yes</option>
                                <option value="No">No</option>
                            </select>
                        </div>

                        <div className="form-group">
                            <label>Classification</label>
                            <select name="classification" value={formData.classification} onChange={handleChange} required>
                                <option value="">Choose Classification</option>
                                <option value="Laptop">Laptop</option>
                                <option value="Tablet">Tablet</option>
                                <option value="Phone">Phone</option>
                            </select>
                        </div>

                        <div className="form-group">
                            <label>Estimated Acquisition Year</label>
                            <input type="text" name="estimated_acquisition_year" placeholder="Enter Estimated Acquisition Year" value={formData.estimated_acquisition_year} onChange={handleChange} required/>
                        </div>

                        <div className="form-group">
                            <label>Brand/Model</label>
                            <input type="text" name="brand_model" placeholder="Enter Brand/Model" value={formData.brand_model} onChange={handleChange} required/>
                        </div>

                        <div className="form-group">
                            <label>Location</label>
                            <input type="text" name="location" placeholder="Enter Location"value={formData.location} onChange={handleChange} required/>
                        </div>

                        <div className="form-group">
                            <label>Serial Number</label>
                            <input type="text" name="serial_number" placeholder="Enter Serial Number"value={formData.serial_number} onChange={handleChange} required/>
                        </div>

                        <div className="form-group">
                            <label>With QR Code</label>
                            <select name="qr_code" value={formData.qr_code} onChange={handleChange} required>
                                <option value="">Have QR Code?</option>
                                <option value="Yes">Yes</option>
                                <option value="No">No</option>
                            </select>
                        </div>

                        <div className="form-group">
                            <label>With Warranty</label>
                            <select name="with_warranty" value={formData.with_warranty} onChange={handleChange} required>
                                <option value="">Have Warranty?</option>
                                <option value="Yes">Yes</option>
                                <option value="No">No</option>
                            </select>
                        </div>

                        <div className="form-group">
                            <label>Host Name</label>
                            <input type="text" name="computer_name" placeholder="Enter Host Name" value={formData.computer_name} onChange={handleChange} required/>
                        </div>

                        <div className="form-group">
                            <label>Condition</label>
                            <select name="condition" value={formData.condition} onChange={handleChange} required>
                                <option value="">Select Condition</option>
                                <option value="Good">Good Condition</option>
                                <option value="Bad">Bad Condition</option>
                            </select>
                        </div>

                        <div className="form-group">
                            <label>Supplier's Name</label>
                            <input type="text" name="supplier_name" placeholder="Enter Supplier's Name" value={formData.supplier_name} onChange={handleChange} required />
                        </div>

                        <div className="form-group">
                            <label>Invoice Number</label>
                            <input type="text" name="invoice_number" placeholder="Enter Invoice Number" value={formData.invoice_number} onChange={handleChange} required />
                        </div>

                        <div className="form-group">
                            <label>Warranty (Years)</label>
                            <input type="number" name="warranty_years" placeholder="Enter Warranty Period (Years)" value={formData.warranty_years} onChange={handleChange} required />
                        </div>

                        <div className="form-group">
                            <label>Last Inventory Count</label>
                            <input type="date" name="last_inventory_count" value={formData.last_inventory_count} onChange={handleChange} required />
                        </div>

                        <div className="form-group">
                            <label>IT In-Charge</label>
                            <input type="text" name="it_in_charge" placeholder="Enter IT In-Charge Name" value={formData.it_in_charge} onChange={handleChange} required />
                        </div>

                        <div className="form-group">
                            <label>Remarks (Status if "Free", "Assigned", or "Disposed")</label>
                            <select name="remarks" value={formData.remarks} onChange={handleChange} required>
                                <option value="">Select Remarks</option>
                                <option value="Free">Free</option>
                                <option value="Assigned">Assigned</option>
                                <option value="Disposed">Disposed</option>
                            </select>
                        </div>

                        {/* Show "Ticket Number" and "Reason for Disposal" fields if "Disposed" is selected */}
                        {formData.remarks === "Disposed" && (
                            <>
                                <div className="form-group">
                                    <label>Ticket Number</label>
                                    <input
                                        type="text"
                                        name="ticket_number"
                                        placeholder="Enter Ticket Number"
                                        value={formData.ticket_number}
                                        onChange={handleChange}
                                    />
                                </div>

                                <div className="form-group">
                                    <label>Reason for Disposal</label>
                                    <textarea
                                        name="reason_for_disposal"
                                        placeholder="Enter Reason for Disposal"
                                        value={formData.reason_for_disposal}
                                        onChange={handleChange}
                                    ></textarea>
                                </div>
                            </>
                        )}

                        {/* Show defect input only if "Bad Condition" is selected */}
                        {formData.condition === "Bad" && (
                            <div className="form-group">
                                <label>Defects/Issues</label>
                                <textarea
                                    name="need_to_be_repair"
                                    placeholder="List the defects/issues..."
                                    value={formData.need_to_be_repair}
                                    onChange={handleChange}
                                ></textarea>
                            </div> 
                        )}

                        <div className="form-group">
                            <label>Image File Name</label>
                            <input type="file" name="image_file" onChange={handleFileChange} />
                        </div>
                    </div>

                    <button type="submit" className="device-management-save-btn">Save Device</button>
                </form>
            </div>

            {/* Error Modal */}
            {errorMessage && (
                <div className="error-modal-overlay">
                    <div className="error-modal">
                        <h3>Error</h3>
                        <p>{errorMessage}</p>
                        <button onClick={() => setErrorMessage(null)}>OK</button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default InventoryDeviceManagement;
