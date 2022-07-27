// Resources:
// toLocaleTimeString: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date/toLocaleTimeString
// Image: https://pixabay.com/images/id-2643089/

//Data
const $settingsBtn = document.getElementById('settings-btn')
const $settings = document.getElementById('settings')
const $colourSelection = document.getElementById('colours')
const $saveBtn = document.getElementById('save-btn')
const $revealDateBtn = document.getElementById('reveal-date-btn')
const $fullDate = document.getElementById('full-date')
const $greeting = document.getElementById('greeting')
const $timeDisplay = document.getElementById('time-display')
const $page = document.querySelector('body')
let currentDate = new Date()

//Code
// The class "hidden" on a specified element is toggled to reveal or hide it
function toggleItem(item){
    item.classList.toggle('hidden')
}

// Adds colour to the main text: the greeting, the time, and the date
function setColour(){
    // If no colour is stored, the default is white
    if(!localStorage.getItem('colour')){
        $greeting.setAttribute('style', `color: #fff;`)
        $timeDisplay.setAttribute('style', `color: #fff;`)
        $fullDate.setAttribute('style', `color: #fff;`)
    }
    // If a colour is stored, it is applied
    else{
        $greeting.setAttribute('style', `color: #${localStorage.getItem('colour')};`)
        $timeDisplay.setAttribute('style', `color: #${localStorage.getItem('colour')};`)
        $fullDate.setAttribute('style', `color: #${localStorage.getItem('colour')};`)
        // The stored colour appears "selected" in the settings panel even when the page is reloaded by the user
        $colourSelection.value = localStorage.getItem('colour')
    }
}

// Given the date, a NASA APOD is set as the page's background image 
function setImage(date){
    fetch(`https://api.nasa.gov/planetary/apod?api_key=aVD2StscD8HavxXpaEHapJNw6fn9dAeMhAsMj750&date=${date.getFullYear()}-${parseInt(date.getMonth())+1}-${date.getDate()}&thumbs=True`)
        .then(function(response){
            return response.json()
        })
        .then(function(imageData){
            console.log(imageData)

            //Check if APOD is a video (if so, use placeholder image instead)
            if(imageData.media_type === 'video'){
                $page.setAttribute('style', `background-image: url(images/stars.jpg);`)
            }
            //If APOD is an image, display it
            else{
                $page.setAttribute('style', `background-image: url(${imageData.hdurl});`)
            }
        }
    )
}

// The stored or default time format appears "selected" in the settings panel even when the page is reloaded by the user
function checkFormat(){
    if(!localStorage.getItem('format')){
        $settings.elements['time-format'].value = '12'
    }
    else{
        $settings.elements['time-format'].value = localStorage.getItem('format')
    }
}

// A different greeting is diplayed depending on the hour of the day
function displayGreeting(date){
    if(date.getHours() >= 5 && date.getHours() <= 11){
        $greeting.textContent = 'Good morning! The time is:'
    }
    else if(date.getHours() >= 12 && date.getHours() <= 16){
        $greeting.textContent = 'Good afternoon! The time is:'
    }
    else if(date.getHours() >= 17 && date.getHours() <= 20){
        $greeting.textContent = 'Good evening! The time is:'
    }
    else{
        $greeting.textContent = 'Good night! The time is:' 
    }
}

// The content is updated based on the updated date
function updateContent(date){
    // Displays time in 24-hr format, if stored by user
    if(localStorage.getItem('format') === '24'){
        $timeDisplay.textContent = date.toLocaleTimeString('en-US', {hour12: false})
    }
    // Otherwise displays time in 12-hr format
    else{
        $timeDisplay.textContent = date.toLocaleTimeString('en-US', {hour12: true})
    }

    // The updated date/time is passed to decide on a greeting
    displayGreeting(date)

    // The full date is updated
    $fullDate.textContent = date.toDateString()
}

// The date/time are updated every second
function clock(){
    updateContent(currentDate)
    setInterval(function(){
        let updatedDate = new Date()
        updateContent(updatedDate)

        // If the date has changed since the user has loaded the page, the APOD is updated
        if(updatedDate.toDateString() != currentDate.toDateString()){
            currentDate = updatedDate
            setImage(currentDate)
        }
    }, 1000)
}


//Run
// When the page is loaded, the NASA background image is added based on the current date
setImage(currentDate)

// The clock is displayed
clock()

// The stored colour option is set, or the default is applied
setColour()

// The stored or default settings are shown in the settings panel
checkFormat()

// When the settings and arrow buttons are clicked, they reveal or hide information
$settingsBtn.addEventListener('click', function(){
    toggleItem($settings)
})
$revealDateBtn.addEventListener('click', function(){
    toggleItem($fullDate)
})

// When settings are saved, they are updated in the local storage and applied to the document
$settings.addEventListener('submit', function(event){
    event.preventDefault()

    localStorage.setItem('format', $settings.elements['time-format'].value)
    localStorage.setItem('colour', $colourSelection.value)
    
    checkFormat()
    setColour()
})