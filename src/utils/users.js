//addUser  removeUser findUser/getUser  get All users in A room 
const users=[]
//id generated for every socket
const addUser=({id,username,room})=>{

    //clean data
     username=username.trim().toLowerCase();
     room=room.trim().toLowerCase();

    //validate data
    if(!username  ||  !room){
        return ({
            error:'Username and room are required'
        })
    }
    //check whether username unique in a room

    const existingUser=users.find((user)=>{
        return (user.username==username && user.room==room)
    })

    if(existingUser){
        return ({
            error:'Username already in use'
        })
    }

    //store user
    const user={id,username,room}
    users.push(user);
    return ({user})//send object....if receiving object...props dont matter
}

//remove user by id
const removeUser=(id)=>{

    const index=users.findIndex((user)=>{//can use filter also like in notes, but more time, but this break
        return user.id==id//break once consition true
    })

    if(index!=-1){//means found that id in array
        return users.splice(index,1)[0];//return array of user removed----like if w e remove more than 1 eleemnts 
        //but we r removing only 1 , so take 0 script
    }

}

const getUser=(id)=>{

    const index=users.findIndex((user)=> user.id===id)
    if(index!=-1)
    return users[index];
   // else return undefined--no need

   //or

   //return users.find((user)=>user.id===id)

}

const getUsersInRoom=(room)=>{

    room=room.trim().toLowerCase();////not needed because room come from server and not user...so no worries
    const usersInRoom=users.filter( (user)=>  user.room===room  )

    return usersInRoom

}

module.exports={
    addUser,
    removeUser,
    getUser,
    getUsersInRoom
}

/*

addUser({
    id:1,username:'ABC',room:'Bathinda'
})

//console.log(users)
const res= addUser({
    id:2,username:'abc',room:'jalandhar'
})

addUser({
    id:3,username:'def',room:'Bathinda'
})

//console.log(users)

// console.log(res)
// console.log(users)

//const removedUser=removeUser(1)//dont pass object bcoz we  r not accepting object in removeUsr function

// console.log(removedUser)
// console.log("-=-=-=-=-=-")
console.log(users)

console.log(getUser(3))
console.log(getUser(4))
console.log("-=-=-=-=-=-=-=-=-=-=")

console.log(getUsersInRoom('bathinda'))
console.log("-=-=-=-=-=-=-=-=-=-=")

console.log(getUsersInRoom('jalandhar'))
console.log("-=-=-=-=-=-=-=-=-=-=")

console.log(getUsersInRoom('china'))
*/