import { useState, useEffect } from 'react';
import styles from './emp.module.css';

export default function EmployeeModal({ isOpen, onClose, onSave, initialData }) {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [company, setCompany] = useState('');
    
   
    const [errors, setErrors] = useState({ name: '', email: '', company: '' });

    useEffect(() => {
        if (initialData) {
            setName(initialData.name || '');
            setEmail(initialData.email || '');
            setCompany(initialData.company?.name || '');
        } else {
            setName('');
            setEmail('');
            setCompany('');
        }
   
        setErrors({ name: '', email: '', company: '' });
    }, [initialData, isOpen]);

    if (!isOpen) return null;

    function handleSubmit(e) {
        e.preventDefault();
        
        const newErrors = { name: '', email: '', company: '' };
        let isValid = true;

        if (!name.trim()) {
            newErrors.name = 'Full Name is required.';
            isValid = false;
        }

     
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!email.trim()) {
            newErrors.email = 'Email Address is required.';
            isValid = false;
        } else if (!emailRegex.test(email.trim())) {
            newErrors.email = 'Please enter a valid email format (e.g., name@crossml.com).';
            isValid = false;
        }

      
        if (!company.trim()) {
            newErrors.company = 'Company assignment is required.';
            isValid = false;
        }

        setErrors(newErrors);

      
        if (isValid) {
            const employeeData = { 
                name: name.trim(), 
                email: email.trim(), 
                company: { name: company.trim() } 
            };
            onSave(employeeData);
        }
    }

    return (
        <div className={styles.overlay}>
            <div className={styles.modal}>
                <div className={styles.header}>
                    <h2 className={styles.title}>
                        {initialData ? "Edit Agent Dossier" : "Add New Agent"}
                    </h2>
                    <button onClick={onClose} className={styles.closeBtn}>&times;</button>
                </div>
                
           
                <form onSubmit={handleSubmit} noValidate>
                    
                    <div className={styles.formGroup}>
                        <label className={styles.label}>Full Name</label>
                        <input 
                            type="text" 
                            className={`${styles.input} ${errors.name ? styles.inputError : ''}`} 
                            value={name} 
                            onChange={e => { setName(e.target.value); setErrors(prev => ({ ...prev, name: '' })); }} 
                            placeholder="e.g. Ashpreet Singh"
                        />
                        {errors.name && <span className={styles.errorInline}>⚠️ {errors.name}</span>}
                    </div>
                    
                    <div className={styles.formGroup}>
                        <label className={styles.label}>Email Address</label>
                        <input 
                            type="email" 
                            className={`${styles.input} ${errors.email ? styles.inputError : ''}`} 
                            value={email} 
                            onChange={e => { setEmail(e.target.value); setErrors(prev => ({ ...prev, email: '' })); }} 
                            placeholder="name@crossml.com"
                        />
                        {errors.email && <span className={styles.errorInline}>⚠️ {errors.email}</span>}
                    </div>
                    
                    <div className={styles.formGroup}>
                        <label className={styles.label}>Company</label>
                        <input 
                            type="text" 
                            className={`${styles.input} ${errors.company ? styles.inputError : ''}`} 
                            value={company} 
                            onChange={e => { setCompany(e.target.value); setErrors(prev => ({ ...prev, company: '' })); }} 
                            placeholder="CrossML Enterprise"
                        />
                        {errors.company && <span className={styles.errorInline}>⚠️ {errors.company}</span>}
                    </div>
                    
                    <div className={styles.actions}>
                        <button type="button" onClick={onClose} className={styles.btnCancel}>Cancel</button>
                        <button type="submit" className="btn-primary">
                            {initialData ? "Save Changes" : "Save Agent"}
                        </button>
                    </div>

                </form>
            </div>
        </div>
    );
}