const express = require('express')
const port = 2023
const database = require('./data.json')
const fs = require('fs')

//a dummy database
const  app = express()
app.use(express.json())
//send a welcome message
app.get('/', (req, res)=>{
    res.json({message: "Welcome to ExpressJs"})
})
//get or read all student in our database
app.get('/database', (req, res)=>{
    try{
        //check if the array or database is empty
        if(database.length<1){
            res.json({message: "No Student in this Database"})
        }else{
            res.status(200).json({message: "Student in CodeLab Institute", data: database})
        }
    }catch(error){
        console.log(error.message)
    }
})
//get one particular data
app.get('/database/:id', (req, res)=>{
    try{
        //get the id passed to the url
        const id = parseInt(req.params.id)
        //get the object of the id
        const student = database.find((e)=>e.id===id)
        //validate the id
        if(!student){
            res.status(404).json({message: `This student id ${id} is not found`})
        }else{
            res.status(200).json({message: "This Student is found", data: student})
        }
    }catch(error){
        console.log(error.message)
    }
})
//create/add new student 
app.post('/database', (req, res)=>{
    try{
        //create a new object
        const newStudent = {
            id: database.length +1,
            name : req.body.name,
            school: req.body.school,
            course: req.body.course
        }
        //push the new object to the array
        database.push(newStudent)
        fs.writeFileSync('./data.json', JSON.stringify(database), "utf-8",
        (error)=>{
            if(error){
                console.log(error.message)
            }
        })
        //send a respose to our client
        res.status(201).json({message: "Student is added successfully", data: newStudent})

    }catch(error){
        console.log(error.message)
    }
})
//update a particular data in our database
app.patch('/database/:id', (req, res)=>{
    try{
        //get the id passed to the url
        const id = parseInt(req.params.id)
        // get the object of the id
        const studentId = database.find((e)=>e.id===id)
        //update the fields of the id you want
        studentId.name = req.body.name, 
        studentId.school = req.body.school,
        studentId.course = req.body.course
        fs.writeFileSync('./data.json', JSON.stringify(database), "utf-8",
        (error)=>{
            if(error){
                console.log(error.message)
            }
        })
        //validate the id
        if(!studentId){
            res.json({message: `id ${id} is invalid`})
        }else{
            res.status(200).json({message: "Updated Successfully", data: studentId})
        }
    }catch(error){
        console.log(error.message)
    }
})
//delete an id from our database
app.delete('/database/:id', (req, res)=>{
    try{
        //get the id passed to the url
        const id = parseInt(req.params.id)
        //get the object of the id
        const studentId = database.find((e)=>e.id===id)
        //validate the id
        if(!studentId){
            res.json({message: `This id ${id} is not valid`})
        }else{
            //get the index of the id
            const index = database.indexOf(studentId)
            //remove the id
            database.splice(index, 1)
            //send a response
            fs.writeFileSync('./data.json', JSON.stringify(database), "utf-8",
            (error)=>{
                if(error){
                    console.log(error.message)
                }
            })
            res.status(200).json({message: `Student id: ${id} deleted Successfully`})
        }
    }catch(error){
        console.log(error.message)
    }
})


app.listen(port, ()=>{
    console.log(`server is listening to por ${port}`)
})