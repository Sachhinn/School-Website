async function sendData() {
    console.log("sending data")
    let stud = [
        document.getElementById('first-name').value,
        document.getElementById('last-name').value,
        document.getElementById('father-name').value,
        document.getElementById('standard').value,
        document.getElementById('dob').value
    ]
    const admission = document.getElementById("admissionDate").value;
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
    stud.push(admission)
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
    let a =await  fetch('/addData',{
        method:'POST',
        headers:{'Content-Type':'application/json'},
        body:JSON.stringify(obj)
    })
    .then(async response=>{
        response = await response.json()
        console.log(response)
        alert("The Student's ID is :"+response+":")
        window.location.href = `/profile/${response}?type=Students`;
    })
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
    let aTag;
    let mainc = document.getElementsByClassName('list-container')
    mainc = mainc[0]
    for (const element of data) {
        let container;
        if(element.name!==undefined){
            aTag = document.createElement('a')
            aTag.href=`/profile/${element._id.toString()}?type=${coll}`
            container = document.createElement('p')
            container.innerText = `${element.name.first} ${element.name.last}`;
            mainc.appendChild(aTag)
            aTag.appendChild(container)
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