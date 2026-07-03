import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import Sidebar from '../../components/sidebar';
import styles from './empDetails.module.css';

const getInitials = (name) => {
    if (!name) return '??';
    const parts = name.trim().split(' ');
    return parts.length >= 2 ? (parts[0][0] + parts[1][0]).toUpperCase() : parts[0][0].toUpperCase();
};

export default function EmployeeDetail() {
    const { id } = useParams();
    const navigate = useNavigate();
    
    const userRole = useSelector((state) => state.auth.user?.role);
    const isAdmin = userRole === 'admin';
    const loading = useSelector((state) => state.employees.loading);
    const employee = useSelector((state) => 
        state.employees.items.find(emp => emp.id.toString() === id.toString())
    );

    return (
        <div className={styles.layout}>
            <Sidebar isAdmin={isAdmin} onAddClick={() => navigate('/dashboard/agent')} />
            
            <main className={styles.mainContent}>
                <button onClick={() => navigate(-1)} className={styles.backBtn}>
                    &larr; Back to Directory
                </button>

                {loading && <div className={styles.statusBox}>Retrieving secure records...</div>}
                {!loading && !employee && <div className={styles.statusBox} style={{color: '#ef4444'}}>Record not found.</div>}

                {!loading && employee && (
                    <div className={styles.profileCard}>
                        <div className={styles.headerBanner}></div>
                        
                        <div className={styles.profileHeader}>
                            <div className={styles.hugeAvatar}>{getInitials(employee.name)}</div>
                            <div className={styles.titleArea}>
                                <h1>{employee.name}</h1>
                                <span className={styles.badge}>🏢 {employee.company?.name || 'Independent Contractor'}</span>
                            </div>
                        </div>
                        
                        <div className={styles.metaGrid}>
                            <div className={styles.metaBox}>
                                <span className={styles.label}>Secure Email</span>
                                <span className={styles.val}>{employee.email}</span>
                            </div>
                            <div className={styles.metaBox}>
                                <span className={styles.label}>Direct Line</span>
                                <span className={styles.val}>{employee.phone || 'Unlisted'}</span>
                            </div>
                            <div className={styles.metaBox}>
                                <span className={styles.label}>Gateway Website</span>
                                <span className={styles.val}>{employee.website || 'N/A'}</span>
                            </div>
                            <div className={styles.metaBox}>
                                <span className={styles.label}>Ledger Hash (ID)</span>
                                <span className={styles.val} style={{fontFamily: 'monospace', color: '#64748b'}}>{employee.id}</span>
                            </div>
                        </div>
                    </div>
                )}
            </main>
        </div>
    );
}