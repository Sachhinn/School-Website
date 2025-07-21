import { MongoClient } from "mongodb";
import dotenv from "dotenv"
dotenv.config()
const uri = process.env.MONGO_URI

const client = new MongoClient(uri)
let db;
export let sm = client.db('SchoolManagement');
export const connectDB = async () => {
    try {
        await client.connect(uri);

        await client.db().command({ ping: 1 });
        db = client.db('SchoolManagement')
        console.log("Database connected")
        return db;
    }
    catch (error) {
        console.log(`Error in db.js::: ${error.message}`);
    }
}

export const countItem = async (coll, obj = {}) => {
    let count = await client.db('SchoolManagement').collection(coll).countDocuments(obj)
    return count;
}
export const listDocument = async (coll) => {
    let allDocs = await client.db('SchoolManagement').collection(coll).find().toArray()
    return allDocs;
}
export const createDocument = async (coll, obj) => {
    if (coll == "Students") {
        obj.fees = (await sm.collection('Fees').findOne({ 'className': (obj.forClass).toString() })).fees
    }
    if (coll == "Teachers") {
        // write code to add a property salary 
        obj.salary = (await sm.collection('Salary').findOne({ 'PreferredClasses': obj.PreferredClasses })).salary
    }
    let newDoc = await sm.collection(coll).insertOne(obj);
    return newDoc;
}
export const income = async () => {
    let fees = await sm.collection('Fees').findOne({ className: "1" })
    let count = await countItem('Students', { forClass: { $in: [1, 2] } })
    let income = fees.fees * count

    count = await countItem('Students', { forClass: { $in: [3, 4, 5] } })
    fees = await sm.collection('Fees').findOne({ className: "3" })
    income += fees.fees * count;

    count = await countItem('Students', { forClass: { $in: [6, 7, 8] } })
    fees = await sm.collection('Fees').findOne({ className: "6" })
    income += fees.fees * count;

    count = await countItem('Students', { forClass: { $in: [9, 10] } })
    fees = await sm.collection('Fees').findOne({ className: "9" })
    income += fees.fees * count;

    count = await countItem('Students', { forClass: { $in: [11, 12] } })
    fees = await sm.collection('Fees').findOne({ className: "11" })
    income += fees.fees * count;
    return income
}
export const TeachinStaffSalaryExpense = async () => {
    let primaryTeacher = await countItem("Teachers", { "PreferredClasses": "Primary" })
    let middleTeacher = await countItem('Teachers', { "PreferredClasses": "Middle" })
    let higherTeacher = await countItem('Teachers', { "PreferredClasses": "Higher" })
    let saleryObj = await listDocument('Salary');
    let expenses = (primaryTeacher * saleryObj[0].salary) +
        (middleTeacher * saleryObj[1].salary) +
        (higherTeacher * saleryObj[2].salary)
    return expenses
}
export const expense = async () => {
    //make function for expenses to show in database
    let tsSalary = await TeachinStaffSalaryExpense(); 
    let ntsSalary = await nonTeachingStaffSalaryExpense();
    let expenses = tsSalary + ntsSalary;
    return expenses
}
export const nonTeachingStaffSalaryExpense = async () => {
    let nonTeachingStaff = await sm.collection("OtherStaff").find().toArray()
    let ntsSalary = 0
    nonTeachingStaff.forEach(member => {
        ntsSalary += member.salary;
    });
    return ntsSalary;
}
export const resetTeachersPaymentStatusMonthly = async () =>{
    try{
        let result = await sm.collection('Teachers').updateMany(
            {},{
                $set:{"paymentStatus":"Not Paid"}
            }
        )
        console.log(`[Monthly Payment Reset]: Not Paid`)    
    }
    catch(error){
        console.log(`[Monthly Payment Reset Error]: ${error.message}`)
    }
}
export const updateTeacherPaymentStatus = async (teacherId , status) =>{
    try {
        const result = await sm.collection('Teachers').updateOne(
            {id: teacherId},
            {$set:{"paymentStatus": status}}
        )
        if(result.modifiedCount == 0){
            console.log(`No teacher found`)
            return {success: false,message:"Teacher not found"}
        }
    } catch (error) {
        console.log(`Failed to update payment status: ${error.message}`)
        return {success: false, message: "Error in updating payment status"}
    }
}
export const unpaidTeachers = async (num) =>{
    let unpaid = await sm.collection('Teachers').find({paymentStatus:"Not Paid"}).toArray()
    let teachers = []
    for (let i = 0; i < num; i++) {
        const element = unpaid[i].name;
        teachers.push(element)
    }
    return teachers
}
export const  unpaidStudents = async (num) =>{
    let unpaid = await sm.collection('Students').find({paymentStatus:"Not Paid"}).limit(num).toArray()
    let students = []
    unpaid.forEach(student => {
        students.push(student.name)
    });
    return students;
}