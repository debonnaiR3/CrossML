import {useState,useEffect} from "react";
import {fetchUsers} from '../../services/api';
import styles from "./dashboard.module.css"


export default function Dashboard(){
    const [users,setUsers]=useState([]);
    const [loading,setLoading]=useState(true);
    const [search,setSearch]=useState('');
    const [err,setErr]=useState(null);
    useEffect(()=>{
        const load=async()=>{
            try{
                setLoading(true);
                const data=await fetchUsers();
                setUsers(data);
            }catch(err){
                setErr('Unable to load data.');
                console.error(err);
            }finally{
                setLoading(false);
            }
        };
        load();

    },[]);
    // search by name or email or company
    const searchedUser=users.filter(user=>
        user.name.toLowerCase().includes(search.toLowerCase()) ||
        user.email.toLowerCase().includes(search.toLowerCase()) ||
        user.company.name.toLowerCase.includes(search.toLowerCase())
    );
    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <h1 className={styles.title}>Employee Directory</h1>

                <input type="text" className={styles.input} placeholder="Search here..." value={search} onChange={(e)=>setSearch(e.target.value)}/> 
            </div>

            {loading &&(
                <div className={styles.state}>
                    <h2>Syncing data...</h2>
                </div>
            )}
            {err &&(
                <div className={styles.state}>
                    <h2 className={styles.error}>{err}</h2>
                    <button className="btn-primary" style={{marginTop:'16px'}} onClick={()=>window.location.reload()}>Retry</button>
                </div>
            )}
            {!loading && !err &&(
                <div className={styles.grid}>
                    {searchedUser.length>0?(searchedUser.map(user=>(
                        <div className={styles.card} key={user.id}>
                            <h3 className={styles.cardname}>{user.name}</h3>
                            <p className={styles.cardmail}>{user.email}</p>
                            <div className={styles.comp}>{user.company.name}</div>

                        </div>
                    )
                )
            ):(
                <div className="statecont"></div>
            )}
                </div>
            )}
        </div>
    );
}