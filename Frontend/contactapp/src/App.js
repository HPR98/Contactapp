import './App.css';
import React, { useEffect, useState} from 'react';

const getConntacts = async () => {
  try{
    const response = await fetch("http://127.0.0.1:5000/get_contacts")

    if(!response.ok){
      throw new Error ("Could not fetch data from endpoint")
    }
    const data  = await response.json()
    console.log(data)
    return data
  } catch(error){
    console.error(error)
  }
}

function App() {

  const [contacts, setContacts] = useState([])

  useEffect(() => {
    const fetchConntacts = async () => {
      const data = await getConntacts()
      setContacts(data)
    }
    fetchConntacts()
  }, [])

  return (
    <div>
      <h1>Test</h1>
      <table>
        <thead>
          <tr>
            <th>First Name</th>
            <th>Last Name</th>
            <th>Email</th>
          </tr>
        </thead>
        <tbody>
          {Object.keys(contacts).map(key => {
            const { first_name, last_name, email } = contacts[key];
            return (
              <tr key={key}>
                <td>{first_name}</td>
                <td>{last_name}</td>
                <td>{email}</td>
              </tr>
            )
          })}
        </tbody>
      </table>
      
    </div>

  );
}

export default App;