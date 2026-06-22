import { useState, useEffect, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { fetchUsers, addEmployee, deleteEmployee, updateEmployee } from '../../services/api';
import { AuthContext } from "../../services/authContext";
import EmployeeModal from "./emp";
import styles from "./dashboard.module.css";

export default function Dashboard() {
    const { name } = useParams();
    const navigate = useNavigate();
    const { user,logout } = useContext(AuthContext);
    const isAdmin = user?.role === 'admin';
    
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [err, setErr] = useState(null);
    const [status, setStatus] = useState('Syncing');
    
   
    const [currentPage, setCurrentPage] = useState(1);
    const employeesPerPage = 6; 

    
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [employeeToEdit, setEmployeeToEdit] = useState(null);

  
    const [toast, setToast] = useState({ visible: false, message: '', type: '' });

    const showToast = (message, type = 'error') => {
        setToast({ visible: true, message, type });
        setTimeout(() => setToast({ visible: false, message: '', type: '' }), 4000);
    };

  
    useEffect(() => {
        let t1, t2;
        const load = async () => {
            try {
                setLoading(true);
                const data = await fetchUsers();
                t1 = setTimeout(() => setStatus('Loading'), 1000);
                t2 = setTimeout(() => {
                    setUsers(data);
                    setLoading(false);
                }, 2000);
            } catch (err) {
                setErr('Unable to load workspace data.');
                setLoading(false);
            }
        };
        load();
        return () => { clearTimeout(t1); clearTimeout(t2); }
    }, []);

    useEffect(() => {
        setCurrentPage(1);
    }, [search]);

    function handleLogout() {
        logout();
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
                const updatedEmployee = await updateEmployee(employeeToEdit.id, employeeData);
                setUsers(prevUsers => prevUsers.map(u => u.id === employeeToEdit.id ? updatedEmployee : u));
                showToast("Agent dossier updated successfully.", "success");
            } else {
                const savedEmployee = await addEmployee(employeeData);
                setUsers(prevUsers => [savedEmployee, ...prevUsers]);
                showToast("New agent registered successfully.", "success");
            }
            setIsModalOpen(false);
            setEmployeeToEdit(null);
        } catch (error) {
            showToast("Failed to mutate ledger data. Please check your connection."); 
        }
    };

    const handleDeleteEmployee = async (id, employeeName) => {
        if (window.confirm(`Are you sure you want to revoke gateway access for ${employeeName}?`)) {
            try {
                await deleteEmployee(id);
                setUsers(prevUsers => prevUsers.filter(user => user.id !== id));
                showToast(`Access revoked for ${employeeName}.`, "success");
            } catch (error) {
                showToast("Failed to delete agent from ledger."); 
            }
        }
    };

   
    const searchedUser = users.filter(user =>
        user.name?.toLowerCase().includes(search.toLowerCase()) ||
        user.email?.toLowerCase().includes(search.toLowerCase()) ||
        user.company?.name?.toLowerCase().includes(search.toLowerCase())
    );

   
    const indexOfLastEmployee = currentPage * employeesPerPage;
    const indexOfFirstEmployee = indexOfLastEmployee - employeesPerPage;
    const currentEmployees = searchedUser.slice(indexOfFirstEmployee, indexOfLastEmployee);
    const totalPages = Math.ceil(searchedUser.length / employeesPerPage);

    return (
        <div className={styles.container}>
            {toast.visible && (
                <div style={{
                    padding: '12px 20px',
                    marginBottom: '24px',
                    borderRadius: 'var(--radius-card)',
                    backgroundColor: toast.type === 'success' ? '#dcfce7' : '#fee2e2',
                    color: toast.type === 'success' ? '#166534' : '#991b1b',
                    border: `1px solid ${toast.type === 'success' ? '#bbf7d0' : '#f87171'}`,
                    fontWeight: '500',
                    fontSize: '14px',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center'
                }}>
                    <span>{toast.message}</span>
                    <button onClick={() => setToast({ visible: false })} style={{ background: 'none', border: 'none', cursor: 'pointer', fontWeight: 'bold' }}>✕</button>
                </div>
            )}
            <div className={styles.header}>
              
                <h1 className={styles.title}>
                    Welcome, {name ? decodeURIComponent(name) : 'Agent'}!
                </h1>
                <div className={styles.headerControls}>
                    <input 
                        type="text" className={styles.input} placeholder="Search directory..." 
                        value={search} onChange={(e) => setSearch(e.target.value)}
                    /> 
                    {isAdmin && (
                        <button onClick={openAddModal} className="btn-primary">
                            + Add Agent
                        </button>
                    )}
                    <button onClick={handleLogout} className={`btn-primary ${styles.logoutBtn}`}>
                        Logout
                    </button>
                </div>
            </div>

            {loading && <div className={styles.state}><h2>{status} secure ledger...</h2></div>}
            
            {err && (
                <div className={styles.state}>
                    <h2 className={styles.error}>{err}</h2>
                    <button className="btn-primary" style={{ marginTop: '16px' }} onClick={() => window.location.reload()}>
                        Retry Connection
                    </button>
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
                                        <button 
                                            className={`${styles.actionBtn} ${styles.editBtn}`}
                                            onClick={(e) => { e.stopPropagation(); openEditModal(user); }}
                                        >
                                            Edit
                                        </button>
                                        <button 
                                            className={`${styles.actionBtn} ${styles.deleteBtn}`}
                                            onClick={(e) => { e.stopPropagation(); handleDeleteEmployee(user.id, user.name); }}
                                        >
                                            Delete
                                        </button>
                                    </div>
                                    )}
                                    
                                  
                                    <div 
                                        onClick={() => navigate(`/employee/${user.id}`)}
                                        style={{ cursor: 'pointer', paddingRight: '90px' }} 
                                    >
                                        <h3 className={styles.cardname}>{user.name}</h3>
                                        <p className={styles.cardmail}>{user.email}</p>
                                        <div className={styles.comp}>{user.company?.name || 'N/A'}</div>
                                    </div>

                                </div>
                            ))
                        ) : (
                            <div className={styles.state} style={{ gridColumn: '1 / -1' }}>
                                <p>No records located for query "{search}"</p>   
                            </div>
                        )}
                    </div>

                  
                    {totalPages > 1 && (
                        <div className={styles.pagination}>
                            <button 
                                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))} 
                                disabled={currentPage === 1}
                                className={styles.pageBtn}
                            >
                                Previous
                            </button>
                            <span className={styles.pageInfo}>
                                Page {currentPage} of {totalPages}
                            </span>
                            <button 
                                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))} 
                                disabled={currentPage === totalPages}
                                className={styles.pageBtn}
                            >
                                Next
                            </button>
                        </div>
                    )}
                </>
            )}

            <EmployeeModal 
                isOpen={isModalOpen} 
                onClose={() => { setIsModalOpen(false); setEmployeeToEdit(null); }} 
                onSave={handleSaveEmployee} 
                initialData={employeeToEdit}
            />
        </div>
    );
}