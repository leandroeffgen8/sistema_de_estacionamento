

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

