//=================== js chart =====================//
const trafficCanvas = document.getElementById('traffic-chart');
const dailyCanvas = document.getElementById("daily-chart");
const mobileCanvas = document.getElementById("mobile-chart");
const trafficInterval = document.querySelector(".traffic-nav");


// js chart data
let trafficData = trafficDataMonthly  = {
    labels: ["16-22", "23-29", "30-5", "6-12", "13-19", "20-26", "27-3",
    "4-10", "11-17", "18-24", "25-31"],
    datasets: [{
        data: [750, 1250, 1000, 2000, 1500, 1750, 1250, 1850, 2250, 1500,
        2500],
        backgroundColor: 'rgba(116, 119, 191, .3)',
        borderWidth: 1,
        }]
};

let trafficDataHourly = {
    labels: ["01:00", "02:00", "03:00", "04:00", "05:00", "06:00", "07:00",
    "08:00", "09:00", "10:00", "11:00", "12:00"],
    datasets: [{
        data:  [1250, 1850, 1000, 2000,  1750, 750, 1250,  2250, 1500,
        2500, 1500, 300],
        backgroundColor: 'rgba(116, 119, 191, .3)',
        borderWidth: 1,
        }]
};

let trafficDataDaily = {
    labels: ["01:00", "03:00", "05:00", "07:00", "09:00", "11:00", "13:00",
    "15:00", "17:00", "19:00", "21:00", "23:00", "01:00"],
    datasets: [{
        data:  [ 1850, 2500, 1000, 1250, 1750, 750, 2000, 1250,  2250, 1500,
        1500, 450, 1700],
        backgroundColor: 'rgba(116, 119, 191, .3)',
        borderWidth: 1,
        }]
};

let trafficDataWeekly = {
    labels: ["Thurs", "Fri", "Sat", "Sun", "Mon", "Tues", "Wed"],
    datasets: [{
        data:  [1000, 2500, 750, 1250, 1750, 2000, 1250],
        backgroundColor: 'rgba(116, 119, 191, .3)',
        borderWidth: 1,
        }]
};

let trafficOptions = {
    backgroundColor: 'rgba(112, 104, 201, .5)',
    fill: true,
    aspectRatio: 2.5,
    animation: {
        duration: 0
    },
    scales: {
        y: {
        beginAtZero: true
        }
    },
    plugins: {
        legend: {
        display: false
        }
    }
};

let trafficChart = new Chart(trafficCanvas, {
    type: 'line',
    data: trafficData,
    options: trafficOptions
    });    

    // data for daily traffic bar chart
const dailyData = {
    labels: ["S", "M", "T", "W", "T", "F", "S"],
    datasets: [{
        label: '# of Hits',
        data: [75, 115, 175, 125, 225, 200, 100],
        backgroundColor: '#7477BF',
        borderWidth: 1
        }]
    };

const dailyOptions = {
    scales: {
        y: {
            beginAtZero: true
        }
    },
    plugins: {
        legend: {
            display: false
        }
    }
};

let dailyChart = new Chart(dailyCanvas, {
    type: 'bar',
    data: dailyData,
    options: dailyOptions
    });

const mobileData = {
    labels: ["Desktop", "Tablet", "Phones"],
    datasets: [{
        label: '# of Users',
        data: [2000, 550, 500],
        borderWidth: 0,
        backgroundColor: [
            '#7477BF',
            '#78CF82',
            '#51B6C8'
        ]
    }]
};

const mobileOptions = {
    aspectRatio: 1.9,
    plugins: {
        legend: {
            position: 'right',
            labels: {
            boxWidth: 20,
            fontStyle: 'bold'
            }
        }
    }
};

let mobileChart = new Chart(mobileCanvas, {
    type: 'doughnut',
    data: mobileData,
    options: mobileOptions
});

// traffic interval selection
trafficInterval.addEventListener('click', e => {
    const element = e.target;
    if (element.tagName === 'LI' && (!element.classList.contains('highlight'))) {
        const intervals = trafficInterval.children;
        for (let i = 0; i < intervals.length; i++) {
            let interval = intervals[i];
            if (interval.classList.contains('highlight')) {
                interval.classList.remove('highlight');
            }
        }
        element.classList.add('highlight');
    }
    if (element.textContent === 'hourly') { 
        trafficChart.data = trafficDataHourly;
        trafficChart.update(); }
    if (element.textContent === 'daily') { 
        trafficChart.data = trafficDataDaily;
        trafficChart.update();}
    if (element.textContent === 'weekly') { 
        trafficChart.data = trafficDataWeekly;
        trafficChart.update();
    }
    if (element.textContent === 'monthly') { 
        trafficChart.data = trafficDataMonthly 
        trafficChart.update();
    }
})

