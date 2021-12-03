import "./App.css";
import { useEffect, useState } from "react";
import { AiFillSound } from "react-icons/ai";

function App() {
  const [arrPok, setArrPok] = useState([]);

  const [pokData, setPokData] = useState({});

  const [page, setPage] = useState(0);

  const [loading, setLoading] = useState(false);

  const [taking, setTaking] = useState();

  useEffect(() => {
    const fux = async () => {
      try {
        speechSynthesis.getVoices();

        setLoading(true);

        const ruta = `https://pokeapi.co/api/v2/pokemon/?offset=${page*1}&limit=1`;
        const respuesta = await fetch(ruta);
        const arrPoks = await respuesta.json();

        setArrPok(arrPoks.results); //Array de results

        //Traer pokemon unico en ID
        const rutaPokito = arrPoks.results[0].url;
        const reskito = await fetch(rutaPokito);
        const pokId = await reskito.json();

        //Traer Stats de ese pokemon
        const pokStats = pokId.stats.map((e) => {
          const name = e.stat.name;
          const stat = e["base_stat"];

          return { name, stat }
        });


        //Obtener tipo en español
        const typeRuta = await fetch(pokId.types[0].type.url);
        const typeName = await typeRuta.json();
        const typeNameText = typeName.names;
        const typeNameTextES = typeNameText.filter((e) => e.language.name === "es");

        let typeTotal = typeNameTextES[0].name;

              //Obtener tipo 2 en español si hay
              if (pokId.types[1]) {
                const typeRuta2 = await fetch(pokId.types[1].type.url);
                const typeName2 = await typeRuta2.json();
                const typeNameText2 = typeName2.names;
                const typeNameTextES2 = typeNameText2.filter((e) => e.language.name === "es");

                typeTotal = typeTotal + " y " + typeNameTextES2[0].name;
              }

        setLoading(false);


        //Setear data al terminar consultas
        setPokData({
          name: pokId.name,
          weight: pokId.weight,
          height: pokId.height,
          foto: pokId.sprites.other["official-artwork"].front_default,
          stats: pokStats,
          type: typeTotal,
        })

      } catch (error) {
        console.log(error);
      }
    };

    fux();

  }, [page]);


  const quienEsEsePokemon = () => {

    //Detecta si el navegador soporta voices
    if (!window.speechSynthesis)
      return alert("Lo siento, tu navegador no soporta esta tecnología");

    //Detecta si hay una narracion, se sale
    if (speechSynthesis.speaking) {
      return true;
    }

    //Narracion de Presentacion
    let presentacion = new SpeechSynthesisUtterance();
    presentacion.text = `¡Es: ${pokData.name}!`;

    presentacion.voice = speechSynthesis.getVoices()[7];

    presentacion?.addEventListener("start", function (event) {
      console.log("Empece presentacion: " + event.utterance.text);
      setTaking(true);
    });

    speechSynthesis.speak(presentacion);

    presentacion?.addEventListener("end", function (event) {
      console.log("Termine presentacion: " + event.utterance.text);
      setTaking(false);
    });


    //Narracion de Grito
    let grito = new SpeechSynthesisUtterance();

    grito.text = `${pokData.name.slice(0, 4)} ${pokData.name.slice(0, 4)}`;


    if (pokData.weight / 10 <= 10) {
      grito.pitch = 1.5;
    } else if (pokData.weight / 10 <= 20) {
      grito.pitch = 1.4;
    } else if (pokData.weight / 10 <= 40) {
      grito.pitch = 1.2;
    } else if (pokData.weight / 10 <= 70) {
      grito.pitch = 0.9;
    } else if (pokData.weight / 10 <= 100) {
      grito.pitch = 0.6;
    } else {
      grito.pitch = 0.3;
    }

    //4 mejor, 8 11 pueden ser, 2 pablo
    grito.voice = speechSynthesis.getVoices()[4];

    grito?.addEventListener("start", function (event) {
      console.log("Empece a hablar: " + event.utterance.text);
      setTaking(true);
    });

    speechSynthesis.speak(grito);

    grito?.addEventListener("end", function (event) {
      console.log("Termine de hablar: " + event.utterance.text);
      setTaking(false);
    });
  };

  const siguienteFun = () => {
    speechSynthesis.cancel();
    console.log("Siguiente");
    setPage(page + 1);
  };

  const atrasFun = () => {
    speechSynthesis.cancel();
    console.log("Atras");
    setPage(page - 1);
  };


  return (
    <div className="App">

      Pokemon, tengo que atraparlos!!! Mi destino asi es! Gran camino es...
      <h1>EN UN MUNDO POR SALVAAAAAR! POKEMON!!!</h1>
      <h2>USA CHROME PARA UNA MEJOR EXPERIENCIA DE SONIDO</h2>
      <div className="container">
        {loading ? (
          <h2>Cargando...</h2>
        ) : (
          <div>
            {" "}
            {"nombre: " + pokData.name} <br />
            {pokData.weight / 10 + " Kg"} <br />
            {pokData.height / 10 + " metros"} <br />
            {"Tipo: " + pokData.type} <br />
            <img src={pokData.foto} alt={pokData.name} />
            <button id="speakbtn" onClick={quienEsEsePokemon} disabled={taking}>
              {" "}
              <AiFillSound size="30px" />
              ¿Quien es ese pokemón?{" "}
            </button>
            <div>
              <p>Estadisticas iniciales</p>
              <ul>
                {pokData.stats?.map((e, i) => (
                  <li key={i}>
                    {e.name}---{e.stat}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}
      </div>

      <button onClick={atrasFun} disabled={page < 1}>
        {" "}
        Anterior{" "}
      </button>

      <button onClick={siguienteFun} disabled={arrPok.length === 0}>
        {" "}
        Siguiente{" "}
      </button>
      
      <h1>{page + 1}</h1>

    </div>
  );
}

export default App;
