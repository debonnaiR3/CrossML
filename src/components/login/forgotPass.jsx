import styles from './login.module.css';
import { useState } from "react";
import { Link } from "react-router-dom";

export default function ForgotPassword() {
    const [email, setEmail] = useState("");
    const [submitted, setSubmitted] = useState(false);

    function handleSubmit(e) {
        e.preventDefault();
        
        
        if (email) {
            setSubmitted(true);
        }
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

                <h1 className={styles.title}>Reset Password</h1>
                
                {!submitted ? (
                    <>
                        <p className={styles.subtitle}>Enter your email to receive a reset link</p>
                        <form onSubmit={handleSubmit}>
                            <div className={styles.formchild}>
                                <label className={styles.label}>Email</label>
                                <input 
                                    type="email" 
                                    className={styles.input} 
                                    placeholder="name@crossml.com" 
                                    required 
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                />
                            </div>
                            <button type="submit" className={`btn-primary ${styles.button}`}>Send Reset Link</button>
                        </form>
                    </>
                ) : (
                    <div style={{ textAlign: 'center', padding: '20px 0' }}>
                        <p style={{ color: 'green', fontWeight: '500', marginBottom: '16px' }}>
                            ✓ Reset link sent to {email}
                        </p>
                        <p className={styles.subtitle}>Please check your inbox.</p>
                    </div>
                )}

                <div style={{ marginTop: '24px', textAlign: 'center', fontSize: '14px' }}>
                    <Link to="/login" style={{ color: 'var(--cml-dark)', fontWeight: '600', textDecoration: 'none' }}>
                        &larr; Back to Login
                    </Link>
                </div>
            </div>
        </div>
    );
}