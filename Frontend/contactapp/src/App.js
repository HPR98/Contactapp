import './App.css';
import React, { useEffect, useState} from 'react';

const getConntacts = async () => {
  try{
    const response = await fetch("http://127.0.0.1:5000/get_contacts")

    if(!response.ok){
      throw new Error ("Could not fetch data from endpoint")
    }
    const data  = await response.json()
    return data
  } catch(error){
    console.error(error)
  }
}

const AddContact = ({ isVisible, setIsVisible }) => {
const [firstName, setFirstName] = useState("")
const [lastName, setLastName] = useState("")
const [email, setEmail] = useState("")

const handleSubmit = async(e) => {
  e.preventDefault();

  const contactData = {
    first_name: firstName,
    last_name: lastName, 
    email: email,
  }

  try{
    const response = await fetch("http://127.0.0.1:5000/add_contact", {
      method: "POST",
      headers: {"Content-Type": "application/json",},
      body: JSON.stringify(contactData)
    })
    if(response.ok) {
      const data = await response.json()
      console.log("Contact succesfully send to server!", data)
      window.location.reload()
    }
  }catch(error){
    console.error("Error:", error)
  }
};


  if(isVisible){
    return(
      <div className='AddContact'>
        <button onClick={() => setIsVisible(false)}>X</button>
        <h2>Add contact</h2>
        <form className='addContactForm' onSubmit={handleSubmit}>
          <input
            type='text'
            placeholder='First Name'
            value = {firstName}
            onChange={(e) => setFirstName(e.target.value)}
            required
          />
          <input
            type='text'
            placeholder='Last Name'
            value = {lastName}
            onChange={(e) => setLastName(e.target.value)}
            required
          />
          <input
            type='text'
            placeholder='E-Mail'
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <button type='submit'>Submit</button>
        </form>
          
      </div>
    )
  }
  return null;
}

const deleteContact = async(key) => {
  const data = {"key": key}

  try{
    const response = await fetch("http://127.0.0.1:5000/delete_contact",{
      method: "POST",
      headers: {"Content-Type": "application/json",},
      body: JSON.stringify(data)
    })
    if(response.ok){
      const message = await response.json()
      console.log(message)
      window.location.reload()
    }
  }catch(error){
    console.error("Hi there was a problem:", error)
  }
}



function App() {
  const [contacts, setContacts] = useState([])
  const [isVisible, setIsVisible] = useState(false);
  const [currentKey, setCurrentKey] = useState("")
  const [currentContact, setCurrentContact] = useState(null)

  const EditContact = () => {
    const [formFirstName, setFormFirstName] = useState("")
    const [formLastName, setLastName] = useState("")
    const [formEmail, setEmail] = useState("")

    setCurrentContact()


    const submitChanges = async(e, key) => {
      e.preventDefault()

      const contactData = {
        key: key,
        first_name: formFirstName,
        last_name: formLastName,
        email: formEmail
      }

      try{
        const response = await fetch("http://127.0.0.1:5000/edit_contact",{
          method: "POST",
          headers: {"Content-Type": "application/json"},
          body: JSON.stringify(contactData),
        })
        if(response.ok){
          const data = await response.json()
          console.log("Data succesfully send to server", data)
        }

      }catch(error){
        console.error("There was a problem: ", error)
      }
      window.location.reload()
    
    }
  

    if(true){
      return(
        <div>
          <button>x</button>
          <form className='editForm' onSubmit={(e) => submitChanges(e, currentKey)}>
            <input
              type='text'
              placeholder='First name'
              value= {formFirstName}
              onChange={(e) => setFormFirstName(e.target.value)}
              id='editFormFirstName'
            />
            <input
              type="text"
              placeholder='Last name'
              value={formLastName}
              onChange={(e) => setLastName(e.target.value)}
              id="editFormLastName"
            />
            <input
              type="text"
              placeholder="email"
              value={formEmail}
              onChange={(e) => setEmail(e.target.value)}
              id="editFormEmail"
            />
            <button type='submit'>Submit changes</button>
          </form>
        </div>
      )
    }
  }
  

  useEffect(() => {
    const fetchConntacts = async () => {
      const data = await getConntacts()
      setContacts(data)
    }
    fetchConntacts()
  }, [])

  return (
    <div>
      <h1 id="title">Contacts</h1>
      <div>
        <button onClick={() => setIsVisible(true)}>Add Contact</button>
      </div>
      <div>
        <AddContact isVisible={isVisible} setIsVisible={setIsVisible}/>
        <EditContact currentContact = {currentContact} />
      </div>
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
              <tr key={key} id={key}>
                <td>{first_name}</td>
                <td>{last_name}</td>
                <td>{email}</td>
                <td><button onClick={() => deleteContact(key)}>Delete</button></td>
                <td><button onClick={() => setCurrentKey(key)}>Edit</button></td>
              </tr>
            )
          })}
        </tbody>
      </table>
      
    </div>

  );
}

export default App;