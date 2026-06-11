import { useState, useEffect } from 'react';
import styles from './emp.module.css';


export default function EmployeeModal({ isOpen, onClose, onSave, initialData }) {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [company, setCompany] = useState('');

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
    }, [initialData, isOpen]);

    if (!isOpen) return null;

    function handleSubmit(e) {
        e.preventDefault();
        
        const employeeData = { 
            name: name, 
            email: email, 
            company: { name: company } 
        };
        
        onSave(employeeData);
    }

    return (
        <div className={styles.overlay}>
            <div className={styles.modal}>
                <div className={styles.header}>
                 
                    <h2 className={styles.title}>
                        {initialData ? "Edit Employee" : "Add New Employee"}
                    </h2>
                    <button onClick={onClose} className={styles.closeBtn}>&times;</button>
                </div>
                
                <form onSubmit={handleSubmit}>
                    <div className={styles.formGroup}>
                        <label className={styles.label}>Full Name</label>
                        <input type="text" required className={styles.input} value={name} onChange={e => setName(e.target.value)} />
                    </div>
                    
                    <div className={styles.formGroup}>
                        <label className={styles.label}>Email Address</label>
                        <input type="email" required className={styles.input} value={email} onChange={e => setEmail(e.target.value)} />
                    </div>
                    
                    <div className={styles.formGroup}>
                        <label className={styles.label}>Company</label>
                        <input type="text" required className={styles.input} value={company} onChange={e => setCompany(e.target.value)} />
                    </div>
                    
                    <div className={styles.actions}>
                        <button type="button" onClick={onClose} className={styles.btnCancel}>Cancel</button>
                    
                        <button type="submit" className="btn-primary">
                            {initialData ? "Save Changes" : "Save Employee"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}