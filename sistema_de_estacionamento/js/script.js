const modeloInput = document.querySelector('#modelo');
const placaInput = document.querySelector('#placa');
const horaInput = document.querySelector('#hora');
const horaEditInput = document.querySelector('#editHora');

const register = document.querySelector('.btn-register');
const containerRegister = document.querySelector('.register');
const tableByRegister = document.querySelector('.tableByRegister');
const list = document.querySelector('.list');
const containerModal = document.querySelector('.container-modal');
const close = document.querySelector('.close');
const modal = document.querySelector('.modal');
const finalizar = document.querySelector('#finalizar');

//MASCARA NO FORMATO DE PLACA DDD-0000
const formatarPlaca = () => {
   
    const cleanedValue = placaInput.value.replace(/[^A-Za-z0-9]/g, '');
    const letters = cleanedValue.slice(0, 3).toUpperCase();
    const numbers = cleanedValue.slice(3, 7);
   
    const lettersPattern = /^[A-Z]{3}$/;
    const numbersPattern = /^[0-9]{4}$/;
    
    if (lettersPattern.test(letters) && numbersPattern.test(numbers)) {
        placaInput.value = `${letters}-${numbers}`;
    }
}

//MASCARA NO FORMATO DE HORA 00:00
const formatarHoraMinuto = () => {
  
    let valorInputEdit = horaEditInput.value;

    valorInputEdit = valorInputEdit.replace(/\D/g, '');

    if (valorInputEdit.length > 4) {
        valorInputEdit = valorInputEdit.substr(0, 4);
    }

    if (valorInputEdit.length >= 3) {
        valorInputEdit = valorInputEdit.replace(/(\d{2})(\d{2})/, '$1:$2');
    }

    horaEditInput.value = valorInputEdit;
    
}

//FUNÇÃO QUE ARMAZENA DADOS RECEBIDOS NO LOCALSTORAGE
const getLocalStorage = () => JSON.parse(localStorage.getItem('placa')) ?? [];
const setLocalStogare = (dbPlaca) => localStorage.setItem('placa', JSON.stringify(dbPlaca));

//ADICIONA NO LOCALSTORAGE
const addPlaca = (placa) => {
    const dbPlacas = getLocalStorage();
    dbPlacas.push(placa);
    setLocalStogare(dbPlacas);
}

//EDITAR NO LOCALSTORAGE
const updatePlacas = (index, placa) => {
    const dbPlaca = getLocalStorage();
    dbPlaca[index] = placa;
    setLocalStogare(dbPlaca);
}

//DELETA NO LOCALSTORAGE
const deletePlacas = (index) => {
    const dbPlaca = getLocalStorage();
    dbPlaca.splice(index, 1)
    setLocalStogare(dbPlaca);
}

//VALIDAR SE OS CAMPOS FORAM TODOS PREENCHIDOS
const isValidFields = () => {
    const form = document.querySelector('#formId');
    return form.reportValidity();
}

//EDITA OS DADOS NO CAMPO INPUT
const editCad = (index, editClient) => {
    updatePlacas(index, editClient);
    updateClient();
    clearFields();
    horaInput.classList.remove('hide');
    horaEditInput.classList.add('hide');
    containerRegister.classList.remove('edit');
    register.textContent = 'Registrar Veículo';
}

//SALVA OS DADOS REGISTRADOS
const saveClient = (e) => {
    e.preventDefault();

    var flag = false;

    if( isValidFields() ){
        const client = {
            modelo: modeloInput.value,
            placa: placaInput.value,
            hora: horaInput.value
        }

        const editClient = {
            modelo: modeloInput.value,
            placa: placaInput.value,
            hora: horaEditInput.value
        }

        const index = modeloInput.dataset.index;

        const dbPlacas = getLocalStorage();
        const placaRegistrada = placa.value;       
        
        dbPlacas.filter(carro => {
            if( carro.placa == placaRegistrada ){
                flag = true;
            }
        });

        if( flag ){
            if( !containerRegister.classList.contains('edit') ){
                Swal.fire({
                    icon: 'info',
                    title: 'Oops...',
                    html: `Ops.... essa placa de carro já foi registrada no pátio. Favor validar novamente!!!`
                });
                return false;
            }else{
                editCad(index, editClient)
            }

        }else{
            if( index == 'new' ){
                addPlaca(client);
                updateClient();   
                clearFields();            
            }else{
                editCad(index, editClient)
            }
        }

        location.reload(true);
    } 
}

register.addEventListener('click', saveClient);

//LIMPA OS CAMPOS OS OS DADOS SEREM INSERIDOS
const clearFields = () => {
    const fields = document.querySelectorAll('.inputs-fields');
    fields.forEach( field => {
        field.value = '';
    })
}

//MONTA O HTML COM OS DADOS PREENCHIDOS
const createRow = (client, index) => {
    const rows = document.createElement('div');
    rows.classList.add('modelsCars');

    rows.innerHTML = `
        <span class="modelo">${client.modelo}</span>
        <span class="placa">${client.placa}</span>
        <span class="horario-entrada">${client.hora}</span>
        <span class="btns-containers">
            <button type="button" id="editar" class="btn-cars btn-edit" data-id="edit-${index}">Editar</button>
            <button type="button" id="saida" class="btn-cars btn-exit" data-id="delete-${index}">Finalizar</button>
        </span>
    `;
    list.classList.remove('hide');
    tableByRegister.appendChild(rows);
    if(document.querySelector('.title-center')){
        document.querySelector('.title-center').innerHTML = '';
    }
}

