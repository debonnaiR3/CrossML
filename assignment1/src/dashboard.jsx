import {useState,useEffect} from "react";
import {fetchUsers} from './services/api';

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
    // search by name or email
    const searchedUser=users.filter(user=>
        user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase())
    );
    return (
        <div className="container">
            <div className="header">
                <h1 className="title">Employee Directory</h1>

                <input type="text" placeholder="Search here..." className="search" value={search} onChange={(e)=>setSearch(e.target.value)}/> 
            </div>

            {loading &&(
                <div className="statecont">
                    <h2>Syncing data...</h2>
                </div>
            )}
            {err &&(
                <div className="statecont">
                    <h2 className="error">{err}</h2>
                    <button className="btn-primary" style={{marginTop:'16px'}} onClick={()=>window.location.reload()}>Retry</button>
                </div>
            )}
            {!loading && !err &&(
                <div className="grid">
                    {searchedUser.length>0?(searchedUser.map(user=>(
                        <div className="card" key={user.id}>
                            <h3 className="cardname">{user.name}</h3>
                            <p className="cardemail">{user.email}</p>
                            <div className="comp">{user.company.name}</div>

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