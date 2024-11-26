import { Notification } from "./newCustomer.js";


let editDB;
let idCliente;
const nameInput = document.querySelector('#name');
const emailInput = document.querySelector('#email');
const telephoneInput = document.querySelector('#telephone');
const companyInput = document.querySelector('#company');
const form = document.querySelector('#form');

document.addEventListener('DOMContentLoaded', () => {
    conectDB();
    const parametersURL = new URLSearchParams(window.location.search);
    idCliente = parametersURL.get('id');
    if (idCliente) {
        setTimeout(() => {
            getCustomer(idCliente);
        }, 500);
    }
    form.addEventListener('submit', editCustomer)
})

function editCustomer(e){
    e.preventDefault();

    if(nameInput.value === ''|| emailInput.value ===''|| telephoneInput.value===''|| companyInput.value===''){
        Notification('All the field are mandatory', 'error');
    }

    const customerObject = {
        name : nameInput.value,
        email : emailInput.value,
        telephone : telephoneInput.value,
        company : companyInput.value,
        id : Number(idCliente)
    }

    const transaction = editDB.transaction(['crm'], 'readwrite');
    const objectStore = transaction.objectStore('crm')

    objectStore.put(customerObject);

    transaction.oncomplete = function(){
        Notification('Customer edited succesfully');
        setTimeout(() => {
            window.location.href = 'index.html'
        }, 3000);
    }
}

function getCustomer(idCustomer) {
    const transaction = editDB.transaction(['crm'], 'readwrite');
    const objectStore = transaction.objectStore('crm')

    const customer = objectStore.openCursor();

    customer.onsuccess = function (e) {
        
        const cursor = e.target.result;
        if (cursor) {
            if (cursor.value.id === Number(idCustomer)) {
                fillForm(cursor.value);
            }
            cursor.continue();
        }
    }
}

function fillForm(customer) {
    const { name, email, telephone, company } = customer;
    nameInput.value = name;
    emailInput.value = email;
    telephoneInput.value = telephone;
    companyInput.value = company;
}

function conectDB() {
    const conectDB = window.indexedDB.open('crm', 1);

    conectDB.onerror = function () {
        console.log('Error');
    }

    conectDB.onsuccess = function () {
        editDB = conectDB.result;
    }
}