// src/services/api.js

const API_URL = 'https://jsonplaceholder.typicode.com/users';

export const fetchUsers = async () => {
  try {
    const response = await fetch(API_URL);
    
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Failed to fetch users:", error);
    throw error;
  }
};