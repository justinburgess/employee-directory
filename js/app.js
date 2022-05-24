/*
*    global variables
*/

//   selectors
const searchSelector = document.getElementById('search');
const overlaySelector = document.getElementById('overlay');
const cardsSelector = document.getElementById('cards');

//   stores current page data -- does not store session data
let employeeData;


//   populate page with employee data
fetchEmployee(12);

/*
*    functions
*/

//   obtains employee data from API, stores data and creates employee cards in the DOM
function fetchEmployee(employeeCount){
     fetch(`https://randomuser.me/api/?results=${employeeCount}&inc=name,email,location,cell,dob,picture`)
          .then(response => response.json())
          .then(data => createEmployeesObject(data.results))
          .then(object => createEmployeeCards(object))
          .catch(error => console.log('Woops! Looks like there was a problem.', error));
}

//   creates and stores object data for current page
function createEmployeesObject(data){
     let employees = [];
     for(let i = 0; i < data.length; i++) {
          const birthday = new Date(data[i].dob.date);
          const birthMonth = (birthday.getMonth() + 1).toString().padStart(2,'0');
          const birthDay = birthday.getDate().toString().padStart(2,'0');
          const birthYear = birthday.getFullYear().toString().slice(2,4);
          const employee = {
               name: `${data[i].name.first} ${data[i].name.last}`,
               email: data[i].email,
               phone: data[i].cell,
               city: data[i].location.city,
               address: `${data[i].location.street.number} ${data[i].location.street.name} ${data[i].location.city}, ${data[i].location.state} ${data[i].location.postcode}`,
               birthday: `${birthMonth}/${birthDay}/${birthYear}`,
               birthdayData: birthday,
               picture: data[i].picture.large
          };
          employees.push(employee);
     }
     employeeData = employees;
     return employees;
}

//   creates card html
function createEmployeeHtml(employee){
     let employeeHTML = `
               <div class="card" tabindex="0">
                    <img src="${employee.picture}" alt="${employee.name}, an employee of awesome startup">
                    <div class="employee-info">
                         <p class="name">${employee.name}</p>
                         <a href=mailto:${employee.email}>${employee.email}</a>
                         <p>${employee.city}</p>
                    </div>
               </div>
          `;
     return employeeHTML;
}

//   updates DOM with card html
function createEmployeeCards(employees){
     let html = '';
     employees.forEach(employee => {
          html += createEmployeeHtml(employee);
     });
     cardsSelector.insertAdjacentHTML('afterbegin', html);
}

//   returns employee data based on employee name
function getEmployeeData(employeeName){
     const employee = employeeData.filter(data => data.name === employeeName);
     return employee[0];
}

//   creates html for employee modal window and inserts into DOM
function createEmployeeOverlayHtml(employee){
     let employeeHTML = `
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
                         <p class="backward">&lt; Previous</p>
                         <p class="forward">Next &gt;</p>
                    </div>
               </div>
          </div>
     
     `;
     return employeeHTML;
}

//   removes next or previous modal buttons if at begin or end of employees
function checkEmployeeIndex(employeeIndex){
     if(employeeIndex >= 11){
          document.querySelector('.forward').remove();
     } else if(employeeIndex <= 0){
          document.querySelector('.backward').remove();
     }
}

//   opens modal window when card is selected
function openModalWindow(target){
     const employeeName = target.firstElementChild.nextElementSibling.firstElementChild.textContent;
     const employee = getEmployeeData(employeeName);
     const employeeOverlayHtml = createEmployeeOverlayHtml(employee);
     if(overlaySelector.firstElementChild){
          overlaySelector.firstElementChild.remove();
     }
     overlaySelector.insertAdjacentHTML('afterbegin', employeeOverlayHtml);
     checkEmployeeIndex(employeeData.indexOf(employee));
     overlaySelector.style.display = '';
}

//   switches employee data in modal window based on button selected
function switchEmployeeOverlay(className){
     const employeeName = overlaySelector.firstElementChild.firstElementChild.nextElementSibling.nextElementSibling.textContent;
     const employee = getEmployeeData(employeeName);
     const employeeIndex = employeeData.indexOf(employee);
     const nextEmployeeIndex =  className === 'forward' ? employeeIndex + 1 : employeeIndex - 1;
     const employeeOverlayHtml = createEmployeeOverlayHtml(employeeData[nextEmployeeIndex]);
     overlaySelector.firstElementChild.remove();
     overlaySelector.insertAdjacentHTML('afterbegin', employeeOverlayHtml);
     checkEmployeeIndex(nextEmployeeIndex);
}

// /*
// *    listeners
// */

//   opens modal window when card is focused
document.addEventListener('focus', (e) => {
     const target = e.target;
     if(target.className === 'card'){
          openModalWindow(target);
     }
}, true);

//   switches employee info displayed in modal window
overlaySelector.addEventListener('click', (e) => {
     const target = e.target;
     if(target.className === 'forward' || target.className === 'backward'){
          switchEmployeeOverlay(target.className);
     }
});

//   closes modal window when 'X' is clicked
document.addEventListener('click', (e) => {
     const target = e.target;
     if(target.className === 'close'){
          overlaySelector.firstElementChild.remove();
          overlaySelector.style.display = 'none';
     }
});

//   searches employee names as user enters input data
searchSelector.addEventListener('input', (e) => {
     const name = e.target.value;
     let employees = [];
     for(let i = 0; i < employeeData.length; i++){
          if(employeeData[i].name.toLowerCase().includes(name.toLowerCase())){
               employees.push(employeeData[i]);
          }
     }
     cardsSelector.replaceChildren();
     createEmployeeCards(employees);
});