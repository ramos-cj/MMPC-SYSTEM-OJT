import React, { useState } from "react";
import { router } from "@inertiajs/react";
import SidebarInventory from "@/components/sidebar-inventory";
import "@/styles/DeviceManagement.css";

const InventoryDeviceManagement: React.FC = () => {
    const [formData, setFormData] = useState({
        tag_no: "",
        pi_guard: "",
        general_name: "",
        activation_updates: "",
        brand_name: "",
        accessories: "",
        classification: "",
        estimated_acquisition_year: "",
        model: "",
        location: "",
        serial_number: "",
        qr_code: "",
        property_tag: "",
        with_warranty: "",
        computer_name: "",
        remarks: "",
        condition: "",
        image_file: null as File | null,
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
    
        router.post("/inventory-device-management/save", data, {
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
                <h2>DEVICE MANAGEMENT</h2>
                <form onSubmit={handleSubmit} className="device-form">
                    <div className="form-grid">
                        <div className="form-group">
                            <label>Tag No.</label>
                            <input type="text" name="tag_no" placeholder="Enter Tag Number" value={formData.tag_no} onChange={handleChange} />
                        </div>

                        <div className="form-group">
                            <label>With IP-Guard</label>
                            <select name="pi_guard" value={formData.pi_guard} onChange={handleChange}>
                                <option value="">Choose IP-Guard</option>
                                <option value="Unauthorized">Unauthorized</option>
                                <option value="Unclassified">Unclassified</option>
                            </select>
                        </div>

                        <div className="form-group">
                            <label>General Name</label>
                            <input type="text" name="general_name" placeholder="Enter General Name" value={formData.general_name} onChange={handleChange} />
                        </div>

                        <div className="form-group">
                            <label>Activation Updates</label>
                            <select name="activation_updates" value={formData.activation_updates} onChange={handleChange}>
                                <option value="">Choose Activation Updates</option>
                                <option value="Yes">Yes</option>
                                <option value="No">No</option>
                            </select>
                        </div>

                        <div className="form-group">
                            <label>Brand Name</label>
                            <input type="text" name="brand_name" placeholder="Enter Brand Name" value={formData.brand_name} onChange={handleChange} />
                        </div>

                        <div className="form-group">
                            <label>Accessories</label>
                            <input type="text" name="accessories" placeholder="Enter Accessories Included" value={formData.accessories} onChange={handleChange} />
                        </div>

                        <div className="form-group">
                            <label>Classification</label>
                            <select name="classification" value={formData.classification} onChange={handleChange}>
                                <option value="">Choose Classification</option>
                                <option value="Laptop">Laptop</option>
                                <option value="Tablet">Tablet</option>
                                <option value="Phone">Phone</option>
                            </select>
                        </div>

                        <div className="form-group">
                            <label>Estimated Acquisition Year</label>
                            <input type="text" name="estimated_acquisition_year" placeholder="Enter Estimated Acquisition Year" value={formData.estimated_acquisition_year} onChange={handleChange} />
                        </div>

                        <div className="form-group">
                            <label>Model</label>
                            <input type="text" name="model" placeholder="Enter Model" value={formData.model} onChange={handleChange} />
                        </div>

                        <div className="form-group">
                            <label>Location</label>
                            <input type="text" name="location" placeholder="Enter Location"value={formData.location} onChange={handleChange} />
                        </div>

                        <div className="form-group">
                            <label>Serial Number</label>
                            <input type="text" name="serial_number" placeholder="Enter Serial Number"value={formData.serial_number} onChange={handleChange} />
                        </div>

                        <div className="form-group">
                            <label>With QR Code</label>
                            <select name="qr_code" value={formData.qr_code} onChange={handleChange}>
                                <option value="">Have QR Code?</option>
                                <option value="Yes">Yes</option>
                                <option value="No">No</option>
                            </select>
                        </div>

                        <div className="form-group">
                            <label>Property Tag</label>
                            <input type="text" name="property_tag" placeholder="Enter Property Tag" value={formData.property_tag} onChange={handleChange} />
                        </div>

                        <div className="form-group">
                            <label>With Warranty</label>
                            <select name="with_warranty" value={formData.with_warranty} onChange={handleChange}>
                                <option value="">Have Warranty?</option>
                                <option value="Yes">Yes</option>
                                <option value="No">No</option>
                            </select>
                        </div>

                        <div className="form-group">
                            <label>Computer Name</label>
                            <input type="text" name="computer_name" placeholder="Enter Computer Name" value={formData.computer_name} onChange={handleChange} />
                        </div>

                        <div className="form-group">
                            <label>Remarks</label>
                            <textarea name="remarks" placeholder="Enter Remarks"value={formData.remarks} onChange={handleChange}></textarea>
                        </div>

                        <div className="form-group">
                            <label>Condition</label>
                            <select name="condition" value={formData.condition} onChange={handleChange}>
                                <option value="">Select Condition</option>
                                <option value="Good">Good Condition</option>
                                <option value="Bad">Bad Condition</option>
                            </select>
                        </div>

                        <div className="form-group">
                            <label>Image File Name</label>
                            <input type="file" name="image_file" onChange={handleFileChange} />
                        </div>
                    </div>

                    <button type="submit" className="save-btn">Save Device</button>
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
