const mainSelector = document.querySelector('main');
const searchSelector = document.getElementById('search');
let switchSelector;
let employeeData;

fetchEmployee(12);

function fetchEmployee(employeeCount) {
     fetch(`https://randomuser.me/api/?results=${employeeCount}&inc=name,email,location,cell,dob,picture`)
          .then(response => response.json())
          .then(data => createEmployeesObject(data.results))
          .then(object => createEmployeeCards(object))
          .catch(error => console.log('Woops! Looks like there was a problem.', error));
}

function createEmployeesObject(data) {
     let employees = [];
     for(let i = 0; i < data.length; i++) {
          const birthday = new Date(data[i].dob.date);
          const employee = {
               name: `${data[i].name.first} ${data[i].name.last}`,
               email: data[i].email,
               phone: data[i].cell,
               city: data[i].location.city,
               address: `${data[i].location.street.number} ${data[i].location.street.name} ${data[i].location.city}, ${data[i].location.state} ${data[i].location.postcode}`,
               birthday: `${birthday.getMonth()}/${birthday.getDay()}/${birthday.getFullYear().toString().slice(2,4)}`,
               picture: data[i].picture.large
          };
          employees.push(employee);
     }
     employeeData = employees;
     return employees;
}

function createEmployeeHTML(employee) {
     let employeeHTML = `
               <div class="card" tabindex="0">
                    <img src="${employee.picture}" alt="${employee.name}, an employee of awesome startup">
                    <div class="employee-info">
                         <p class="name">${employee.name}</p>
                         <a href=mailto:${employee.email}>${employee.email}</a>
                         <p>${employee.city}</p>
                    </div>
               </div>
          `
     return employeeHTML;
}


function createEmployeeCards(employees) {
     html = '';
     employees.forEach(employee => {
          html += createEmployeeHTML(employee);
     });
     mainSelector.innerHTML = html;
}

function getEmployeeData(employeeName) {
     for (let i = 0; i < employeeData.length; i++){
          if(employeeData[i].name === employeeName){
               return employeeData[i];
          }
     }
}

function checkOverlayExists(){
     firstElement = mainSelector.firstElementChild;
     if(firstElement.id === 'overlay'){
          firstElement.remove();
     };
}

function createEmployeeOverlay(employee){
     let employeeHTML = `
     <div id="overlay">
          <div id="lightbox-card">
               <p class="close">X</p>
               <img src="${employee.picture}" alt="${employee.name}, an employee of awesome startup">
               <p id="name" class="name">${employee.name}</p>
               <a href=mailto:${employee.email}>${employee.email}</a>
               <p>${employee.city}</p>
               <div class="lightbox-card-bottom">
                    <a href="tel:${employee.phone}">${employee.phone}</a>
                    <p>${employee.address}</p>
                    <p>${employee.birthday}</p>
                    <div class=lightbox-switch-employee>
                         <p class="back">&lt;</p>
                         <p class="forward">&gt;</p>
                    </div>
               </div>
          </div>
     </div>
     `
     mainSelector.insertAdjacentHTML("afterbegin",employeeHTML);
}

function setEventListener(employee){
     switchSelector.addEventListener('click', (e) => {
          target = e.target;
          const employeeIndex = employeeData.indexOf(employee);
          console.log(employeeIndex);
          if(target.className === 'forward' && employeeIndex < 11) {
               checkOverlayExists();
               createEmployeeOverlay(employeeData[employeeIndex + 1])
          }
          if(target.className === 'back' && employeeIndex > 0) {
               checkOverlayExists();
               createEmployeeOverlay(employeeData[employeeIndex - 1])
               
          }
     switchSelector = document.querySelector('.lightbox-switch-employee');
     const nextEmployee = getEmployeeData(document.getElementById('name').textContent)
     setEventListener(nextEmployee);
     });
}

document.addEventListener( 'focus', (e) => {
     target = e.target;
     if(target.className === 'card'){
          const employeeName = target.firstElementChild.nextElementSibling.firstElementChild.textContent;
          const employee = getEmployeeData(employeeName);
          
          // check for existing overlay
          checkOverlayExists();
          // create employee overlay
          createEmployeeOverlay(employee);
          // set selector for overlay employee switch
          switchSelector = document.querySelector('.lightbox-switch-employee');
          setEventListener(employee);
     }
}, true);

document.addEventListener('click', (e) => {
     target = e.target;
     if(target.className === 'close'){
          mainSelector.firstElementChild.remove();
     }
});

searchSelector.addEventListener('input', (e) => {
     const name = e.target.value;
     let employees = [];
     for(let i = 0; i < employeeData.length; i++){
          if(employeeData[i].name.toLowerCase().includes(name.toLowerCase())){
               employees.push(employeeData[i]);
          }
     }
     createEmployeeCards(employees);
});