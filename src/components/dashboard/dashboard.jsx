import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../../redux/auth';
import { 
    fetchEmployees, addEmployeeAsync, updateEmployeeAsync, deleteEmployeeAsync,
    setSearchQuery, setCurrentPage,
    selectPaginatedEmployees, selectTotalPages 
} from '../../redux/employee';
import EmployeeModal from "./emp";
import styles from "./dashboard.module.css";

export default function Dashboard() {
    const { name } = useParams();
    const navigate = useNavigate();
    const dispatch = useDispatch();
    
    // REDUX STORE STATE & SELECTORS
    const user = useSelector((state) => state.auth.user);
    const { loading, error: err, statusText: status, searchQuery, currentPage } = useSelector((state) => state.employees);
    const currentEmployees = useSelector(selectPaginatedEmployees);
    const totalPages = useSelector(selectTotalPages);
    const isAdmin = user?.role === 'admin';
    
    // UI-ONLY LOCAL STATE (Strictly permitted by prompt!)
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [employeeToEdit, setEmployeeToEdit] = useState(null);
    const [toast, setToast] = useState({ visible: false, message: '', type: '' });

    const showToast = (message, type = 'error') => {
        setToast({ visible: true, message, type });
        setTimeout(() => setToast({ visible: false, message: '', type: '' }), 4000);
    };

    useEffect(() => {
        dispatch(fetchEmployees());
    }, [dispatch]);

    function handleLogout() {
        dispatch(logout());
        navigate('/login');
    }
    
    const openAddModal = () => {
        setEmployeeToEdit(null); 
        setIsModalOpen(true);
    };

    const openEditModal = (employee) => {
        setEmployeeToEdit(employee);
        setIsModalOpen(true);
    };

    const handleSaveEmployee = async (employeeData) => {
        try {
            if (employeeToEdit) {
                await dispatch(updateEmployeeAsync({ id: employeeToEdit.id, updatedData: employeeData })).unwrap();
                showToast("Agent dossier updated successfully.", "success");
            } else {
                await dispatch(addEmployeeAsync(employeeData)).unwrap();
                showToast("New agent registered successfully.", "success");
            }
            setIsModalOpen(false);
            setEmployeeToEdit(null);
        } catch (error) {
            showToast("Failed to mutate ledger data.");
        }
    };

    const handleDeleteEmployee = async (id, employeeName) => {
        if (window.confirm(`Are you sure you want to revoke gateway access for ${employeeName}?`)) {
            try {
                await dispatch(deleteEmployeeAsync(id)).unwrap();
                showToast(`Access revoked for ${employeeName}.`, "success");
            } catch (error) {
                showToast("Failed to delete agent from ledger.");
            }
        }
    };

    return (
        <div className={styles.container}>
            {toast.visible && (
                <div style={{
                    padding: '12px 20px', marginBottom: '24px', borderRadius: 'var(--radius-card)',
                    backgroundColor: toast.type === 'success' ? '#dcfce7' : '#fee2e2',
                    color: toast.type === 'success' ? '#166534' : '#991b1b',
                    border: `1px solid ${toast.type === 'success' ? '#bbf7d0' : '#f87171'}`,
                    fontWeight: '500', fontSize: '14px', display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)'
                }}>
                    <span>{toast.message}</span>
                    <button onClick={() => setToast({ visible: false })} style={{ background: 'none', border: 'none', cursor: 'pointer', fontWeight: 'bold', color: 'inherit' }}>✕</button>
                </div>
            )}

            <div className={styles.header}>
                <h1 className={styles.title}>
                    Welcome, {name ? decodeURIComponent(name) : 'Agent'}!
                </h1>
                <div className={styles.headerControls}>
                    <input 
                        type="text" className={styles.input} placeholder="Search directory..." 
                        value={searchQuery} onChange={(e) => dispatch(setSearchQuery(e.target.value))} 
                    /> 
                    {isAdmin && <button onClick={openAddModal} className="btn-primary">+ Add Agent</button>}
                    <button onClick={handleLogout} className={`btn-primary ${styles.logoutBtn}`}>Logout</button>
                </div>
            </div>

            {loading && <div className={styles.state}><h2>{status} secure ledger...</h2></div>}
            
            {err && (
                <div className={styles.state}>
                    <h2 className={styles.error}>{err}</h2>
                    <button className="btn-primary" style={{ marginTop: '16px' }} onClick={() => dispatch(fetchEmployees())}>Retry Connection</button>
                </div>
            )}
            
            {!loading && !err && (
                <>
                    <div className={styles.grid}>
                        {currentEmployees.length > 0 ? (
                            currentEmployees.map(user => (
                                <div className={styles.card} key={user.id}>
                                    {isAdmin && (
                                        <div className={styles.cardActions}>
                                            <button className={`${styles.actionBtn} ${styles.editBtn}`} onClick={(e) => { e.stopPropagation(); openEditModal(user); }}>Edit</button>
                                            <button className={`${styles.actionBtn} ${styles.deleteBtn}`} onClick={(e) => { e.stopPropagation(); handleDeleteEmployee(user.id, user.name); }}>Delete</button>
                                        </div>
                                    )}
                                    <div onClick={() => navigate(`/employee/${user.id}`)} style={{ cursor: 'pointer', paddingRight: '90px' }}>
                                        <h3 className={styles.cardname}>{user.name}</h3>
                                        <p className={styles.cardmail}>{user.email}</p>
                                        <div className={styles.comp}>{user.company?.name || 'N/A'}</div>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className={styles.state} style={{ gridColumn: '1 / -1' }}><p>No records located for query "{searchQuery}"</p></div>
                        )}
                    </div>

                    {totalPages > 1 && (
                        <div className={styles.pagination}>
                            <button onClick={() => dispatch(setCurrentPage(Math.max(currentPage - 1, 1)))} disabled={currentPage === 1} className={styles.pageBtn}>Previous</button>
                            <span className={styles.pageInfo}>Page {currentPage} of {totalPages}</span>
                            <button onClick={() => dispatch(setCurrentPage(Math.min(currentPage + 1, totalPages)))} disabled={currentPage === totalPages} className={styles.pageBtn}>Next</button>
                        </div>
                    )}
                </>
            )}

            <EmployeeModal isOpen={isModalOpen} onClose={() => { setIsModalOpen(false); setEmployeeToEdit(null); }} onSave={handleSaveEmployee} initialData={employeeToEdit} />
        </div>
    );
}