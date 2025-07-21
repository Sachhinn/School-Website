async function sendData() {
    console.log("sending data")
    let stud = [
        document.getElementById('first-name').value,
        document.getElementById('last-name').value,
        document.getElementById('father-name').value,
        document.getElementById('standard').value,
        document.getElementById('dob').value
    ]
    const genderRadios = document.getElementsByName('gender');
    let selectedGender = '';
    genderRadios.forEach(radio =>{
        if(radio.checked){
            selectedGender = radio.value;
            console.log('Gender:',radio.value);
        }
    })
    const category = document.getElementsByName('Category');
    let sCategory = '';
    category.forEach(cat=>{
        if(cat.checked){
            sCategory = cat.value;
        }
    })
    stud.push(selectedGender)
    stud.push(sCategory)
    let obj = {
        name:{
            first:stud[0],
            last:stud[1],
        },
        father:stud[2],
        forClass:stud[3],
        dob:stud[4],
        gender:stud[5],
        category:stud[6],
        admissionDate:stud[7]
    }
    let a =await  fetch('/admission/submit',{
        method:'POST',
        headers:{'Content-Type':'application/json'},
        body:JSON.stringify(obj)
    }).then(async response=>{console.log(await response.json())})
}
async function readData(coll){
    let data = await fetch('/readData',{
        method:"POST",
        body:coll
    }).then(async response =>{
        let data = await response.json()
        return data
    })
    let i = 0;
    let mainc = document.getElementsByClassName('list-container')
    mainc = mainc[0]
    for (const element of data) {
        let container;
        if(element.name!==undefined){
            container = document.createElement('p')
            container.innerText = `${element.name.first} ${element.name.last}`;
            mainc.appendChild(container)
        }
        else{
            i++;
        }
    }
    if (i>0){
        console.log(`${i} person(s) does not have an actual name kindly check`)
    }
}
if(document.getElementById('Student-list')){
    readData('Students')
}
if(document.getElementById('Teachers-list')){
    readData('Teachers')
}