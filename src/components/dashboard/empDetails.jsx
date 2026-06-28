import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import styles from './empDetails.module.css';

export default function EmployeeDetail() {
    const { id } = useParams();
    const navigate = useNavigate();
    
    // Pull the target employee directly out of the RTK state array
    const employee = useSelector((state) => 
        state.employees.items.find(emp => emp.id.toString() === id.toString())
    );
    const loading = useSelector((state) => state.employees.loading);

    return (
        <div className={styles.container}>
            <div className={styles.topControls}>
                <button onClick={() => navigate(-1)} className={styles.backBtn}>&larr; Return to Dashboard</button>
            </div>

            {loading && <div className={styles.status}>Retrieving secure records...</div>}
            {!loading && !employee && <div className={styles.errorText}>Failed to decrypt agent dossier. Record not found.</div>}

            {!loading && employee && (
                <div className={styles.card}>
                    <div className={styles.avatarHolder}>❖</div>
                    <h1 className={styles.name}>{employee.name}</h1>
                    <div className={styles.companyBadge}>🏢 {employee.company?.name || 'Independent Contractor'}</div>
                    <hr className={styles.divider} />
                    <div className={styles.metaGrid}>
                        <div className={styles.metaRow}><span className={styles.label}>Secure Email</span><span className={styles.val}>{employee.email}</span></div>
                        <div className={styles.metaRow}><span className={styles.label}>Direct Line (Phone)</span><span className={styles.val}>{employee.phone || 'Unlisted'}</span></div>
                        <div className={styles.metaRow}><span className={styles.label}>Assigned Gateway (Website)</span><span className={styles.val}>{employee.website || 'N/A'}</span></div>
                        <div className={styles.metaRow}><span className={styles.label}>Ledger Hash (ID)</span><span className={styles.val} style={{fontFamily: 'monospace'}}>{employee.id}</span></div>
                    </div>
                </div>
            )}
        </div>
    );
}