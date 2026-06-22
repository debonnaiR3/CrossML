import styles from './login.module.css'; 
import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";

export default function Register() {
    const navigate = useNavigate();
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [err, setErr] = useState("");

    function handleRegister(e) {
        e.preventDefault();
        setErr("");

        if (!name || !email || !password) return;

        
        const existingAccounts = JSON.parse(localStorage.getItem('cml_accounts')) || [];

    
        const isDuplicate = existingAccounts.some(
            user => user.email.toLowerCase() === email.toLowerCase()
        );

        if (isDuplicate) {
            setErr("An account with this email already exists.");
            return;
        }

     
        const newUser = { name, email, password };
        existingAccounts.push(newUser);
        localStorage.setItem('cml_accounts', JSON.stringify(existingAccounts));

        alert("Account created successfully! You can now sign in.");
        navigate("/login"); 
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
                
                <form onSubmit={handleRegister}>
                    <div className={styles.formchild} style={{ marginBottom: '16px' }}>
                        <label className={styles.label}>Full Name</label>
                        <input 
                            type="text" 
                            className={styles.input} 
                            placeholder="Ashpreet Singh" 
                            required 
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                        />
                    </div>
                    <div className={styles.formchild} style={{ marginBottom: '16px' }}>
                        <label className={styles.label}>Email</label>
                        <input 
                            type="email" 
                            className={styles.input} 
                            placeholder="ash@crossml.com" 
                            required 
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                    </div>
                    <div className={styles.formchild}>
                        <label className={styles.label}>Password</label>
                        <input 
                            type="password" 
                            className={styles.input} 
                            placeholder="••••••••" 
                            required 
                            minLength="6"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                    </div>

                    
                    {err && <p style={{ color: 'var(--cml-red)', fontSize: '13px', fontWeight: '500', marginBottom: '12px' }}>{err}</p>}

                    <button type="submit" className={`btn-primary ${styles.button}`}>Register</button>
                </form>

                <div style={{ marginTop: '24px', textAlign: 'center', fontSize: '14px' }}>
                    <p style={{ color: 'var(--cml-gray)' }}>
                        Already have an account? <Link to="/login" style={{ color: 'var(--cml-dark)', fontWeight: '600', textDecoration: 'none' }}>Sign in</Link>
                    </p>
                </div>
            </div>
        </div>
    );
}