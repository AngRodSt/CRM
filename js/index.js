const list = document.querySelector('#client-list')
let DB;
document.addEventListener('DOMContentLoaded', () => {

    createDB();
    printCustomers();
})

function printCustomers() {
    cleanHTML();
    
    
    openConexion = window.indexedDB.open('crm', 1);

    openConexion.onerror = function () {
        console.log('error');
    }

    openConexion.onsuccess = function () {
        DB = openConexion.result;

        const objectStore = DB.transaction('crm').objectStore('crm');

        objectStore.openCursor().onsuccess = function (e) {
            const cursor = e.target.result;

            if (cursor) {
                const { id, name, email, telephone, company } = cursor.value;
                const tr = document.createElement('TR')
                tr.classList = 'registre';
                tr.setAttribute('data-id', id);
                tr.innerHTML = `
                    <td class="px-6 py-4 whitespace-no-wrap border-b border-gray-200">
                        <p class="leading-5  text-gray-700 text-lg font-bold text-nowrap">${name}</p>
                        <p class="text-sm leading-10 text-gray-700" >${email}</p>
                    </td>
                    <td class="px-6 py-4 whitespace-no-wrap border-b border-gray-200">
                         <div class="text-sm leading-5 text-gray-900 text-nowrap">${telephone}</div>
                     </td>
                    <td class="px-6 py-4 whitespace-no-wrap border-b border-gray-200">
                        <div class="text-sm leading-5 text-gray-900 text-nowrap ">${company}</div>
                    </td>
                    `
                const cntButtons = document.createElement('TD');
                cntButtons.className = 'px-6 py-4 whitespace-no-wrap border-b border-gray-200 text-sm leading-5 font-medium text-nowrap';
                const btnEdit = document.createElement('button');
                btnEdit.className = 'text-teal-600 hover:text-teal-900';
                btnEdit.textContent = 'Edit';
                btnEdit.onclick = function () {
                    window.location.href = `editCustomer.html?id=${id}`;

                }

                const btnDelete = document.createElement('button');
                btnDelete.className = 'text-red-600 hover:text-red-900 ml-4';
                btnDelete.textContent = 'Delete';
                btnDelete.onclick = function () {
                    deleteCustomer(id);
                }

                cntButtons.appendChild(btnEdit);
                cntButtons.appendChild(btnDelete);
                tr.appendChild(cntButtons);
                list.appendChild(tr);

                cursor.continue();
            }
        }
    }
}
function deleteCustomer(id) {
    console.log(id)
    const confirPropt = confirm('Want to delete the customer?')

    if (confirPropt) {
        const transaction = DB.transaction(['crm'], 'readwrite');
        const objectStore = transaction.objectStore('crm');

        objectStore.delete(id);
        transaction.oncomplete = function(){
            const registre = document.querySelector(`tr[data-id='${id}']`);
            if(registre){
                registre.remove();
            }
        }
        
        transaction.onerror = function () {
            console.log('No se pudo eliminar correctamente')
         }
    }
}

function cleanHTML(){
    while(list.firstChild){
        list.remove(list.firstChild)
    }
}

function createDB() {
    const createDB = window.indexedDB.open('crm', 1);

    createDB.onerror = function () {
        throw console.error('Error, DataBase not created')
    }

    createDB.onsuccess = function () {
        DB = createDB.result;
    }

    createDB.onupgradeneeded = function (e) {
        const db = e.target.result

        const objectStore = db.createObjectStore('crm', {
            keyPath: 'id',
            autoIncrement: true
        })

        objectStore.createIndex('name', 'name', { unique: false })
        objectStore.createIndex('email', 'email', { unique: true })
        objectStore.createIndex('telephone', 'telephone', { unique: false })
        objectStore.createIndex('company', 'company', { unique: false })
        objectStore.createIndex('id', 'id', { unique: true })

        console.log('DB create')
    }



}