//================== local storage ====================//

// data object
let webAppStorage;

if (localStorage.getItem('data')) {
    data = localStorage.getItem('data');
    webAppStorage = JSON.parse(data);
} else {
    // default settings storage object
    webAppStorage = {
        emailNotificationsIsOn : false,
        publicProfileIsOn: false,
        selectedTimezone : 'Select Timezone',
        notificationsAvailable : true,
        notificationMessages : [
            {
                message: 'Dan Oliver requested access to your page',
                notClicked: true,
            },
            {
                message: 'Dawn Wood sent you a message',
                notClicked: true,
            },
            {
                message: 'Dale Byrd shared his page with you',
                notClicked: true,
            },
            {
                message: 'Your password expires in 6 days',
                notClicked: true,
            },
            {
                message: 'Dale Byrd posted on your page',
                notClicked: true,
            },
            {
                message: 'Today is Dan Oliver\'s birthday',
                notClicked: true,
            },
        ]
    }
}


//================== alert banner ======================//

const alertBanner = document.getElementById('alert');

// create html for the banner
alertBanner.innerHTML = 
    `
        <div class="alert-banner flex">
            <p><strong>Alert:</strong> You have <strong>6</strong> overdue tasks to complete</p>
            <p class="alert-banner-close">x</p>
        </div>
    `
;

alertBanner.addEventListener('click', e => {
    const element = e.target;
    if (element.classList.contains("alert-banner-close")) {
        alertBanner.style.display = "none";
    }
});

//====================== notifications ========================//

const notificationIcon = document.getElementById("bell");
const notificationList = document.getElementById("bell-list");

// import settings
if (!webAppStorage.notificationsAvailable) {
    makeInvisible(notificationIcon.firstElementChild);
}

// create notification message texts
notificationMessageText = notifications => {
    let newNotifications = [];
    for (let i = 0; i < notifications.length; i++) {
        if (notifications[i].notClicked)
        newNotifications.push(notifications[i].message);
    }
    if (newNotifications.length === 0) {
        newNotifications.push("No new notifications");
    }
    return newNotifications;
};

// make element invisible
function makeInvisible(element) {
    return element.classList.add('invisible');
}

// make element invisible element visible
function makeVisible(element) {
    return element.classList.remove('invisible');
}

function changeVisibility(element) {
    if (element.className === 'invisible') {
        makeVisible(element);
    }
    if (element.className !== 'invisible') {
        makeInvisible(element);
    }
}


// disable notification list item
notificationList.addEventListener('click', event => {
    let availableNotifications = webAppStorage.notificationMessages;
    for (let i = 0; i < availableNotifications.length; i++) {
        if (availableNotifications[i].message === event.target.textContent) {
            availableNotifications[i].notClicked = false;
            event.target.remove();
        }
        if (event.target.textContent === "No new notifications") {
            event.target.remove();
        }
    }
});

// disable notification alert
notificationIcon.addEventListener('click', (e) => {
    createListElements(notificationList, notificationMessageText(webAppStorage.notificationMessages), "invisible");
    const element = e.target.firstElementChild;
    changeVisibility(element);
    webAppStorage.notificationsAvailable = false;
    const listItems = notificationList.childNodes;
    for(let i = 0; i < listItems.length; i++) {
        let listItem = listItems[i];
        if (listItem.className === 'invisible') {
            makeVisible(listItem);
        }    
    }
});

//======================= user messages =======================//

const user = document.getElementById("userField");
const searchResults = document.getElementById("search-results");
const message = document.getElementById("messageField");
const send = document.getElementById("send");
const userInfo = [
    {
        fullname: 'Victoria Chambers',
        email: 'victoria.chambers80@example.com',
    },
    {
        fullname: 'Dale Byrd',
        email: 'dale.byrd52@example.com',
    },
    {
        fullname: 'Dawn Wood',
        email: 'dawn.wood16@example.com',
    },
    {
        fullname: 'Dan Oliver',
        email: 'dan.oliver82@example.com',
    },
]

