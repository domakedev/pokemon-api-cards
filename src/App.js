import './App.css';
import React, {useEffect, useState} from 'react'
import { AiFillSound } from "react-icons/ai";



function App() {

  const [arrPok, setArrPok] = useState([])

  const [pokData, setPokData] = useState({})

  const [page, setPage] = useState(0)

  const [loading, setLoading] = useState(false)

  const [taking, setTaking] = useState();

  useEffect(() => {

    
    const fux = async () => {
      try {

        speechSynthesis.getVoices()

        setLoading(true)
        const ruta= `https://pokeapi.co/api/v2/pokemon/?offset=${page*1}&limit=1`
        const respuesta = await fetch(ruta)
        const arrPoks = await respuesta.json()

        setArrPok(arrPoks.results) //Array de results


         const rutaPokito = arrPoks.results[0].url
         const reskito = await fetch(rutaPokito)
         const pokId = await reskito.json()

         const pokStats = pokId.stats.map((e)=>{
          
          const name=  e.stat.name
          const stat=  e["base_stat"]

          return{ name,stat }
          
          })

          //Obtener tipo en español
          
          const typeRuta= await fetch(pokId.types[0].type.url)
          const typeName = await typeRuta.json()
          const typeNameText = typeName.names          
          const typeNameTextES = typeNameText.filter((e)=>(e.language.name==="es"))
          
          let typeTotal = typeNameTextES[0].name


           //Obtener tipo en español
           if (pokId.types[1]) {
            const typeRuta2= await fetch(pokId.types[1].type.url)
            const typeName2 = await typeRuta2.json()
            const typeNameText2 = typeName2.names          
            const typeNameTextES2 = typeNameText2.filter((e)=>(e.language.name==="es"))

            typeTotal = typeTotal + " y " + typeNameTextES2[0].name
           }




        setLoading(false)


          //Setear data al terminar consultas
          setPokData({
            name: pokId.name,
            weight: pokId.weight,
            height: pokId.height,
            foto: pokId.sprites.other["official-artwork"].front_default,
            stats: pokStats,
            type: typeTotal
          })
          
          

        
      } catch (error) {
        console.log(error);
      }
    }

    fux()
           
    
  }, [page])


  useEffect(() => {    

    
    // Add event listener to speakbutton
    // const el = document.getElementById("speakbtn");
    // console.log(el);
    // el?.addEventListener("speech", ()=>{
    //   alert("speakinnnnnnnnnn")
    //   let speaking = speechSynthesis.speaking

    //   if (speaking===true) {
    //     setTaking(true)
    //   }else {
    //     setTaking(false)
    //   }

    // });


    

  }, [])


  


  const quienEsEsePokemon = () => {

      if (!window.speechSynthesis) return alert("Lo siento, tu navegador no soporta esta tecnología");


      let speakgin = speechSynthesis.speaking

      if (speakgin) {
        return true
      }

      let mensaje = new SpeechSynthesisUtterance();
      
      mensaje.volume = 1;
      mensaje.rate = 1;
      mensaje.text = `Es ${pokData.name}`

      //mensaje.text = `Es ${pokData.name}, 
      // pesa ${pokData.weight/10} kilogramos, 
      // mide ${pokData.height/10} metros y 
      // es de tipo ${pokData.type}
      // `

      mensaje.pitch = 1;
      mensaje.voice = speechSynthesis.getVoices()[8]

      mensaje?.addEventListener('start', function(event) {
        console.log('Empece a hablar: ' + event.utterance.text);
        setTaking(true)
      });


      speechSynthesis.speak(mensaje)

      mensaje?.addEventListener('end', function(event) {
        console.log('Termine de hablar: ' + event.utterance.text);
        setTaking(false)
      });


  }

  const siguienteFun = () =>{
    speechSynthesis.cancel()
    console.log("Cancel");
    setPage(page+1)
  }


  return (
    <div className="App">
      Pokemon, tengo que atraparlos!!! Mi destino asi es! Gran camino es...
      <h1>EN UN MUNDO POR SALVAAAAAR! POKEMON!!!</h1>


      <div className="container">

      {loading? <h2>Cargando...</h2>
          :


      
        <div> {"nombre: "+pokData.name} <br/> 
        {pokData.weight/10+" Kg"} <br/> 
        {pokData.height/10+" metros"} <br />
        {"Tipo: "+pokData.type} <br />

          
          <img src={pokData.foto} alt={pokData.name} />
          <button id="speakbtn" onClick={quienEsEsePokemon} disabled={taking}> <AiFillSound size="30px"/>¿Quien es ese pokemón? </button>

          <div>
            <p>Estadisticas iniciales</p>
            <ul>
              {pokData.stats?.map((e,i)=>(<li key={i}>{e.name}---{e.stat}</li>))}
            </ul>
          </div>
        </div>
        
      
      }
      </div> 
      

      <button onClick={()=>setPage(page-1)} disabled={page<1}> Anterior </button>

      <button onClick={siguienteFun} disabled={arrPok.length===0}> Siguiente </button>
      

      <h1>{page+1}</h1>
    </div>
  );
}

export default App;
