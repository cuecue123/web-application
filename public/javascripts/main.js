// class Conversation {
//   // ..and an (optional) custom class constructor. If one is
//   // not supplied, a default constructor is used instead:
//   // constructor() { }
//   constructor(message, from, gender) {
//     this.message = message;
//     this.from = from;
//     this.gender = gender;
//   }
//   getTitle(){
//      if (this.gender === 'female'){
//         return  "👧 "+ this.from + ":";

//                 }
//     else if (this.gender === "male"){
//         return =  "👦 "+ this.from + ":";

//                 }

//     else{
//         return = "😊 "+ this.from + ":";

//                 }
//   }


//   getWords(){
//     return this.message;
//   }

 
// }



// function deleteInfo(){



// }
count = 0;

function click(evt) {
    //alert('clicked');
    evt.preventDefault();
    const req = new XMLHttpRequest();
    req.open('POST', '/finalProject/messages');
    req.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded; charset=UTF-8');
    const message = document.querySelector('#message').value;
    const from = document.querySelector('#from').value;
    const gender = document.querySelector("#gender").value;


    const data = `message=${message}&from=${from}&gender=${gender}`;
    req.send(data);
}
function getMessages() {
    const req = new XMLHttpRequest();
    req.open('GET', '/finalProject/messages');
    req.addEventListener('load', function printMessage() {
        if(req.status >= 200 && req.status < 400) {
            const div = document.querySelector('#messages');
            div.innerHTML = '';
            const messages = JSON.parse(req.responseText);
            // const count = new Conversation();
            messages.forEach((m) => {
                const user = document.createElement('div');
                user.setAttribute('class', 'username');
                if (m.gender === 'female'){
                    user.innerHTML =  "👧 "+ m.from + ":";

                }
                else if (m.gender === "male"){
                    user.innerHTML =  "👦 "+ m.from + ":";

                }

                else{
                    user.innerHTML = "😊 "+ m.from + ":";

                }
                
                div.appendChild(user); 

                const block = document.createElement('div');
                block.setAttribute('class', 'block');
                const words = document.createElement('div');
                const wordsId = 'word'+m.from+count
                words.setAttribute('id', wordsId);
                words.setAttribute('style', 'text-indent: 120%;')
                words.innerHTML = m.message;
                
                block.appendChild(words);


                div.appendChild(block);
                count++;
                words.setAttribute('onClick', 'set(this.id)');




            });
            setTimeout(getMessages, 2000);
        }
    });
    req.send();
}



function set(id){
  deleteId = '#'+id;
  console.log(id)
  const deleteBuffer = document.querySelector(deleteId);
  deleteBuffer.setAttribute('style', 'text-indent:0%;');
  deleteBuffer.setAttribute('style', 'color:white;');

}

function main() {
  const btn = document.querySelector('input[type="submit"]');// console.log(deleteBtn);

   
   btn.addEventListener('click', click);
   getMessages();

}
document.addEventListener("DOMContentLoaded", main);
