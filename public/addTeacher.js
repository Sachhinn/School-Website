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
                console.log(`${element.getAttribute('type')} was not checked. Skipping to another iteration`)
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
            if(element.name in obj){
                console.log(`${element.name} is in the object.`)
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
    //assign the value of input elements to the names of the input within an object
    //send the object as body of get requst
    let a = await fetch('/teachers/new', {method:"POST",
        headers:{"Content-Type":"application/json"},
        body:JSON.stringify(inputs)
    }).then(async response=>{
        console.log(await response.json())
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