//LIMPA A LINHA APÓS OS DADOS SEREM INSERIDOS - EVITA DUPLICAR DADOS
const clearRows = () => {
    const rows = document.querySelectorAll('.modelsCars');
    rows.forEach( row => {
        row.parentNode.removeChild(row);
    })
}

//MOSTRA UMA FRASE SE NÃO TIVER DADOS CADASTRADOS
const updateClient = () => {
    const dbPlaca = getLocalStorage();
    clearRows();
    dbPlaca.forEach(createRow);
    if(!document.querySelector('.modelsCars')){      
        tableByRegister.insertAdjacentHTML('beforeend','<h3 class="title-center">No momento, não temos carros no pátio!!!</h3>')
    }
}

//RECUPERA OS DADOS QUE JÁ ESTÃO PREENCHIDOS
const fillFields = (client) => {
    modeloInput.value = client.modelo;
    placaInput.value = client.placa;
    horaInput.value = client.hora;
    horaInput.classList.add('hide');
    horaEditInput.classList.remove('hide');
    horaEditInput.value = client.hora;
    modeloInput.dataset.index = client.index
}

//EDITA DADOS
const editClient = (index) => {
    const client = getLocalStorage()[index];
    client.index = index;  
    containerRegister.classList.add('edit');
    register.textContent = 'Editar Veículo';
    fillFields(client);   
}

//CALCULA A HORA DE ENTREGA E SAIDA E O VALOR A SER PAGO.
const calcHours = (e) => {
    const field = e.target.parentElement.parentElement;
   
    const modelo = field.querySelector('.modelo').textContent;
    const placa = field.querySelector('.placa').textContent;
    const valueHoraEntrada = field.querySelector('.horario-entrada').textContent;
    const valueHoraSaida = document.querySelector('#hora').value;
    document.querySelector('.h-saida').textContent = valueHoraSaida;
    document.querySelector('.label-modelo').textContent = modelo;
    document.querySelector('.label-placa').textContent = placa;

    finalizar.setAttribute('data-id', placa);

    const [entradaHoras, entradaMinutos] = valueHoraEntrada.split(':').map(Number);
    const [saidaHoras, saidaMinutos] = valueHoraSaida.split(':').map(Number);

    const entradaEmMinutos = entradaHoras * 60 + entradaMinutos;
    const saidaEmMinutos = saidaHoras * 60 + saidaMinutos;

    const diferencaEmMinutos = saidaEmMinutos - entradaEmMinutos;
    const horasRestantes = Math.floor( diferencaEmMinutos / 60 )
    const minutosRestantes = diferencaEmMinutos % 60;

    const tempo = document.querySelector('.tempo');
    tempo.textContent = `${zeroFill(horasRestantes)}:${zeroFill(minutosRestantes)}`;

    let valueTotal = 0;

    if( diferencaEmMinutos <= 60 ){
        valueTotal = 'R$ 8,00'
    }else if( diferencaEmMinutos <= 120 ){
        valueTotal = 'R$ 12,00'
    }else{
        valueTotal = 'R$ 18,00'
    }

    document.querySelector('.total').textContent = valueTotal;
}

const openModal = (e, index) => {

    modal.classList.remove('hide');
    containerModal.classList.remove('hide');

    const getHours = e.target.parentElement.parentElement;
    const setHours = getHours.querySelector('.horario-entrada').textContent;
    document.querySelector('.h-entrada').textContent = setHours;

    const hour = document.querySelector('.h-entrada');
    const textHour = parseInt(hour.textContent.replace(':', ''));
    hour.setAttribute('data-entrada', textHour);
    
    calcHours(e);
}

finalizar.addEventListener('click', () => {
    const gridModelo = document.querySelector('.grid-modelo');
    const id = gridModelo.getAttribute('data-id');
    closeModal();
    deletePlacas(id);
    setTimeout( () => { location.reload(true) },1200);
})

//FECHAR MODAL
const closeModal = () => {
    modal.classList.add('hide');
    containerModal.classList.add('hide');
}

//FUNÇÃO QUE VERIFICA SE FOI CLICADO EM EDITAR OU EXCLUIR
const editExit = (e) => {
    
    if( e.target.type == 'button' ){
        const [action, index] = e.target.dataset.id.split('-');
        
        if( action == 'edit' ){
            editClient(index);           
        }else{
            openModal(e, index); 
            const id = document.querySelector('.grid-modelo');
            id.setAttribute('data-id', index);          
        }
    }    
}

tableByRegister.addEventListener('click', editExit);

updateClient();

//ADICIONA UM 0
const zeroFill = n => {
    return ('0' + n).slice(-2);
}

//DATA ATUAL
const interval = setInterval(() => {  
    const now = new Date();   
    const hour = zeroFill(now.getHours()) + ':' + zeroFill(now.getMinutes());    
    horaInput.value = hour;
    const elementHour = document.querySelector('#hora').value;
    const hourActual = elementHour.replace(':', '');
    horaInput.setAttribute('data-horaatual', hourActual)
}, 1000);