import React from 'react'
import { Interface } from 'readline'

// Create interfaces for variables cominng from server
interface User {
    id: number; // element: type
    name: string;
}

const userPage = async () => {
    
    /*  fetch returns a promise so you use await keyword.
        set next prameter so that chaching is only valid for 10 seconds. 
        After, the code reads to network data again    */
    const res = await fetch("https://jsonplaceholder.typicode.com/users", {next: {revalidate: 10}}) 
    
    const users: User[] = await res.json() // define users with corresponding interface
    console.log(users)

    return (
    <div>
        <h1>Users:</h1>
        <ul>
            {users.map(user => (
                <li key={user.id}>{user.name}</li>
            ))}
        </ul>
    </div>
  )
}

export default userPage