// user search autocomplete
user.addEventListener('input', (e) => {
    let lis = '';
    searchResults.style.display = '';
    user.style.color = '';
    for ( let i = 0; i < userInfo.length ; i++ ) {
        searchInput = e.target.value.toLowerCase();
        const user = userInfo[i];
        if ( searchInput !== '' && ( user.fullname.toLocaleLowerCase().includes(searchInput) || user.email.includes(searchInput) )) {
                lis += `<li>${user.fullname}</li>`;
        }
    }
    return searchResults.innerHTML = lis;
})

searchResults.addEventListener('click', e => {
    element = e.target;
    if (element.tagName === 'LI') {
        user.value = e.target.textContent;
        user.style.color = "#5665f0"
        searchResults.style.display = 'none';
    }
})

// send events
send.addEventListener('click', () => {
    // ensure user and message fields are filled out
    if (user.value === "" && message.value === "") {
    alert("Please fill out user and message fields before sending");
    } else if (user.value === "" ) {
    alert("Please fill out user field before sending");
    } else if (message.value === "" ) {
    alert("Please fill out message field before sending");
    } else {
    alert(`Message successfully sent to: ${user.value}`);
    }
});




// unordered list function
function createListElements (listElement, textObjects, elementClass="") {
    let lis = '';
    for (let i = 0; i < textObjects.length; i++){
        lis += `<li class="${elementClass}">${textObjects[i]}</li>`;
    }
    return listElement.innerHTML = lis;
}




//======================== Settings ======================//
const emailNotifications = document.getElementById("email-notifications");
const emailNotificationsOn = document.getElementById("email-notifications-on");
const emailNotificationsOff = document.getElementById("email-notifications-off");
const publicProfile = document.getElementById("public-profile");
const timezone = document.getElementById("timezone");

// settings import
emailNotifications.checked = webAppStorage.emailNotificationsIsOn;
publicProfile.checked = webAppStorage.publicProfileIsOn;
timezone.value = webAppStorage.selectedTimezone;
if (webAppStorage.emailNotificationsIsOn) {
    // console.log(`Email notifications are on: ${emailNotificationsIsOn}`);
    toggleStyling(emailNotifications, 'add');
};
if (webAppStorage.publicProfileIsOn) {
    // console.log(`Profile is public: ${publicProfileIsOn}`);
    toggleStyling(publicProfile, 'add');
};

function toggleStyling(element, application) {
    let toggle = element.nextElementSibling.nextElementSibling.firstElementChild;
    if (application === 'add') {
        toggle.style.position = "relative";
        toggle.style.color = "#fff";
        toggle.style.fontWeight = "bold";
    }
    if (application === 'remove') {
        toggle.style.position = "";
        toggle.style.color = "";
    }
}

// adds and removes 'On' font styling to toggle switch element based 'on' or 'off' status
function toggleSwitch(event) {
    let toggleOn = event.srcElement.checked;
    if (toggleOn) {
        toggleStyling(event.target, 'add');
    }
    if (!toggleOn) {
        toggleStyling(event.target, 'remove');
    }
}

// sets local storage variable and executes styling function
function toggleSwitchEmail(event) {
    webAppStorage.emailNotificationsIsOn = event.srcElement.checked;
    toggleSwitch(event);
}

// sets local storage variable and executes styling function
function toggleSwitchProfile(event) {
    webAppStorage.publicProfileIsOn = event.srcElement.checked;
    toggleSwitch(event);
}

// email notifications toggle switch listener
emailNotifications.addEventListener('click', toggleSwitchEmail);

// set profile to public toggle switch listener
publicProfile.addEventListener('click', toggleSwitchProfile);
    
// timezone setting listener
timezone.addEventListener('click', e => {
    webAppStorage.selectedTimezone = e.target.value; //stores in local storage variable
})

//================== save and reset data ====================//

// save button
const saveSettings = document.getElementById("save");

// reset settings button
const resetSettings = document.getElementById("cancel");

function resetToggle() {

}

saveSettings.addEventListener('click', e => {
    localStorage.setItem('data', JSON.stringify(webAppStorage));
});

resetSettings.addEventListener('click', () => {
    // clear local storage
    localStorage.clear();

    // reset email notifications to default
    emailNotifications.checked = false;
    toggleStyling(emailNotifications, 'remove');

    // reset public profile toggle to default
    publicProfile.checked = false;
    toggleStyling(publicProfile, 'remove');

    // reset timezone dropdown
    const zone = document.getElementById('timezone');
    zone.value = 'Select Timezone';
});
