const section = document.getElementById('section');
const name = document.getElementById('name');
const number = document.getElementById('number');
const email = document.getElementById('Email');
const age = document.getElementById('Age');
const contact = document.getElementById('Add');

const nameEdit = document.getElementById('nameEdit');
const numberEdit = document.getElementById('numberEdit');
const emailEdit = document.getElementById('EmailEdit');
const ageEdit = document.getElementById('AgeEdit');
const contactEdit = document.getElementById('Edit');

const nameEdit2 = document.getElementById('nameEdit2');
const numberEdit2 = document.getElementById('numberEdit2');
const emailEdit2 = document.getElementById('EmailEdit2');
const ageEdit2 = document.getElementById('AgeEdit2');

const newButton = document.getElementById('New');
const cancel = document.getElementById('cancel');
const searchInput = document.getElementById('form1');
const searchButton = document.getElementById('searchButton');
let display = false;
let data="";
let editId="";
let last="";

function editModalHandler(mark){
    nameEdit.value=data[mark].name;
    numberEdit.value=data[mark].number;
    ageEdit.value=data[mark].age;
    emailEdit.value=data[mark].email;
    nameEdit2.value=data[mark].name;
    numberEdit2.value=data[mark].number;
    ageEdit2.value=data[mark].age;
    emailEdit2.value=data[mark].email;
    editId=data[mark].id;
}


function displayHandler(dataF){
    section.innerHTML=dataF!=""?"":`<h1 class="text-white text-center">Agrege algun contacto</h1`
      for(element in dataF){
          section.innerHTML +=createArticleHandler(dataF[element],element)
      }
last="";
}
function searchHandler(){
    const regex = new RegExp(searchInput.value.replace(/\s+/g, '\\s*'), 'i')
    let s =[...data].filter((element)=>regex.test(element.name))
    displayHandler(s)
}
function createArticleHandler(data,mark){
    if(last!=data.name[0].toUpperCase()) {
        last = data.name[0].toUpperCase();
        return`
        <h2 class="text-white">${data.name[0].toUpperCase()}</h2>
        <article class="bg-light p-2 d-flex justify-content-between text-white  rounded ">
        <h2 role="button" data-bs-toggle="modal" data-bs-target="#showPhone" onClick="editModalHandler('${mark}')">${data.name}</h2>
        <span class="p-2">${data.number}</span>
        <span class="p-2">${data.age?data.age:''}</span>
        <span class="p-2">${data.email?data.email:''}</span>
        <div class="d-flex justify-content-center">
        <button type="button" class="btn btn-warning text-white me-2" data-bs-toggle="modal" data-bs-target="#staticBackdrop" onClick="editModalHandler('${mark}')">Editar</button>
        <button class="btn btn-warning text-white" onClick="deleteHandler('${data.id}')">Borrar</button>
        </div>

        </article>
        `
    }else{
        return`
        <article class="bg-light p-2 d-flex justify-content-between text-white  rounded ">
        <h2 role="button" data-bs-toggle="modal" data-bs-target="#showPhone" onClick="editModalHandler('${mark}')">${data.name}</h2>
        <span class="p-2">${data.number}</span>
        <span class="p-2">${data.age?data.age:''}</span>
        <span class="p-2">${data.email?data.email:''}</span>
        <div class="d-flex justify-content-center">
        <button type="button" class="btn btn-warning text-white me-2" data-bs-toggle="modal" data-bs-target="#staticBackdrop" onClick="editModalHandler('${mark}')">Editar</button>
        <button class="btn btn-warning text-white" onClick="deleteHandler('${data.id}')">Borrar</button>
        </div>

        </article>
        `
    }
 
}
function clear(){
    name.value = '';
    number.value = '';
    age.value = '';
    email.value = '';
    
}
function displayAddHandler() {
if (!display){
    newButton.style.display = 'none';
    contact.style.display = 'block';
    display=true
}else{
    newButton.style.display = 'inline-block';
    contact.style.display = 'none';
    display=false
    clear()
}
}
async function postHandler(event){
    event.preventDefault();
    if(name.value && number.value){
        try{
       const response = await fetch("https://contactos-cfb7b-default-rtdb.firebaseio.com/Contactos.json", {method: 'POST', body:JSON.stringify({
        name: name.value,
         number: number.value,
         email:email.value,
         age: age.value
    })})
       if(!response.ok){throw new Error("Posting Error")}
       await fetchHandler()
       displayAddHandler()
        }catch(e){console.log(e);}
    }
}

function deleteHandler(id){
    data=""
    fetch(`https://contactos-cfb7b-default-rtdb.firebaseio.com/Contactos/${id}.json`,{method: 'DELETE'})
    .then(()=>fetchHandler()).catch(e=>console.log(e))
}
function editHandler(event){
    event.preventDefault()
    if(nameEdit.value && numberEdit.value){
        data=""
        fetch(`https://contactos-cfb7b-default-rtdb.firebaseio.com/Contactos/${editId}.json`,{method: 'put',body:JSON.stringify({
            name: nameEdit.value,
            number: numberEdit.value,
            email:emailEdit.value,
            age: ageEdit.value
    
        })}).then(()=>fetchHandler()).catch(e=>console.log(e))
    }

}

async function fetchHandler(){
    try {
    const response = await fetch(`https://contactos-cfb7b-default-rtdb.firebaseio.com/Contactos.json`)
    if(!response.ok){throw new Error("fetch failed: " + response)}
    const res = await response.json()
    for(id in res){
        res[id].id = id
    }
    if(res!=null){
        data = [...Object.values(res)].sort((a,b) =>a.name.localeCompare(b.name))
    }
    displayHandler(data)
    } catch (error){console.log(error)}
}



fetchHandler() 
contact.addEventListener("submit",postHandler)
newButton.addEventListener("click",displayAddHandler)
cancel.addEventListener("click",displayAddHandler)
searchButton.addEventListener("click",searchHandler)
contactEdit.addEventListener("submit",editHandler)