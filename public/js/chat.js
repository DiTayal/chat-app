const socket=io()

//elements
const $messageForm=document.querySelector('#message-form')
const $messageFormInput=document.querySelector('input')
const $messageFormButton=document.querySelector('button')//gave no id so use tag name

const $messages=document.querySelector('#messages')

//templates
const messageTemplate=document.querySelector('#message-template').innerHTML;
const locationMessageTemplate=document.querySelector('#locationMessage-template').innerHTML;
const sidebarTemplate=document.querySelector('#sidebar-template').innerHTML;

//options
const {username,room}=Qs.parse(location.search,{ignoreQueryPrefix:true})
//Qs library we have script in tag, help us to give key - value pair, from query string in url bar whose value given by location.search

const autoScroll=()=>{

    //new message element
    const $newMessage=$messages.lastElementChild;

    //Height of the new message
    const newMessageStyles=getComputedStyle($newMessage)
    const newMessageMargin=parseInt(newMessageStyles.marginBottom)
    const newMessageHeight=$newMessage.offsetHeight + newMessageMargin

    //console.log(newMessageStyles)

    //Visible Height
    const visibleHeight=$messages.offsetHeight

    //Height of message container
    const containerHeight=$messages.scrollHeight

    //How far have I scrolled?
    const scrollOffset=$messages.scrollTop  + visibleHeight

    if(containerHeight-newMessageHeight <= scrollOffset){
        $messages.scrollTop=$messages.scrollHeight
    }




}

socket.on('message',(msg)=>{
    //console.log(msg)
    const html=Mustache.render(messageTemplate,{
        username:msg.username,
        message:msg.text,//message is used to print the messsage dynamically in html file using {{}}
       // createdAt:msg.createdAt

       //to change the format of time----use moment library---https://momentjs.com/     in script  or download and use script like chat.js
       createdAt:moment(msg.createdAt).format('h:mm a')
        
    })
    $messages.insertAdjacentHTML('beforeend',html)

    autoScroll();
})

socket.on('message-location',(msg)=>{   //done so that location ka link not shown up on screen as plain text

    console.log(msg);
    const html=Mustache.render(locationMessageTemplate,{
        username:msg.username,
        url:msg.url,
        createdAt:moment(msg.createdAt).format('h:mm a')

    })
    $messages.insertAdjacentHTML('beforeend',html)//beforeendmeans insert code before the last div of $message eleemnt
    
    autoScroll();
})


socket.on('room-data',({room,users})=>{

    const html=Mustache.render(sidebarTemplate,{
        room,
        users
    })
    document.querySelector('#sidebar').innerHTML=html

})

$messageForm.addEventListener('submit',(e)=>{
    
    e.preventDefault();
    
    //let msg=document.querySelector('input').value
   // let msg=document.querySelector('#message').value-wrong

    //disable--so that i time taken to fetvh data, dont send same msg multiple times
    $messageFormButton.setAttribute('disabled','disabled');//attrib name is disable and its value is also disable

   let msg=e.target.elements.message.value//to get value from a part input element


    //socket.emit('sendMsg',msg,(message)=>{
    socket.emit('sendMsg',msg,(error)=>{


        //enable
       $messageFormButton.removeAttribute('disabled')
       $messageFormInput.value=''//empty  the inout box
       $messageFormInput.focus();
       
       if(error)
        return console.log(error);
        
        
        //console.log("The message was delivered! ",message)
        console.log("The message was delivered! ")
    })

})

const $locationButton=document.querySelector('#btnLocation');

$locationButton.addEventListener('click',()=>{

    //https://developer.mozilla.org/en-US/docs/Web/API/Geolocation

    //disable
    $locationButton.setAttribute('disabled','disabled')


    if(!navigator.geolocation)
    return alert ("Geolocation is not supported by your browser")

    //need internet for this
    navigator.geolocation.getCurrentPosition((position)=>{//this function, asynchronous but does not support promise till now, so use callback fxn
        
   // console.log(position)

    socket.emit('sendLocation',{//we can send as many things and last argument is acknowledgement function
        latitude: position.coords.latitude,
        longitude:position.coords.longitude
    },()=>{
        //enable
    $locationButton.removeAttribute('disabled')
        console.log("Location shared")
    })
    })
})

socket.emit("join",{username,room},(error)=>{
    if(error){
     alert(error)
    location.href='/';//where to go, if error---join page
    }
})
/*
//on method is used to receive the info from server---2 args---eventand callback function
socket.on('countUpdated',(count)=>{

    console.log('count has been updated and is = '+count)
})

document.querySelector('#increment').addEventListener('click',()=>{

    console.log('Cliked!')
    socket.emit('increment')

})
*/
//console.log("hi")