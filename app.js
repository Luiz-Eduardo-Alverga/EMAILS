const express = require("express")
const bodyParser = require("body-parser")
const request = require("request")
const https = require("https")
const { response } = require("express")

const app = express()
app.use(bodyParser.urlencoded({extended:true}))
app.use(express.static("public"))

app.get("/",(req,res) => {
    res.sendFile(__dirname + "/signup.html")
})

app.post("/",(req,res) => {
    const primeiroNome = req.body.primeiroNome
    const sobrenome = req.body.sobrenome
    const email = req.body.email

    const data = {
        members:[
           {
            email_address: email,
            status: "subscribed",
            merge_fields:{
                FNAME: primeiroNome,
                LNAME: sobrenome
            }
           } 
        ]
    }

    const jsonData = JSON.stringify(data)

    const url = "https://us21.api.mailchimp.com/3.0/lists/722cf655f8"

    const options = {
        method: "POST",
        auth:"luiz1:09e6307767e7dbbb6fb65b784debbe73-us21"
    }

    const request = https.request(url,options,(response)=>{
        if(response.statusCode === 200){
            res.sendFile(__dirname + "/sucess.html")
        }else{
            res.sendFile(__dirname + "/failure.html")
        }

        response.on("data",(data)=>{
            console.log(JSON.parse(data))
        })
    })

    request.write(jsonData)
    request.end()
})
app.post("/failure",(req,res) => {
    res.redirect("/")
})


app.listen(process.env.PORT || 3000,() => {
    console.log("O servidor foi iniciado na porta 3000")
});