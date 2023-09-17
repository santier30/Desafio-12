const section = document.getElementById('section');
const name = document.getElementById('name');
const number = document.getElementById('number');
const contact = document.getElementById('Add');
const newButton = document.getElementById('New');
const cancel = document.getElementById('cancel');
const searchInput = document.getElementById('form1');
const searchButton = document.getElementById('searchButton');
let display = false;
let data="";
let last="";
function displayHandler(dataF){
    section.innerHTML=dataF!=""?"":`<h1 class="text-white text-center">Agrege algun contacto</h1`
      for(element in dataF){
          section.innerHTML +=createArticleHandler(dataF[element])
      }
last="";
}
function searchHandler(){
    const regex = new RegExp(searchInput.value.replace(/\s+/g, '\\s*'), 'i')
    let s =[...data].filter((element)=>regex.test(element.name))
    displayHandler(s)
}
function createArticleHandler(data){
    if(last!=data.name[0].toUpperCase()) {
        last = data.name[0].toUpperCase();
        return`
        <h2 class="text-white">${data.name[0].toUpperCase()}</h2>
        <article class="bg-light p-2 d-flex justify-content-between text-white rounded">
        <h2>${data.name}</h2>
        <span class="p-2">${data.number}</span>
        <button class="btn btn-warning text-white" onClick="deleteHandler('${data.id}')">Borrar</button>
        </article>
        `
    }else{
        return`
        <article class="bg-light p-2 d-flex justify-content-between text-white rounded">
        <h2>${data.name}</h2>
        <span class="p-2">${data.number}</span>
        <button class="btn btn-warning text-white" onClick="deleteHandler('${data.id}')">Borrar</button>
        </article>
        `
    }
 
}
function clear(){
    name.value = '';
    number.value = '';
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
       const response = await fetch("https://contactos-cfb7b-default-rtdb.firebaseio.com/Contactos.json", {method: 'POST', body:JSON.stringify({name: name.value, number: number.value})})
       if(!response.ok){throw new Error("Posting Error")}
       await fetchHandler()
       displayAddHandler()
        }catch(e){console.log(e);}
    }
}

function deleteHandler(id){
    data=""
    fetch(`https://contactos-cfb7b-default-rtdb.firebaseio.com/Contactos/${id}.json`,{method: 'DELETE'}).then(()=>fetchHandler())
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