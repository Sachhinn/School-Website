const mySelect = document.getElementById('update')
let myLabel = document.getElementById('label-updated')
let myInput = document.getElementById('updated')
let otherDetails = document.getElementById('other-details')
let selectedOption;
let toUpdate;
let finalValue;

function updateSelectedOption() {
    selectedOption = mySelect.options[mySelect.selectedIndex];
    myLabel.innerHTML = `Update ${selectedOption.innerHTML}: `;
}
updateSelectedOption();
let myValue = mySelect.value
mySelect.addEventListener('change', (event) => {
    myValue = event.target.value
    otherDetails.classList.remove('hidden')
    document.getElementById('gender').classList.add('hidden')
    document.getElementById('category').classList.add('hidden')
    document.getElementById('paymentStatus').classList.add('hidden')
    updateSelectedOption();
    if (myValue == "dob") {
        myInput.type = "date"
        myLabel.innerHTML = "Update Date of Birth: "
    }
    else {
        myInput.type = 'text'
    }
    if (myValue == "category") {
        document.getElementById('category').classList.remove('hidden')
        otherDetails.classList.add('hidden')
    }
    if (myValue == "gender") {
        document.getElementById('gender').classList.remove('hidden')
        otherDetails.classList.add('hidden')
    }
    if (myValue == "paymentStatus") {
        document.getElementById("paymentStatus").classList.remove('hidden')
        otherDetails.classList.add('hidden')
    }
})

async function update(person) {
    if (myValue == "gender") {
        const gender = document.getElementsByName('gender')
        gender.forEach(radio => {
            if (radio.checked) {
                toUpdate = radio.value;
            }
        })
    }
    if (myValue == 'category') {
        const category = document.getElementsByName('category')
        category.forEach(radio => {
            if (radio.checked) {
                toUpdate = radio.value;
            }
        })
    }
    if (myValue == "paymentStatus") {
        const status = document.getElementsByName('paymentStatus')
        status.forEach(radio => {
            if (radio.checked) {
                toUpdate = radio.value;
            }
        })
    }
    else {
        toUpdate = myInput.value
    }
    let stud = [
        document.getElementById('first-name').value,
        document.getElementById('last-name').value,
        document.getElementById('father-name').value,
        myValue, // Detail to be updated
        toUpdate //Updated data
    ]
    let body =
    {
        name: { first: stud[0], last: stud[1] },
        father: stud[2],
        toUpdate: stud[3],//parameter 
        updatedValue: stud[4] //new value
    }
    let a = await fetch('/updateData', {
        method: "POST",
        headers: {
            'Content-Type': 'application/json',
            'update': person
        },
        body: JSON.stringify(body)
    }).then(async (response) => {
        console.log(await response.json())
    })
}

async function updateTeacher() {
        if (myValue == "gender") {
        const gender = document.getElementsByName('gender')
        gender.forEach(radio => {
            if (radio.checked) {
                toUpdate = radio.value;
            }
        })
    }
        if (myValue == "paymentStatus") {
        const status = document.getElementsByName('paymentStatus')
        status.forEach(radio => {
            if (radio.checked) {
                toUpdate = radio.value;
            }
        })
    }
    else {
        toUpdate = myInput.value
    }
    let stud = [
        document.getElementById('first-name').value,
        document.getElementById('last-name').value,
        document.getElementById('father-name').value,
        myValue, // Detail to be updated
        toUpdate //Updated data
    ]
    let body =
    {
        name: { first: stud[0], last: stud[1] },
        father: stud[2],
        toUpdate: stud[3],//parameter 
        updatedValue: stud[4] //new value
    }
    let a = await fetch('/updateTeacher', {
        method: "POST",
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(body)
    }).then(async (response) => {
        console.log(await response.json())
    })
}