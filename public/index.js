let server_res = [];
async function readData() {
  let a = await fetch("/readData", { method: "POST" }).then((response) => {
    if (!response.ok) {
      console.error(`Error fetching Data: ${response.statusText}`);
      throw new Error("error");
    } else {
      return response.json();
    }
  });
  let names = [];
  a.forEach((element) => {
    names.push(element.name);
  });
  let screen = document.querySelector(".screen");
  screen.innerHTML = "";
  console.log(names);
  names.forEach((element) => {
    screen.innerHTML += `hello${element}<br>`;
  });
}
async function createData() {
  let obj = {
    name: document.querySelector("#name-input").value,
    email: document.querySelector("#email-input").value,
  };
  let a = await fetch("/createData", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(obj),
  });
}

async function updateData() {
  let obj = {
    name: document.querySelector("#name-input").value,
    email: document.querySelector("#email-input").value,
  };
  let a = await fetch("/updateData", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify(obj),
  }).then(async (response) => {
    if (!response.ok) {
      console.log(
        "Error getting the response from server: ",
        response.statusText
      );
      return;
    }
    const contentType = response.headers.get("Content-Type");
    if (!contentType || !contentType.includes("application/json")) {
      console.log(
        "UNEXPECTED Content-Type: NO JSON FILE SENT BY THE SERVER",
        contentType
      );
      const textData = await response.text();
      console.log(`Server response (non-json): ${textData}`);
      return;
    } else {
      return response.json();
    }
  });
  document.querySelector(".screen2").innerHTML =
    "<br>Data Updated successfully";
}
async function deleteData() {
  let obj = {
    name: document.querySelector("#name-input").value,
    email: document.querySelector("#email-input").value,
  };
  let a = await fetch("/deleteData", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify(obj),
  }).then(async (response) => {
    if (!response.ok) {
      console.log(
        "Error getting the response from server: ",
        response.statusText
      );
      return;
    }
    const contentType = response.headers.get("Content-Type");
    if (!contentType || !contentType.includes("application/json")) {
      console.log(
        "UNEXPECTED Content-Type: NO JSON FILE SENT BY THE SERVER",
        contentType
      );
      const textData = await response.text();
      console.log(`Server response (non-json): ${textData}`);
      return;
    } else {
      return response.json();
    }
  });
}

//Upcoming Events ----------------------------------------
for (let i = 0; i < eventData.length && i < 3; i++) {

  const newDocDiv = document.createElement('div');
  newDocDiv.classList.add('notice-section');
  const container = document.getElementById('notice')
  container.appendChild(newDocDiv)
  if (eventData[i].eventName){
    let newDoc = document.createElement('p');
    newDoc.textContent = eventData[i].eventName;
    newDocDiv.appendChild(newDoc);
    if (eventData[i].eventDate) {
      newDoc = document.createElement('p')
      newDoc.textContent = eventData[i].eventDate;
      newDocDiv.appendChild(newDoc);
    }
    if (eventData[i].organizer) {
      newDoc = document.createElement('p')
      newDoc.textContent = eventData[i].organizer;
      newDocDiv.appendChild(newDoc);
    }
  }
  else{
    i--;
  }
}
//Numbers of Students/Teachers
let cards = document.getElementsByClassName('card-content')
let firstP = cards[0].getElementsByClassName('content-p2')
firstP[0].textContent = students
firstP = cards[1].getElementsByClassName('content-p2');
firstP[0].textContent = teachers

