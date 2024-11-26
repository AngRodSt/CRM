    let newDB; 
    const form = document.querySelector('#form')
   

    form.addEventListener('submit', Validation)
    document.addEventListener('DOMContentLoaded',()=>{
        conectDB();
    })


    function Validation(e){
        e.preventDefault();
        const name = document.querySelector('#name').value
        const email = document.querySelector('#email').value
        const telephone = document.querySelector('#telephone').value
        const company = document.querySelector('#company').value
        if(name === '' || email === '' || telephone === '' || company === ''){
            //Add the alert function
            Notification('All the field are mandatory', 'error')
            return;
        }
        const customer = {
            id : Date.now(),
            name,
            email,
            telephone,
            company
        }
        createCustomer(customer);
    }

    function createCustomer(customer){
        const transaction = newDB.transaction(['crm'], 'readwrite');
        const objectStore = transaction.objectStore('crm');

        objectStore.add(customer);

        transaction.onerror = function(){
            Notification('The email already exist', 'error')
            
        }

        transaction.oncomplete = function (){
            Notification('Customer added succesfully')
            setTimeout(() => {
                window.location.href = 'index.html'
            }, 3000);
        }
    }

    export function Notification(messege, type){
        const alert = document.querySelector('.alert');
        if (alert){
            alert.remove();
        }
        const div = document.createElement('DIV');
        div.classList.add('border', 'text-center','text-white', 'font-bold' ,'py-2', 'mb-2', 'alert', 'mt-3')
        if(type === 'error'){
            div.classList.add('bg-red-300', 'border-red-700')
        }
        else{
            div.classList.add('bg-green-400', 'border-green-700')
        }
        div.textContent = messege;
        form.appendChild(div)
        setTimeout(() => {
          div.remove();  
        }, 3000);
    }

    function conectDB(){
        const openConection = window.indexedDB.open('crm',1);
        
        openConection.onerror = function(){
            throw console.error(" Can't conect to the DataBase");
        }

        openConection.onsuccess = function(){
            newDB = openConection.result;
        }

    }

