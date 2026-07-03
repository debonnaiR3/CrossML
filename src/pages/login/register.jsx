import styles from './login.module.css'; 
import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useDispatch } from 'react-redux';
import { register } from '../../redux/auth';

export default function Register() {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [role, setRole] = useState("viewer");
    
    // Inline validation state
    const [errors, setErrors] = useState({ name: '', email: '', password: '', general: '' });
    const [success, setSuccess] = useState(false);

    function handleRegister(e) {
        e.preventDefault();
        
        const newErrors = { name: '', email: '', password: '', general: '' };
        let isValid = true;

        // 1. Inline Validation Rules
        if (!name.trim()) {
            newErrors.name = 'Full name is required.';
            isValid = false;
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!email.trim()) {
            newErrors.email = 'Email address is required.';
            isValid = false;
        } else if (!emailRegex.test(email.trim())) {
            newErrors.email = 'Please enter a valid email format.';
            isValid = false;
        }

        if (!password) {
            newErrors.password = 'Password is required.';
            isValid = false;
        } else if (password.length < 6) {
            newErrors.password = 'Password must be at least 6 characters.';
            isValid = false;
        }

        setErrors(newErrors);

        if (!isValid) return;

        // 2. Duplicate Check
        const existingAccounts = JSON.parse(localStorage.getItem('cml_accounts')) || [];
        const isDuplicate = existingAccounts.some(user => user.email.toLowerCase() === email.toLowerCase());

        if (isDuplicate) {
            setErrors(prev => ({ ...prev, general: "An account with this email already exists." }));
            return;
        }

        // 3. Dispatch & Success UI (No alerts!)
        const newUser = { name, email, password, role };
        dispatch(register(newUser));
        
        setSuccess(true);
        setTimeout(() => {
            navigate("/login");
        }, 2000);
    }

    return (
        <div className={styles.container}>
            <div className={styles.card}>
                <div className={styles.logocont}>
                    <div className={styles.logo}></div>
                    <h2 style={{ fontSize: '22px', fontWeight: '700', letterSpacing: '-0.5px' }}>
                        cross<span style={{ color: 'var(--cml-red)' }}>ml</span>
                    </h2>
                </div>

                <h1 className={styles.title}>Create an Account</h1>
                <p className={styles.subtitle}>Join the employee directory</p>
                
                {success ? (
                    <div style={{ padding: '20px', backgroundColor: '#dcfce7', color: '#166534', borderRadius: '8px', textAlign: 'center', fontWeight: '500', marginBottom: '20px' }}>
                        Account created successfully! Redirecting to login...
                    </div>
                ) : (
                    <form onSubmit={handleRegister} noValidate>
                        <div className={styles.formchild} style={{ marginBottom: '16px' }}>
                            <label className={styles.label}>Full Name</label>
                            <input 
                                type="text" 
                                className={`${styles.input} ${errors.name ? styles.inputError : ''}`} 
                                placeholder="Ashpreet Singh" 
                                value={name} 
                                onChange={(e) => { setName(e.target.value); setErrors(prev => ({ ...prev, name: '' })); }} 
                            />
                            {errors.name && <p style={{ color: 'var(--cml-red)', fontSize: '12px', marginTop: '4px' }}>{errors.name}</p>}
                        </div>
                        
                        <div className={styles.formchild} style={{ marginBottom: '16px' }}>
                            <label className={styles.label}>Email</label>
                            <input 
                                type="email" 
                                className={`${styles.input} ${errors.email ? styles.inputError : ''}`} 
                                placeholder="ash@crossml.com" 
                                value={email} 
                                onChange={(e) => { setEmail(e.target.value); setErrors(prev => ({ ...prev, email: '' })); }} 
                            />
                            {errors.email && <p style={{ color: 'var(--cml-red)', fontSize: '12px', marginTop: '4px' }}>{errors.email}</p>}
                        </div>
                        
                        <div className={styles.formchild} style={{ marginBottom: '16px' }}>
                            <label className={styles.label}>Password</label>
                            <input 
                                type="password" 
                                className={`${styles.input} ${errors.password ? styles.inputError : ''}`} 
                                placeholder="••••••••" 
                                value={password} 
                                onChange={(e) => { setPassword(e.target.value); setErrors(prev => ({ ...prev, password: '' })); }} 
                            />
                            {errors.password && <p style={{ color: 'var(--cml-red)', fontSize: '12px', marginTop: '4px' }}>{errors.password}</p>}
                        </div>

                        <div className={styles.formchild} style={{ marginBottom: '24px' }}>
                            <label className={styles.label}>Access Role</label>
                            <select className={styles.input} value={role} onChange={(e) => setRole(e.target.value)} style={{ backgroundColor: 'white', cursor: 'pointer' }}>
                                <option value="viewer">Viewer (Read-Only Directory)</option>
                                <option value="admin">Admin (Full Gateway Access)</option>
                            </select>
                        </div>

                        {errors.general && <p style={{ color: 'var(--cml-red)', fontSize: '13px', fontWeight: '500', marginBottom: '12px', textAlign: 'center' }}>{errors.general}</p>}

                        <button type="submit" className={`btn-primary ${styles.button}`}>Register</button>
                    </form>
                )}

                <div style={{ marginTop: '24px', textAlign: 'center', fontSize: '14px' }}>
                    <p style={{ color: 'var(--cml-gray)' }}>
                        Already have an account? <Link to="/login" style={{ color: 'var(--cml-dark)', fontWeight: '600', textDecoration: 'none' }}>Sign in</Link>
                    </p>
                </div>
            </div>
        </div>
    );
}