'use strict'

const nome = document.getElementById('nome')
const email = document.getElementById('email')
const celular = document.getElementById('celular')
const cidade = document.getElementById('cidade')
const btn_exit = document.getElementById('modal-close')
const btn_close = document.getElementById('button-close')
const btn_save = document.getElementById('btn-salvar')
const modal = document.getElementById('modal')
const cadastrar = document.getElementById('cadastrarCliente')
const edit = document.querySelector('#tableClient>tbody')
const delete_client = document.getElementById('delete-client')
const fields = document.querySelectorAll('.modal-field')

const openModal = () => modal.classList.add('active')

const closeModal = () => {
  clearFields()
  modal.classList.remove('active')
  // fields.forEach(field => field.value = "")
}

// CRUD
const getLocalStorage = () => JSON.parse(localStorage.getItem('dbClient')) ?? []
const setLocalStorage = (dbClient) => localStorage.setItem("dbClient", JSON.stringify(dbClient))


const createClient = (client) => {
  const dbClient = getLocalStorage()
  dbClient.push(client)
  setLocalStorage(dbClient)
}

const readClient = () => getLocalStorage()

const updateClient = (index, client) => {
  const dbClient = readClient()
  dbClient[index] = client
  setLocalStorage(dbClient)
}

const deleteClient = (index) => {
  const dbClient = readClient()
  dbClient.splice(index, 1)
  setLocalStorage(dbClient)
}

// INTERAÇÂO COM LAYOUT

const isValidFields = () => {
  nome.setAttribute("required", "required")
  email.setAttribute("required", "required")
  cidade.setAttribute("required", "required")
  celular.setAttribute("required", "required")

  return document.getElementById('form').reportValidity()
}

// INTERAÇÃO COM O LAYOUT

const clearFields = () => {
  const fields = document.querySelectorAll('.modal-field')
  fields.forEach(field => field.value = "")
  document.getElementById('nome').dataset.index = 'new'
}

const saveClient = () => {
  if (isValidFields()) {
    const client = {
      nome: nome.value,
      email: email.value,
      celular: celular.value,
      cidade: cidade.value,
    }

    if (nome.value.length < 3) {
      alert("O nome precisa ter pelo menos 3 letras");
    } else if (cidade.value.length < 3) {
      alert("O nome da cidade precisa ter pelo menos 3 letras");
    } else if (celular.value.length < 11) {
      alert("Digite um número de celular válido")
    } else {
      const index = nome.dataset.index
      if (index == 'new') {
        createClient(client)
        updateTable()
        closeModal()
    } else {
        updateClient(index, client)
        updateTable()
        closeModal()
      }
    }

  }
}

const createRow = (client, index) => {
  const newRow = document.createElement('tr')
  newRow.innerHTML = `
  <td>${client.nome}</td>
  <td class="td-align">${client.email}</td>
  <td class="td-align">${client.celular}</td>
  <td class="td-align">${client.cidade}</td>
  <td>
  <button type="button" class="button green" id="edit-${index}">Editar</button>
  <button type="button" class="button red" id="delete-${index}" >Excluir</button>
  </td>`

  edit.appendChild(newRow)
}


const clearTable = () => {
  const rows = document.querySelectorAll('#tableClient>tbody tr')
  rows.forEach(row => row.parentNode.removeChild(row))
}

const updateTable = () => {
  const dbClient = readClient()
  clearTable()
  dbClient.forEach(createRow)
}


// editClient = (event) => {
//   if (event.target.type == 'button') {
//     console.log(event.target.dataset.action)
//   }
// }

const fillFields = (client) => {
  nome.value = client.nome
  email.value = client.email
  celular.value = client.celular
  cidade.value = client.cidade
  nome.dataset.index = client.index
}

const editClient = (index) => {
  const client = readClient()[index]
  client.index = index
  fillFields(client)
  openModal()
}

const editDelete = (event) => {
  if (event.target.type == 'button') {

    const [action, index] = event.target.id.split('-')

    if (action == 'edit') {
      editClient(index)
    } else {
      const client = readClient()[index]
      const response = confirm(`Deseja realmente excluir o cliente ${client.nome}`)
      if (response) {
        deleteClient(index)
        updateTable()
      }
    }
  }
}

updateTable()

// EVENTOS
cadastrar.addEventListener('click', openModal)
btn_save.addEventListener('click', saveClient)
edit.addEventListener('click', editDelete)
btn_exit.addEventListener('click', closeModal)
btn_close.addEventListener('click', closeModal)