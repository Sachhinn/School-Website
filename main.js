import express from 'express';
import cron from 'node-cron'
import { connectDB, countItem, listDocument, sm, createDocument, income, expense, nonTeachingStaffSalaryExpense, TeachinStaffSalaryExpense, resetTeachersPaymentStatusMonthly, unpaidTeachers, unpaidStudents, profile , update } from './config/db.js';
import path from 'path';
import { fileURLToPath } from 'url';
const __fileName = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__fileName);

const app = express();
app.use(express.json())
app.use(express.text())
app.set('view engine', 'ejs');
app.use(express.static(path.join(__dirname, 'public')))
let i = 0;
let db = await connectDB().catch(e => { console.log(e.message) });
cron.schedule("0 0 0 1 * *", async () => {
    console.log("Running monthly payment status reset:::")
    await resetTeachersPaymentStatusMonthly();
}, {
    timezone: "Asia/Kolkata"
})
// app.use((req, res, next) => {
//   const visit = {
//     ip: req.ip,
//     path: req.originalUrl,
//     userAgent: req.headers['user-agent'],
//     time: new Date()
//   };
//   sm.collection('visits').insertOne(visit);
//   console.log(`A visit was made to your website:`)
//   console.log(visit.ip)
//   next();
// });
app.get('/', async (req, res) => {
    const students = await countItem('Students');
    const teachers = await countItem('Teachers');
    const events = await listDocument('Events');
    res.render('index', { students: students, teachers: teachers, events: events })
})
app.get('/admission', async (req, res) => {
    res.render('admission')
})
app.get('/All_Students', (req, res) => {
    res.render('allStudents')
})
app.get('/Update_Student', (req, res) => {
    res.render('updateStudent')
})
app.get('/Update_Teacher', (req, res) => {
    res.render('updateTeachers')
})
app.get('/Add_Teacher', async (req, res) => {
    res.render('addTeacher')
})
app.get('/All_Teachers', async (req, res) => {
    res.render('allTeachers')
})
app.get('/Accounts', async (req, res) => {
    let sendIncome = await income()
    let ntsSalary = await nonTeachingStaffSalaryExpense();
    let tsSalary = await TeachinStaffSalaryExpense();
    let otherExp = 100000
    let upTeachers = await unpaidTeachers(5)
    let upStudents = await unpaidStudents(5)
    res.render('accounts', { sendIncome, ntsSalary, tsSalary, otherExp, upTeachers, upStudents })
})
app.get('/profile/:id',async (req,res) =>{
    let Profile = await profile(req.query.type,req.params.id)
    if (req.query.type === "Teachers"){
        res.render("teacherProfile" , {stdProfile: Profile})
    }
    if (req.query.type === "Students"){
        res.render("teacherProfile" ,{stdProfile: Profile})
    }
})
app.post('/addData', async (req, res) => {
    let request = req.body;
    console.log(`Request for Admission: `)
    let newAdmission = await createDocument('Students', request)
    res.end(JSON.stringify(newAdmission.insertedId.toString()))
})
app.post('/readData', async (req, res) => {
    let coll = req.body;
    let response = await sm.collection(req.body).find().toArray()
    res.setHeader('Content-Type', 'application/json')
    res.status(200)
    res.end(JSON.stringify(response))
})
app.post('/teachers/new', async (req, res) => {
    i++;
    console.log(`Post request for Saving Data received::${i}`)
    let receivedData = req.body;
    if (receivedData.name.first != "" || receivedData.name.last != "" || receivedData.father != "") {
        let doesExist = await sm.collection('Teachers').findOne({ name: { first: receivedData.name.first, last: receivedData.name.last },father:receivedData.father})
        if (!doesExist) {
            let result = await createDocument('Teachers', receivedData)
            res.status(200).json({message: "Profile Created" , id:result.insertedId})
        }
        else {
            // res.status(404).send(JSON.stringify("Error: Teacher's Data already exists"))
            res.status(404).send("Error: Teacher's Data already exists")
        }
    }
    else {
        // res.status(404).send(JSON.stringify("Please fill all the fieds!!"))
        res.status(404).send("Please fill all the fieds!!")
    }
})
app.post('/updateData', async (req, res) => {
    let requestedData = req.body
    let toUpdate = requestedData.toUpdate;
    console.log("Post Request at updateData!")
    console.log(toUpdate)   
    console.log(requestedData.updatedValue)
    let response = await update(req.headers.update , requestedData)
    // if (req.headers.update == "Students") {

    //     let update = await sm.collection('Students').findOneAndUpdate({ name: { first: requestedData.name.first, last: requestedData.name.last }, father: requestedData.father }, { $set: { [toUpdate]: requestedData.updatedValue } },{returnNewDcoument:true})
    //     if (!update) {
    //         console.log("No mathced Data to update!")
    //         response = "No matched Data to update!";
    //     }
    //     else {
    //         console.log(`${update.name.first}'s Profile updated!!`);
    //         response = `${update.name.first}'s Profile updated!!`
    //     }
    //     res.end(JSON.stringify(response))

    // }
    // if (req.headers.update == "Teachers") {
    //     let update = await sm.collection('Teachers').updateOne({ name: { first: requestedData.name.first, last: requestedData.name.last }, father: requestedData.father }, { $set: { [toUpdate]: requestedData.updatedValue } },{returnNewDcoument:true})
    //     if (!update) {
    //         console.log("No mathced Data to update!")
    //         response = "No matched Data to update!";
    //     }
    //     else {
    //         console.log(`${update.name.first}'s Profile updated!!`);
    //         response = `${update.name.first}'s Profile updated!!`
    //     }
    //     res.end(JSON.stringify(response))
    // }
    console.log(response._id)
    res.end(JSON.stringify(response._id))
})
app.post('/deleteData', async (req, res) => {
    let requestedData = req.body;
    let result = await db.collection('users').deleteOne({ name: requestedData.name })
    console.log(result);
    res.end();
})
app.post('/updateTeacher', (req, res) => {
    //create a endpoint for updating teacher's data: Mainly Payment status
})
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server started at port: ${PORT}`)
});