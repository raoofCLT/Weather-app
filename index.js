import express from "express"
import axios from "axios"
import bodyParser from "body-parser"
import env from 'dotenv';

const app = express();
const port = 3000;
env.config();

app.use(express.static("public"))
app.use(bodyParser.urlencoded({extended:true}))


const APIKey = process.env.API_Key;

const all = {
    country : "Denmark",
    temp : "32",
    climate : "Cloud",
    wind : 52,
    humidity : 54,
    weatherimg : "/images/cloud.png"
}

app.get("/",(req,res) =>{
    res.render("index.ejs",{all})
} )


app.post("/", async (req,res) =>{
    const cityName= req.body.cityname
    console.log(cityName)
    try {
        const result = await axios.get(`https://api.openweathermap.org/data/2.5/weather?q=${cityName}&units=metric&appid=${APIKey}`)
        console.log(result)
        if(result.data.weather[0].main == "Cloud"){
            all.weatherimg = "/images/cloud.png"
        }else if(result.data.weather[0].main == "Clear"){
            all.weatherimg = "/images/clear.png"
        }else if(result.data.weather[0].main == "Rain"){
            all.weatherimg = "/images/rain.png"
        }else if(result.data.weather[0].main == "Drizzle"){
            all.weatherimg = "/images/dizzle.png"
        }else if(result.data.weather[0].main == "Mist"){
            all.weatherimg = "/images/mist.png"
        }

        all.country = result.data.name
        all.temp = result.data.main.temp
        all.climate = result.data.weather[0].main
        all.wind = result.data.wind.speed
        all.humidity = result.data.main.humidity

        console.log(all.weatherimg)

        res.render("index.ejs",{all})
    }catch(err){
        console.log(err)
        res.render("index.ejs",{all})
    }
} )


app.listen(port, () =>{
    console.log(`Your server is running on ${port}`);
})
