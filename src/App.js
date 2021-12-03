import "./App.css";
import { useEffect, useState } from "react";

//React icons
import { AiFillSound } from "react-icons/ai";
import { GiWeight } from "react-icons/gi";
import { MdStyle } from "react-icons/md";
import { GiBodyHeight, GiBouncingSword, GiStoneSphere, GiRunningNinja } from "react-icons/gi";
import { MdHealthAndSafety } from "react-icons/md";
import { RiSwordFill, RiHeart3Fill } from "react-icons/ri";

//images
import Logo from "./assets/pokemon-logo.png";
//import QuienEs from "./assets/quienes.png";
import kienEs from "./assets/kienEs.jpg";

//import styled from "styled-components"

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

        const ruta = `https://pokeapi.co/api/v2/pokemon/?offset=${
          page * 1
        }&limit=1`;
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

          return { name, stat };
        });

        //Obtener tipo en español
        const typeRuta = await fetch(pokId.types[0].type.url);
        const typeName = await typeRuta.json();
        const typeNameText = typeName.names;
        const typeNameTextES = typeNameText.filter(
          (e) => e.language.name === "es"
        );

        let typeTotal = typeNameTextES[0].name;

        //Obtener tipo 2 en español si hay
        if (pokId.types[1]) {
          const typeRuta2 = await fetch(pokId.types[1].type.url);
          const typeName2 = await typeRuta2.json();
          const typeNameText2 = typeName2.names;
          const typeNameTextES2 = typeNameText2.filter(
            (e) => e.language.name === "es"
          );

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
        });
      } catch (error) {
        console.log(error);
      }
    };

    fux();
  }, [page]);

  const quienEsEsePokemon = () => {

    //Si esta cargando desactivar boton

    //Detecta si el navegador soporta voices
    if (!window.speechSynthesis)
      return alert("Lo siento, tu navegador no soporta esta tecnología");

    //Detecta si hay una narracion, se sale
    if (speechSynthesis.speaking) {
      return true;
    }

    let btn = document.querySelector(".bordeBlanco");

    //Narracion de Presentacion
    let presentacion = new SpeechSynthesisUtterance();
    presentacion.text = `¡Es: ${pokData.name}!`;

    presentacion.voice = speechSynthesis.getVoices()[7];

    presentacion?.addEventListener("start", function (event) {
      console.log("Empece presentacion: " + event.utterance.text);
      setTaking(true);
      btn.classList.add("waitingForConnection");
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
      btn.classList.remove("waitingForConnection");
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
      {/* Logo */}
      <img className="logo" src={Logo} alt="" />

      {/* Informacion previa  */}
      <h3>Usa CHROME para una mejor experiencia</h3>
      <img
        className="chrome"
        src="https://logodownload.org/wp-content/uploads/2017/05/google-chrome-logo.png"
        alt=""
      />

      <div className="container">
        <div className="interContainer">
          <header>
            <div className="voiceIndicators">
              <div className="bolaAzul">
                <div className="bordeBlanco"></div>
              </div>

              <div className="ranura"></div>
              <div className="ranura"></div>
              <div className="ranura"></div>
            </div>

            <div className="textAndBtn">
              <div className="loadCircles">
                <div className={`circle ${loading ? "circle1" : ""}`}></div>
                <div className={`circle ${loading ? "circle2" : ""}`}></div>
                <div className={`circle ${loading ? "circle3" : ""}`}></div>
              </div>

              <h2 className="nombre">{loading? ". . .": pokData.name}</h2>

              <div className="idPage">
                <h4>
                  {page + 1}
                </h4>
              </div>

              <button
                className="voiceBtn"
                id="speakbtn"
                onClick={quienEsEsePokemon}
                disabled={taking || loading}
              >
                <AiFillSound size="25px" />
              </button>
            </div>            
          </header>

          <div className="datosBasicos">
            <div className="datoBasico datoBasicoLarge">
              <MdStyle size="2.5rem"/><p>Tipo: { 
                loading? ". . .":pokData.type}</p>
            </div>            
            <div className="datoBasico datoBasicoSmall">
            <GiWeight size="2.5rem"/><p>
              {loading? ". . .": pokData.weight/10} Kg</p>
            </div>
            <div className="datoBasico datoBasicoSmall">
            <GiBodyHeight size="2.5rem"/><p>
              {loading? ". . .": pokData.height/10} mts</p>
            </div>
            
           
             <br />
          </div>
          

          <div className="containerPokImg">
            {loading ? (
              <img className="pokImg" src={kienEs} alt={pokData.name} />
            ) : (
              <img className="pokImg" src={pokData.foto} alt={pokData.name} />
            )}
          </div>

          <ul>
              {pokData.stats?.map((e, i) => {
                if (i===0) {
                  return(<li key={i}>
                    <RiHeart3Fill size="2.5rem"/>
                    <span>
                    {e.stat}
                    </span>
                  </li>)
                }                
                if (i===1) {
                  return(<li key={i}>
                    <RiSwordFill size="2.5rem"/>
                    <span>
                    {e.stat}
                    </span>
                  </li>)
                }                
                if (i===2) {
                  return(<li key={i}>
                    <MdHealthAndSafety size="2.5rem"/>
                    <span>
                    {e.stat}
                    </span>
                  </li>)
                }                
                if (i===3) {
                  return(<li key={i}>
                    <GiBouncingSword size="2.5rem"/>
                    <span>
                    {e.stat}
                    </span>
                  </li>)
                }                
                if (i===4) {
                  return(<li key={i}>
                    <GiStoneSphere size="2.5rem"/>
                    <span>
                    {e.stat}
                    </span>
                  </li>)
                }                
                if (i===5) {
                  return(<li key={i}>
                    <GiRunningNinja size="2.5rem"/>
                    <span>
                    {e.stat}
                    </span>
                  </li>)
                } else {
                  return true
                }         
              })}
          </ul>

          <div className="buttons">
            <button className="pageBtn pageBtnPrev" onClick={atrasFun} disabled={page < 1}>
              {" "}
              Anterior{" "}
            </button>

            <button className="pageBtn pageBtnNext" onClick={siguienteFun} disabled={arrPok.length === 0}>
              {" "}
              Siguiente{" "}
            </button>
          </div>
        </div>
      </div>

     
    </div>
  );
}

export default App;
