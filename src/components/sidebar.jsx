
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { logout } from '../redux/auth';
import styles from './sidebar.module.css';

export default function Sidebar({ isAdmin, onAddClick }) {
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const handleLogout = () => {
        dispatch(logout());
        navigate('/login');
    };

    return (
        <aside className={styles.sidebar}>
            <div className={styles.brand}>
                <div className={styles.logoBox}>❖</div>
                <h2>cross<span className={styles.accent}>ml</span></h2>
            </div>
            
            <nav className={styles.navMenu}>
                <div className={`${styles.navItem} ${styles.active}`}>
                    <span className={styles.icon}>📇</span>
                    <span className={styles.navLabel}>Directory</span>
                </div>
                {isAdmin && (
                    <div className={styles.navItem} onClick={onAddClick}>
                        <span className={styles.icon}>+</span>
                        <span className={styles.navLabel}>Add Agent</span>
                    </div>
                )}
            </nav>

            <div className={styles.footer}>
                <button onClick={handleLogout} className={styles.logoutBtn}>
                    <span className={styles.icon}>🚪</span>
                    <span className={styles.navLabel}>Sign Out</span>
                </button>
            </div>
        </aside>
    );
}