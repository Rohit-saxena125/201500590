const express=require('express');
const app=express();
require('dotenv').config();
const fetch=require('node-fetch');
app.use(express.json())


async function getTrains(){
    const data=await fetch('http://localhost:3000/trains',{
        headers:{
            'authorization':process.env.TOKEN
        }
    })
    
    const trains=await data.json()
    return trains

}
function handleData(data){
    if(data.message)
        return 404
    data.filter(d=>{})
    data=data.filter((a)=>{
         const time1=a.departureTime.Hours*60+a.departureTime.Minutes+a.delayedBy
         const current_time=new Date().getHours()*60+new Date().getMinutes()
         if(current_time+30<=time1)
            return true
        return false;
    })
    data=data.sort((a,b)=>{
        const time1=a.departureTime.Hours*60+a.departureTime.Minutes+a.delayedBy
        const time2=b.departureTime.Hours*60+b.departureTime.Minutes+b.delayedBy
        if(time1===time2)
            if(a.price.sleeper===b.price.sleeper)
                return a.price.AC-b.price.AC
            else return a.price.sleeper-b.price.sleeper
        return time1-time2
   })
return data
}
app.get('/trains',async  (req, res) => {
    const trains=handleData(await getTrains())
    if(trains===404)
        return res.status(404).send("Auth Expired")
    res.send(trains)
})


app.listen(process.env.PORT||5000,()=>{
    console.log("Server is running")
})
