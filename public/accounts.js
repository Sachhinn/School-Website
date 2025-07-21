function upTeachers(){
    for (let i = 0; i <unpaidTeachers.length && i < 3; i++) {
      const newDocDiv = document.createElement('div');
      newDocDiv.classList.add('notice-section');
      const container = document.getElementById('pendingSalaries')
      container.appendChild(newDocDiv)
      if (unpaidTeachers[i].first){
        let newDoc = document.createElement('p');
        newDoc.textContent =`${unpaidTeachers[i].first}       ${unpaidTeachers[i].last}`
        newDocDiv.appendChild(newDoc);
        if (unpaidTeachers[i].id) {
          newDoc = document.createElement('p')
          newDoc.textContent = unpaidTeachers[i].id;
          newDocDiv.appendChild(newDoc);
        }
      }
      else{
        i--;
      }
    }
}
function upStudents(){
    for (let i = 0; i <unpaidStudents.length && i < 3; i++) {
      const newDocDiv = document.createElement('div');
      newDocDiv.classList.add('notice-section');
      const container = document.getElementById('pendingFees')
      container.appendChild(newDocDiv)
      if (unpaidStudents[i].first){
        let newDoc = document.createElement('p');
        newDoc.textContent =`${unpaidStudents[i].first}       ${unpaidStudents[i].last}`
        newDocDiv.appendChild(newDoc);
        if (unpaidStudents[i].id) {
          newDoc = document.createElement('p')
          newDoc.textContent = unpaidStudents[i].id;
          newDocDiv.appendChild(newDoc);
        }
      }
      else{
        i--;
      }
    }
}
upStudents();
upTeachers();