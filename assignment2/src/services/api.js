const API_URL = import.meta.env.VITE_EXT_API;


const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));


export const fetchUsers = async () => {
  try {
    
    const localData = localStorage.getItem('cml_employees');
    if (localData) {
        await delay(600); 
        return JSON.parse(localData);
    }

  
    const response = await fetch(API_URL);
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const data = await response.json();
    

    localStorage.setItem('cml_employees', JSON.stringify(data));
    return data;
  } catch (error) {
    console.error("Failed to fetch users:", error);
    throw error;
  }
};


export const addEmployee = async (employeeData) => {
    await delay(600);
    const currentData = JSON.parse(localStorage.getItem('cml_employees')) || [];
    
 
    const newEmployee = { 
        ...employeeData, 
        id: Date.now() 
    }; 
    
    const updatedData = [newEmployee, ...currentData];
    localStorage.setItem('cml_employees', JSON.stringify(updatedData));
    
    return newEmployee;
};


export const updateEmployee = async (id, updatedFields) => {
    await delay(600);
    let currentData = JSON.parse(localStorage.getItem('cml_employees')) || [];
    
   
    currentData = currentData.map(emp => 
        emp.id === id ? { ...emp, ...updatedFields } : emp
    );
    
    localStorage.setItem('cml_employees', JSON.stringify(currentData));
    return currentData.find(emp => emp.id === id);
};


export const deleteEmployee = async (id) => {
    await delay(600);
    let currentData = JSON.parse(localStorage.getItem('cml_employees')) || [];
    

    currentData = currentData.filter(emp => emp.id !== id);
    
    localStorage.setItem('cml_employees', JSON.stringify(currentData));
    return id;
};