

const modelo = document.querySelector('#modelo');
const placa = document.querySelector('#placa');
const hora = document.querySelector('#hora');
const register = document.querySelector('.btn-register');

const getLocalStorage = () => JSON.parse(localStorage.getItem('placa')) ?? [];
const setLocalStorage = (dbPlaca) => localStorage.setItem('placa', JSON.stringify(dbPlaca));

//add car plate in localstorage
const addCarPlate = (placa) => {
    const dbPlate = getLocalStorage();
    dbPlate.push(placa);
    setLocalStorage(dbPlate);
}  

//edit car plate in localstorage
const editCarPlate = (index, placa) => {
    const dbPlate = getLocalStorage();
    dbPlate[index] = placa;
    setLocalStorage(dbPlate);
}

//exclude car plate in localstorage
const excludeCarPlate = (index) => {
    const dbPlate = getLocalStorage();
    dbPlate.splice(index, 1);
    setLocalStorage(dbPlate);
}

//Formata input campo - placa de veiculo
const formatCarPlate = () => {
    const cleanedValue = placa.value.replace(/[^a-zA-Z0-9]/g, '');

    const letters = cleanedValue.slice(0, 3).toUpperCase();
    const numbers = cleanedValue.slice(3, 7);
   
    const lettersPattern = /^[A-Z]{3}$/;
    const numbersPattern = /^[0-9]{4}$/;
    
    if (lettersPattern.test(letters) && numbersPattern.test(numbers)) {
        placa.value = `${letters}-${numbers}`;
    }
}

//Mostra a hora no input hora de entrada
const interval = setInterval(()  => {
    const date = new Date();
    const dateActual = date.toLocaleDateString();    
    const hour = date.toLocaleTimeString('pt-BR');
    hora.setAttribute('data-atual', dateActual);
    hora.value = hour;     
},1000);

//Valida campos vazios
const isValidFields = () => {
    const form = document.querySelector('#formId');
    return form.reportValidity();
}

//Salva os dados
const savePlate = (e) => {
    e.preventDefault();

    if( isValidFields() ){
        const client = {
            modelo: modelo.value,
            placa: placa.value,
            hora: hora.value
        }
    
        addCarPlate(client);
        clearFields();
    }

}

register.addEventListener('click', savePlate);

//Limpa os campos após ser inseridos
const clearFields = () => {
    const fields = document.querySelectorAll('.inputs-fields');
    fields.forEach(field => {
        field.value = '';
    })
}