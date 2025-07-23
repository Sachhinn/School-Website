let coll = window.location.search.split('=')
let path = window.location.pathname
let id = path.split('/')
async function remove() {
    let a = await fetch('/removeData', {
        method: "POST",
        headers: { "coll": coll[1] },
        body: id[id.length - 1]
    }).then(async response => {
        return await response.text()
    }).then(data => {
        alert(data)
        history.back()
    })
}
if (coll[1] == "Students"){
    document.getElementById("profileof").innerHTML = "Student Profile"
}
else{
    document.getElementById("profileof").innerHTML = "Teacher Profile"
}
function update(){
if(coll[1] == "Teachers")(
    window.location.href = `/Update_Teacher/?firstName=${profile.name.first}&lastName=${profile.name.last}&father=${profile.father}`
)
else{
    window.location.href = `/Update_Student/?firstName=${profile.name.first}&lastName=${profile.name.last}&father=${profile.father}`
}
}