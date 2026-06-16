import { useState, useEffect, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { fetchUsers, addEmployee, deleteEmployee, updateEmployee } from '../../services/api';
import { AuthContext } from "../../services/authContext";
import EmployeeModal from "./emp";
import styles from "./dashboard.module.css";

export default function Dashboard() {
    const { name } = useParams();
    const navigate = useNavigate();
    const { logout } = useContext(AuthContext);
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [err, setErr] = useState(null);
    const [status, setStatus] = useState('Syncing');
    
    
    const [currentPage, setCurrentPage] = useState(1);
    const employeesPerPage = 6; 

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [employeeToEdit, setEmployeeToEdit] = useState(null);

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
                setErr('Unable to load data.');
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
            } else {
                const savedEmployee = await addEmployee(employeeData);
                setUsers(prevUsers => [savedEmployee, ...prevUsers]);
            }
            setIsModalOpen(false);
            setEmployeeToEdit(null);
        } catch (error) {
            alert("Failed to save employee.");
        }
    };

    const handleDeleteEmployee = async (id, employeeName) => {
        if (window.confirm(`Are you sure you want to delete ${employeeName}?`)) {
            try {
                await deleteEmployee(id);
                setUsers(prevUsers => prevUsers.filter(user => user.id !== id));
            } catch (error) {
                alert("Failed to delete employee.");
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
            <div className={styles.header}>
                <h1 className={styles.title}>Welcome, {name || 'User'}!</h1>
                <div className={styles.headerControls}>
                    <input 
                        type="text" className={styles.input} placeholder="Search here..." 
                        value={search} onChange={(e) => setSearch(e.target.value)}
                    /> 
                    <button onClick={openAddModal} className="btn-primary">
                        + Add Employee
                    </button>
                    <button onClick={handleLogout} className={`btn-primary ${styles.logoutBtn}`}>
                        Logout
                    </button>
                </div>
            </div>

            {loading && <div className={styles.state}><h2>{status} data...</h2></div>}
            {err && <div className={styles.state}><h2 className={styles.error}>{err}</h2><button className="btn-primary" style={{ marginTop: '16px' }} onClick={() => window.location.reload()}>Retry</button></div>}
            
            {!loading && !err && (
                <>
                    <div className={styles.grid}>
                        {currentEmployees.length > 0 ? (
                            currentEmployees.map(user => (
                                <div className={styles.card} key={user.id}>
                                    <div className={styles.cardActions}>
                                        <button 
                                            className={`${styles.actionBtn} ${styles.editBtn}`}
                                            onClick={() => openEditModal(user)}
                                        >
                                            Edit
                                        </button>
                                        <button 
                                            className={`${styles.actionBtn} ${styles.deleteBtn}`}
                                            onClick={() => handleDeleteEmployee(user.id, user.name)}
                                        >
                                            Delete
                                        </button>
                                    </div>
                                    <h3 className={styles.cardname}>{user.name}</h3>
                                    <p className={styles.cardmail}>{user.email}</p>
                                    <div className={styles.comp}>{user.company?.name || 'N/A'}</div>
                                </div>
                            ))
                        ) : (
                            <div className={styles.state} style={{ gridColumn: '1 / -1' }}>
                                <p>No employees matching "{search}"</p>   
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