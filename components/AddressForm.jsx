'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Loader } from 'lucide-react';

const AddressForm = ({ onSave, onCancel }) => {
    const [formData, setFormData] = useState({
        name: '', firstName: '', lastName: '', address: '', apartment: '',
        city: '', country: 'India', state: '', zip: '',
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [errors, setErrors] = useState({});

    // Function to validate the form data
    const validateForm = (data) => {
        const newErrors = {};
        if (!data.name) newErrors.name = 'Address name is required.';
        if (!data.firstName) newErrors.firstName = 'First name is required.';
        if (!data.lastName) newErrors.lastName = 'Last name is required.';
        if (!data.address) newErrors.address = 'Address is required.';
        if (!data.city) newErrors.city = 'City is required.';
        if (!data.state) newErrors.state = 'State is required.';
        if (!data.zip) {
            newErrors.zip = 'PIN code is required.';
        } else if (!/^\d{6}$/.test(data.zip)) {
            newErrors.zip = 'Please enter a valid 6-digit PIN code.';
        }
        return newErrors;
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => {
            const updatedData = { ...prev, [name]: value };
            // Validate on each change to provide real-time feedback
            setErrors(validateForm(updatedData));
            return updatedData;
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const validationErrors = validateForm(formData);
        setErrors(validationErrors);

        if (Object.keys(validationErrors).length > 0) {
            return; // Don't submit if there are errors
        }

        setIsSubmitting(true);
        try {
            const res = await fetch('/api/addresses', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData),
            });
            if (!res.ok) throw new Error('Failed to save address.');
            const newAddress = await res.json();
            onSave(newAddress.data);
        } catch (error) {
            console.error(error);
            setErrors({ submit: 'Failed to save address. Please try again.' });
        } finally {
            setIsSubmitting(false);
        }
    };

    const isFormValid = Object.keys(validateForm(formData)).length === 0;

    return (
        <motion.div 
            initial={{ opacity: 0, height: 0 }} 
            animate={{ opacity: 1, height: 'auto' }} 
            exit={{ opacity: 0, height: 0 }} 
            className="mt-4 overflow-hidden"
        >
            <form onSubmit={handleSubmit} noValidate>
                <div className="grid grid-cols-1 gap-y-4 sm:grid-cols-2 sm:gap-x-4">
                    <div>
                        <label htmlFor="name" className="form-label">Address Name (e.g. Home)</label>
                        <input type="text" name="name" id="name" className={`form-input ${errors.name ? 'border-red-500' : ''}`} value={formData.name} onChange={handleInputChange} required/>
                        {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
                    </div>
                    <div>
                        <label htmlFor="firstName" className="form-label">First name</label>
                        <input type="text" name="firstName" id="firstName" className={`form-input ${errors.firstName ? 'border-red-500' : ''}`} value={formData.firstName} onChange={handleInputChange} required/>
                        {errors.firstName && <p className="text-red-500 text-xs mt-1">{errors.firstName}</p>}
                    </div>
                    <div>
                        <label htmlFor="lastName" className="form-label">Last name</label>
                        <input type="text" name="lastName" id="lastName" className={`form-input ${errors.lastName ? 'border-red-500' : ''}`} value={formData.lastName} onChange={handleInputChange} required/>
                        {errors.lastName && <p className="text-red-500 text-xs mt-1">{errors.lastName}</p>}
                    </div>
                    <div className="sm:col-span-2">
                        <label htmlFor="address" className="form-label">Address</label>
                        <input type="text" name="address" id="address" className={`form-input ${errors.address ? 'border-red-500' : ''}`} value={formData.address} onChange={handleInputChange} required/>
                        {errors.address && <p className="text-red-500 text-xs mt-1">{errors.address}</p>}
                    </div>
                    <div>
                        <label htmlFor="city" className="form-label">City</label>
                        <input type="text" name="city" id="city" className={`form-input ${errors.city ? 'border-red-500' : ''}`} value={formData.city} onChange={handleInputChange} required/>
                        {errors.city && <p className="text-red-500 text-xs mt-1">{errors.city}</p>}
                    </div>
                    <div>
                        <label htmlFor="country" className="form-label">Country</label>
                        <input
                            type="text"
                            name="country"
                            id="country"
                            className="form-input bg-slate-100 dark:bg-slate-800 cursor-not-allowed"
                            value="India"
                            readOnly
                        />
                    </div>
                    <div>
                        <label htmlFor="state" className="form-label">State / Province</label>
                        <input type="text" name="state" id="state" className={`form-input ${errors.state ? 'border-red-500' : ''}`} value={formData.state} onChange={handleInputChange} required/>
                        {errors.state && <p className="text-red-500 text-xs mt-1">{errors.state}</p>}
                    </div>
                    <div>
                        <label htmlFor="zip" className="form-label">PIN / Postal code</label>
                        <input type="text" name="zip" id="zip" className={`form-input ${errors.zip ? 'border-red-500' : ''}`} value={formData.zip} onChange={handleInputChange} required/>
                        {errors.zip && <p className="text-red-500 text-xs mt-1">{errors.zip}</p>}
                    </div>
                </div>
                {errors.submit && <p className="text-red-500 text-sm mt-4 text-center">{errors.submit}</p>}
                <div className="flex gap-4 mt-4">
                    <button type="submit" disabled={isSubmitting || !isFormValid} className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700 disabled:bg-indigo-400 disabled:cursor-not-allowed">
                        {isSubmitting ? <Loader size={16} className="animate-spin"/> : 'Save Address'}
                    </button>
                    <button type="button" onClick={onCancel} className="rounded-lg bg-slate-200 dark:bg-slate-700 px-4 py-2 text-sm font-medium hover:bg-slate-300 dark:hover:bg-slate-600">Cancel</button>
                </div>
            </form>
        </motion.div>
    );
};

export default AddressForm;
