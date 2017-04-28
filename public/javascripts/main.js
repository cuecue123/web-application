
count = 0;

function click(evt) {
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

class femaleUser{
    constructor(from){
        this.from = from;
        this.emoji = "👧";

    }
    showEmoji(){
        return this.emoji;

    }
}

class maleUser{
    constructor(from){
        this.from = from;
        this.emoji = "👦";
    }

    showEmoji(){
        return this.emoji;
    }
}

class unknownUser{
    constructor(from){
        this.from = from;
        this.emoji = "😊 ";
    }
    showEmoji(){
        return this.emoji;
    }
}
function getMessages() {
    const req = new XMLHttpRequest();
    req.open('GET', '/finalProject/messages');
    req.addEventListener('load', function printMessage() {
        if(req.status >= 200 && req.status < 400) {
            const div = document.querySelector('#messages');
            div.innerHTML = '';
            const messages = JSON.parse(req.responseText);
            messages.forEach((m) => {
                const user = document.createElement('div');
                user.setAttribute('class', 'username');
                if (m.gender === 'female'){
                    const fel = new femaleUser(m.from);
                    const emoji = fel.showEmoji();
                    user.innerHTML =  emoji+ m.from + ":";

                }
                else if (m.gender === "male"){
                    const mal = new maleUser(m.from);
                    const emoji = mal.showEmoji();
                    user.innerHTML =  emoji + m.from + ":";

                }

                else{
                    const unknow = new unknownUser(m.from);
                    const emoji = unknow.showEmoji();
                    user.innerHTML = emoji+ m.from + ":";

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
