async function sendData(mainElement) {
    //take a single element
    //parse all inputs of element
    let inputs = {}
    let obj = inputs;
    let inputElements = mainElement.getElementsByTagName('input');
    let selectElements = mainElement.getElementsByTagName('select');
    for (const element of inputElements) {
        if(element.getAttribute('type') == 'radio'){
            if(!element.checked){
                continue;
            }
        }
        if(element.name.includes('.')){
            let keys = element.name.split('.');
            for (let i = 0; i < keys.length-1; i++) {
                if(!(keys[i] in obj)){
                    obj[keys[i]] = {}
                }
                obj = obj[keys[i]]
            }
            obj[keys[keys.length-1]] = element.value
            obj = inputs;
        }
        else{
            obj[element.name] = element.value;
        }
    }
    for (let element of selectElements) {
        let insideElement = element.options[element.selectedIndex]
            if(element.name.includes('.')){    // means the value should be an object
                let keys = element.name.split('.');
                for (let i = 0; i < keys.length-1; i++) { // uptil the second last value
                    if(!(keys[i] in obj)){ // if there's no parameter with that name
                    obj[keys[i]] = {}// then create on
                    }
                obj = obj[keys[i]] // assigning the obj to the inner object. Note: it does not assign the input 
                }
                obj[keys[keys.length-1]] = element.value // assigning the last value to last nested object
                obj = inputs; // going back to the outermost object
            }
            if(element.name in obj){  // for elements with same name but multiple values i.e. preferredSubjects
                if (!Array.isArray(obj[element.name])){
                    temp = obj[element.name]
                    obj[element.name] = [temp , element.value]

                }
                else{
                    obj[element.name].push(element.value)
                }
            }
            else{
                obj[element.name] = insideElement.value;
            }
        }
    //assigning the value of input elements to the names of the input within an object
    //send the object as body of post requst
    let a = fetch('/teachers/new', {method:"POST",
        headers:{"Content-Type":"application/json"},
        body:JSON.stringify(inputs)
    }).then(async response=> {
        if(!response.ok){
            if(response.status === 404){
                throw new Error("Please check the details you mentioned!")
            }
            else{
                throw new Error("Internal Error")
            }
        }
        return response.json()
    })
        .then( data =>{
                alert(data.message)
                window.location.href = `/profile/${data.id}?type=Teachers`   
    })
        .catch(error =>{
            alert(error)
        })
}
// sendData(document.getElementById('main-panel'))
// function setNestedProperty(obj, path, value) {
//     // Split the path string into an array of keys (e.g., ["name", "first"])
//     const keys = path.split('.');
    
//     // Iterate through the keys, creating nested objects if they don't exist
//     // All but the last key will be object properties that need to be created if missing
//     for (let i = 0; i < keys.length - 1; i++) {
//         const key = keys[i];
//         if (!(key in obj) || typeof obj[key] !== 'object' || obj[key] === null) {
//             obj[key] = {}; // Create an empty object if it doesn't exist or is not an object
//         }
//         obj = obj[key]; // Move deeper into the object
//     }
    
//     // Set the value at the last key
//     obj[keys[keys.length - 1]] = value;
// }

// // Your main code part
// let inputs = {};
// let mainElement = document.getElementById('main-panel')
// let inputElements = mainElement.getElementsByTagName('input');
// let selectElements = mainElement.getElementsByTagName('select'); // Still unused for now

// for (const element of inputElements) {
//     if (element.name) { // Ensure the input has a name attribute
//         setNestedProperty(inputs, element.name, element.value);
//         console.log(`Setting ${element.name} to ${element.value}`);
//     }
// }

// // You can iterate over selectElements similarly if their names also use dot notation
// for (const element of selectElements) {
//     if (element.name) {
//         setNestedProperty(inputs, element.name, element.value);
//         console.log(`Setting ${element.name} to ${element.value}`);
//     }
// }

// console.log('Final inputs object:', inputs);