import styles from './login.module.css'
import {useNavigate} from "react-router-dom";


export default function Login(){
    const navigate=useNavigate();

    function handleLogin(e){
        e.preventDefault();
        let auth=true;
        if(auth){

            navigate('/dashboard');
        }
    };
    return (
        <div className={styles.container}>
            <div className={styles.card}>
                <div className={styles.logocont}>
                    <div className={styles.logo}></div>
                    <h2 style={{ fontSize: '22px', fontWeight: '700', letterSpacing: '-0.5px' }}>cross<span style={{ color: 'var(--cml-red)' }}>ml</span></h2>
                </div>

                <h1 className={styles.title}>Welcome back</h1>
                <p className={styles.subtitle}>Enter your credentials</p>
                <form onSubmit={handleLogin}>
                <div className={styles.formchild}>
                        <label className={styles.label}>Email</label>
                        <input type="email" className={styles.input} placeholder="name@crossml.com" required/>

                    </div>
                    <div className="formchild">
                        <label className={styles.label}>Password</label>
                        <input type="password" className={styles.input} placeholder="****" required />
                    </div>
                    <button type="submit" className={`btn-primary ${styles.button}`}>Sign in</button>
                </form>
            </div>
        </div>
    );

}