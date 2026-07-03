import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from 'react-redux';
import { 
    fetchEmployees, addEmployeeAsync, updateEmployeeAsync, deleteEmployeeAsync,
    setSearchQuery, setCurrentPage,
    selectPaginatedEmployees, selectTotalPages 
} from '../../redux/employee';
import EmployeeModal from "../../components/emp";
import Sidebar from "../../components/sidebar";
import styles from "./dashboard.module.css";

// Helper to generate initials (e.g., "Ashpreet Singh" -> "AS")
const getInitials = (name) => {
    if (!name) return '??';
    const parts = name.trim().split(' ');
    if (parts.length >= 2) return (parts[0][0] + parts[1][0]).toUpperCase();
    return parts[0][0].toUpperCase();
};

export default function Dashboard() {
    const { name } = useParams();
    const navigate = useNavigate();
    const dispatch = useDispatch();
    
    const user = useSelector((state) => state.auth.user);
    const { loading, error: err, statusText: status, searchQuery, currentPage } = useSelector((state) => state.employees);
    const currentEmployees = useSelector(selectPaginatedEmployees);
    const totalPages = useSelector(selectTotalPages);
    const isAdmin = user?.role === 'admin';
    
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [employeeToEdit, setEmployeeToEdit] = useState(null);

    useEffect(() => {
        dispatch(fetchEmployees());
    }, [dispatch]);

    const handleSaveEmployee = async (employeeData) => {
        try {
            if (employeeToEdit) {
                await dispatch(updateEmployeeAsync({ id: employeeToEdit.id, updatedData: employeeData })).unwrap();
            } else {
                await dispatch(addEmployeeAsync(employeeData)).unwrap();
            }
            setIsModalOpen(false);
            setEmployeeToEdit(null);
        } catch (error) {
            console.error("Failed to mutate ledger:", error);
        }
    };

    const handleDeleteEmployee = async (e, id) => {
        e.stopPropagation();
        if (window.confirm(`Are you sure you want to revoke this agent's access?`)) {
            dispatch(deleteEmployeeAsync(id));
        }
    };

    return (
        <div className={styles.layout}>
            <Sidebar isAdmin={isAdmin} onAddClick={() => { setEmployeeToEdit(null); setIsModalOpen(true); }} />
            
            <main className={styles.mainContent}>
                <header className={styles.topBar}>
                    <div>
                        <h1 className={styles.title}>Directory Overview</h1>
                        <p className={styles.subtitle}>Welcome back, {name ? decodeURIComponent(name) : 'Agent'}.</p>
                    </div>
                    <div className={styles.searchBox}>
                        <span className={styles.searchIcon}>🔍</span>
                        <input 
                            type="text" 
                            className={styles.searchInput} 
                            placeholder="Search agents..." 
                            value={searchQuery} 
                            onChange={(e) => dispatch(setSearchQuery(e.target.value))} 
                        />
                    </div>
                </header>

                {loading && (
                            <div className={styles.grid}>
                                {[...Array(6)].map((_, index) => (
                                    <div className={`${styles.card} ${styles.skeletonCard}`} key={`skel-${index}`}>
                                        <div className={styles.cardHeader}>
                                            <div className={styles.skeletonAvatar}></div>
                                            <div style={{ flex: 1 }}>
                                                <div className={`${styles.skeletonText} ${styles.skelTitle}`}></div>
                                                <div className={`${styles.skeletonText} ${styles.skelSubtitle}`}></div>
                                            </div>
                                        </div>
                                        <div className={`${styles.skeletonText} ${styles.skelBadge}`}></div>
                                        <div className={styles.cardActions}>
                                            <div className={`${styles.skeletonText} ${styles.skelBtn}`}></div>
                                            <div className={`${styles.skeletonText} ${styles.skelBtn}`}></div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                {err && <div className={styles.statusBox}><h2 style={{color: '#ef4444'}}>{err}</h2></div>}
                
                {!loading && !err && (
                    <>
                        <div className={styles.grid}>
                            {currentEmployees.length > 0 ? (
                                currentEmployees.map(user => (
                                    <div className={styles.card} key={user.id} onClick={() => navigate(`/employee/${user.id}`)}>
                                        <div className={styles.cardHeader}>
                                            <div className={styles.avatar}>{getInitials(user.name)}</div>
                                            <div className={styles.cardTitles}>
                                                <h3>{user.name}</h3>
                                                <p>{user.email}</p>
                                            </div>
                                        </div>
                                        
                                        <div className={styles.badge}>{user.company?.name || 'Independent'}</div>
                                        
                                        {isAdmin && (
                                            <div className={styles.cardActions}>
                                                <button className={styles.editBtn} onClick={(e) => { e.stopPropagation(); setEmployeeToEdit(user); setIsModalOpen(true); }}>Edit</button>
                                                <button className={styles.deleteBtn} onClick={(e) => handleDeleteEmployee(e, user.id)}>Revoke</button>
                                            </div>
                                        )}
                                    </div>
                                ))
                            ) : (
                                <div className={styles.statusBox}><p>No records located for query "{searchQuery}"</p></div>
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
            </main>
            
            <EmployeeModal isOpen={isModalOpen} onClose={() => { setIsModalOpen(false); setEmployeeToEdit(null); }} onSave={handleSaveEmployee} initialData={employeeToEdit} />
        </div>
    );
}