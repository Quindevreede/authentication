HANDLEIDING AUTHENTICATION BASIC :
----------------------------------

STAP 0 - OPZET :
---

## Applicatie starten

Als je het project gecloned hebt naar jouw locale machine, installeer je eerst de `node_modules` door het volgende
commando in de terminal te runnen:

```
npm install
```

Wanneer dit klaar is, kun je de applicatie starten met behulp van:

```
npm start
```

De applicatie heeft op dit moment al vier pagina's met werkende routing:

1. Home pagina (`/`)
2. Profiel pagina (`/profile`)
3. Sign in (login) pagina (`/signin`)
4. Sign up (registratie) pagina (`/signup`)

Ik laat even de index.js zien, zodat je kunt zien dat de Router om de <App/> heen staat:
ReactDOM.render(
  <React.StrictMode>
    <Router>
      <AuthContextProvider>
        <App/>
      </AuthContextProvider>
    </Router>
  </React.StrictMode>,
  document.getElementById('root')
);

Ik laat ook even de RETURN ( van App.js zien zodat je kunt zien waar de <Route> ELEMENTEN staan:
import React, { useContext } from 'react';
import { Switch, Route, Redirect } from 'react-router-dom';
import NavBar from './components/NavBar';
import Profile from './pages/Profile';
import Home from './pages/Home';
import SignIn from './pages/SignIn';
import SignUp from './pages/SignUp';
import { AuthContext } from './context/AuthContext';
import './App.css';

function App() {
  const { isAuth } = useContext(AuthContext);

  return (
    <>
      <NavBar />
      <div className="content">
        <Switch>
          <Route exact path="/">
            <Home />
          </Route>
          <Route path="/profile">
            {isAuth ? <Profile /> : <Redirect to="/" />}
          </Route>
          <Route exact path="/signin">
            <SignIn />
          </Route>
          <Route exact path="/signup">
            <SignUp />
          </Route>
        </Switch>
      </div>
    </>
  );
}

export default App;

-

STAP 1 - BASIC CONTEXT AuthContext :
---

1. Maak een context-bestand (`AuthContext.js`) met daarin (je raadt het niet!) een `AuthContext`.
--
export const AuthContext = createContext({});

2. Creëer dan het custom Provider-component. Uit dit component return je het echte `AuthContext.Provider` component.
--
function AuthContextProvider() {
  const [isAuth, toggleIsAuth] = useState(false);
  const history = useHistory();
  return (
    <AuthContext.Provider>
    </AuthContext.Provider>
  );
}

export default AuthContextProvider;

3. Zorg ervoor dat we het custom Provider-component zometeen om de applicatie kunnen wikkelen door de children property
   te implementeren.

   function AuthContextProvider({ children }) {
     const [isAuth, toggleIsAuth] = useState(false);
     const history = useHistory();
  return (
    <AuthContext.Provider>
      {children}
    </AuthContext.Provider>
  );
}

4. Maak een data-object aan die je meegeeft aan de `value`-property en zet daar wat test-data in.
   ( Ook hebben we bij de VORIGE TUSSENSTAP (.3) STATE aangemaakt in het custom Provider-component.
   Deze state-variabele hebben we  `isAuth` genoemd en de initiële waarde op `false` gezet.)
   Geef de waarde van de state mee aan het data object.

  const contextData = {
    isAuth: isAuth,
    login: login,
    logout: logout,
  };

   EN MAAK EEN FUNCTION VOOR LOGIN
   Schrijf een inlog-functie in het custom Provider-component en maak deze beschikbaar in het data-object. In de
   randvoorwaarden staat beschreven wat deze functie moet doen:

  function login() {
    console.log('Gebruiker is ingelogd!');
    toggleIsAuth(true);
    history.push('/profile');
  }

   EN MAAK EEN FUNCTION VOOR LOGOUT
   Schrijf een uitlog-functie in het custom Provider-component en maak deze beschikbaar in het data-object. In de
   randvoorwaarden staat beschreven wat deze functie moet doen:

  function logout() {
    console.log('Gebruiker is uitgelogd!');
    toggleIsAuth(false);
    history.push('/');
  }


5. Wrap dit om het `<App />`-component in `index.js`

LET OP: We hebben hier dus de AuthContextProvider OM DE ECHTE AuthContext.Provider HEEN GEWIKKELD!
In de index.js staat het er dus zo in:
ReactDOM.render(
  <React.StrictMode>
    <Router>
      <AuthContextProvider>
        <App/>
      </AuthContextProvider>
    </Router>
  </React.StrictMode>,
  document.getElementById('root')
);

DUS ONTHOUD: WE HEBBEN DE OMWIKKELING uit AuthContext.js gebruikt en de ORIGINELE VERSIE STAAT IN DE RETURN van AuthContext.js

6. Lees de context uit in één van de pagina-componenten om te kijken of jouw eerste opzet functioneel is (
   met `useContext`)

>>> WE MAKEN SignIn.js AAN EN IMPLEMENTEREN HIER :::  const { login } = useContext(AuthContext); <<<

   import React, { useContext } from 'react';
   import { Link } from 'react-router-dom';
   import { AuthContext } from '../context/AuthContext';

   function SignIn() {
     const { login } = useContext(AuthContext);

     function handleSubmit(e) {
       e.preventDefault();
       login();
     }

     return (
       <>
         <h1>Inloggen</h1>
         <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Ab alias cum debitis dolor dolore fuga id molestias qui quo unde?</p>

         <form onSubmit={handleSubmit}>
           <p>*invoervelden*</p>
           <button type="submit">Inloggen</button>
         </form>

         <p>Heb je nog geen account? <Link to="/signup">Registreer</Link> je dan eerst.</p>
       </>
     );
   }

   export default SignIn;

7. Gelukt? Top.

STAP 2 - BASIC NAVBAR & PRIVATE ROUTE :
---

8. Lees deze authenticatie-status uit in het `<NavBar />` component.

 import React, { useContext } from 'react';
 import logo from '../assets/banana-01.png';
 import { useHistory, Link } from 'react-router-dom';
 import { AuthContext } from '../context/AuthContext';

 function NavBar() {
   const { isAuth, logout } = useContext(AuthContext);
   const history = useHistory();

Krijg je het te zien in de console? Zorg er dan
   voor dat je op basis van deze status een inloggen- en registreren-knop laat zien, **of** alleen een uitlog-knop.
   * De navigatiebalk laat alleen een _uitlog_-knop zien bij `true` (ingelogd) of de _inlog_- en _registratie_-knoppen
     bij `false` (niet ingelogd). Deze data komt uit de context;

    return (
      <nav>
        <Link to="/">
            <span className="logo-container">
              <img src={logo} alt="logo"/>
              <h3>
                Banana Security
              </h3>
            </span>
        </Link>

        {isAuth ?
          <button
            type="button"
            onClick={logout}
          >
            Log uit
          </button>
          :
          <div>
            <button
              type="button"
              onClick={() => history.push('/signin')}
            >
              Log in
            </button>
            <button
              type="button"
              onClick={() => history.push('/signup')}
            >
              Registreren
            </button>
          </div>
        }
      </nav>
    );
  }

  export default NavBar;

MET EEN TERNARY OPERATOR a ? b : c DOEN WE NU:
isAuth(dit is dus a) ? ZO JA LAAT logOut button (dit is dus b) zien : ZO NEE LAAT logIn EN REGISTER button zien

9. Maak de knop in het formulier in `SignIn.js` functioneel. Als het formulier wordt _gesubmit_, roep je de
   login-functie uit de context aan!
   in SignIn.js:

/1/ Eerst halen we de login dus uit de AuthContext...
 function SignIn() {
   const { login } = useContext(AuthContext);

/2/ Daarna stoppen we deze login() in de handleSubmit(e) FUNCTION...
   function handleSubmit(e) {
     e.preventDefault();
     login();
   }

/3/ Als laatste activeren we de FUNCTION handleSubmit door deze mee te geven aan de form onsubmit
         <form onSubmit={handleSubmit}>
           <p>*invoervelden*</p>
           <button type="submit">Inloggen</button>
         </form>

Als deze dus gesubmit wordt wordt de isAuth op TRUE gezet en is de gebruiker INGELOGD

11. Maak de knop in de navigatie (`NavBar.js`) functioneel. Als erop wordt geklikt, roep je de logout-functie uit de
    context aan!
    in NavBar.js:

    Dit hadden we stiekum al gedaan maar in NavBarjs staat dus in de Return ( een TERNARY OPERATOR en
    ALS de gebruiker dus INGELOGD is (isAuth ?) dan is deze LOGOUT BUTTON in de NAVBAR te zien
    en de >button> ziet er zo uit:

            <button
              type="button"
              onClick={logout}
            >
              Log uit
            </button>

    We hebben bij onClick dus {logout} meegegeven en die hadden we eerder al geimporteerd met de CONTEXT van AuthContext
    import { AuthContext } from '../context/AuthContext';

    function NavBar() {
      const { isAuth, logout } = useContext(AuthContext);
      const history = useHistory();

13. Ten slotte kun je de route naar `/profile` beveiligen met een private route.

import React, { useContext } from 'react';
import { Switch, Route, Redirect } from 'react-router-dom';
import NavBar from './components/NavBar';
import Profile from './pages/Profile';
import Home from './pages/Home';
import SignIn from './pages/SignIn';
import SignUp from './pages/SignUp';
import { AuthContext } from './context/AuthContext';
import './App.css';

function App() {
  const { isAuth } = useContext(AuthContext);

  return (
    <>
      <NavBar />
      <div className="content">
        <Switch>
          <Route exact path="/">
            <Home />
          </Route>
          <Route path="/profile">
            {isAuth ? <Profile /> : <Redirect to="/" />}
          </Route>
          <Route exact path="/signin">
            <SignIn />
          </Route>
          <Route exact path="/signup">
            <SignUp />
          </Route>
        </Switch>
      </div>
    </>
  );
}

export default App;

DIT IS HOE JE ROUTE OP PRIVATE ZET ZODAT JE ER DUS ALLEEN IN KAN ALS JE INGELOGD BENT:
          <Route path="/profile">
            {isAuth ? <Profile /> : <Redirect to="/" />}
DUS MET TERNARY OPERATOR STAAT ER BEN JE INGELOGD ? ZO JA REDIRECT TO <Profile /> ZO NEE REDIRECT TO </>

STAP 3.1 - SIGN-UP  :
---

## Bonus-opdrachten
**Bonus:**
* Maak alvast invoervelden in het login- en registratie-formulier die de gebruiker zou kunnen invullen. Je hoeft nog
  niets met de ingevulde data te doen, dit komt pas volgende les!

01. - Dit is hoe we de SignUp.js hebben gemaakt:
-
import React, { useState } from 'react';
import { Link } from 'react-router-dom';

function SignUp() {
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  function handleSubmit(e) {
    e.preventDefault();

    console.log({
      email: email,
      gebruikersnaam: username,
      wachtwoord: password,
    });
  }

  return (
    <>
      <h1>Registreren</h1>
      <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Aspernatur atque consectetur, dolore eaque eligendi
        harum, numquam, placeat quisquam repellat rerum suscipit ullam vitae. A ab ad assumenda, consequuntur deserunt
        doloremque ea eveniet facere fuga illum in numquam quia reiciendis rem sequi tenetur veniam?</p>
      <form onSubmit={handleSubmit}>
        <label htmlFor="email-field">
          Emailadres:
          <input
            type="email"
            id="email-field"
            name="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </label>

        <label htmlFor="username-field">
          Gebruikersnaam:
          <input
            type="text"
            id="username-field"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
        </label>

        <label htmlFor="password-field">
          Wachtwoord:
          <input
            type="password"
            id="password-field"
            name="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </label>
        <button
          type="submit"
          className="form-button"
        >
          Registeren
        </button>

      </form>
      <p>Heb je al een account? Je kunt je <Link to="/signin">hier</Link> inloggen.</p>
    </>
  );
}

export default SignUp;

>>>
02. - UITLEG :
We beginnen bij de useState() en handleSubmit() FUNCTION:
  function SignUp() {
    const [email, setEmail] = useState('');
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    function handleSubmit(e) {
      e.preventDefault();

      console.log({
        email: email,
        gebruikersnaam: username,
        wachtwoord: password,
      });
    }

-- We maken dus USE-STATEs voor EMAIL, USERNAME, PASSWORD
-- We maken ook de handleSubmit() FUNCTION die nog steeds met preventDefault zorgt dat het ingevulde veld niet refreshed
   MAAR ook LOGGEN we voor nu de EMAIL, USERNAME, PASSWORD (zodat we kunnen zien dat de ingevulde waardes in de FORM
   na de submit(dus uitvoering handleSubmit()) zijn geUPDATE.

03. - We gaan vervolgens naar de RETURN ( kijken naar de FORM:
         <form onSubmit={handleSubmit}>
           <label htmlFor="email-field">
             Emailadres:
             <input
               type="email"
               id="email-field"
               name="email"
               value={email}
               onChange={(e) => setEmail(e.target.value)}
             />
           </label>
// We geven hier bij het invoerveld dus de TYPE, ID, NAME eigenschappen van het invoerveld en
// met de >> onChange << EVENT LISTENER veranderen we dus de STATE van { email } met setEmail

           <label htmlFor="username-field">
             Gebruikersnaam:
             <input
               type="text"
               id="username-field"
               value={username}
               onChange={(e) => setUsername(e.target.value)}
             />
           </label>
// We geven hier bij het invoerveld dus de TYPE, ID eigenschappen van het invoerveld en
// met de >> onChange << EVENT LISTENER veranderen we dus de STATE van { username } met setUsername

           <label htmlFor="password-field">
             Wachtwoord:
             <input
               type="password"
               id="password-field"
               name="password"
               value={password}
               onChange={(e) => setPassword(e.target.value)}
             />
           </label>
// We geven hier bij het invoerveld dus de TYPE, ID, NAME eigenschappen van het invoerveld en
// met de >> onChange << EVENT LISTENER veranderen we dus de STATE van { password } met setPassword

           <button
             type="submit"
             className="form-button"
           >
             Registeren
           </button>

STAP 3.2 - SIGN-IN  :
---

01. - Dit is hoe we de SignIn.js hebben gemaakt:
-
import React, { useContext, useState } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

function SignIn() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const { login } = useContext(AuthContext);

  function handleSubmit(e) {
    e.preventDefault();

    console.log({
      email: email,
      wachtwoord: password,
    });

    login();
  }

  return (
    <>
      <h1>Inloggen</h1>
      <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Ab alias cum debitis dolor dolore fuga id molestias qui quo unde?</p>

      <form onSubmit={handleSubmit}>
        <label htmlFor="email-field">
          Emailadres:
          <input
            type="email"
            id="email-field"
            name="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </label>

        <label htmlFor="password-field">
          Wachtwoord:
          <input
            type="password"
            id="password-field"
            name="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </label>
        // We geven hier bij het invoerveld dus de TYPE, ID, NAME eigenschappen van het invoerveld en
        // met de >> onChange << EVENT LISTENER veranderen we dus de STATE van { password } met setPassword


        <button
          type="submit"
          className="form-button"
        >
          Inloggen
        </button>
      </form>

      <p>Heb je nog geen account? <Link to="/signup">Registreer</Link> je dan eerst.</p>
    </>
  );
}

export default SignIn;

>>>
02. - UITLEG :
We beginnen bij de useState() en handleSubmit() FUNCTION:
  function SignIn() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    function handleSubmit(e) {
      e.preventDefault();

      console.log({
        email: email,
        wachtwoord: password,
      });
    }

-- We maken dus USE-STATEs voor EMAIL, PASSWORD
-- We maken ook de handleSubmit() FUNCTION die nog steeds met preventDefault zorgt dat het ingevulde veld niet refreshed
   MAAR ook LOGGEN we voor nu de EMAIL, PASSWORD (zodat we kunnen zien dat de ingevulde waardes in de FORM
   na de submit(dus uitvoering handleSubmit()) zijn geUPDATE.

03. - We gaan vervolgens naar de RETURN ( kijken naar de FORM:
-
  return (
    <>
      <h1>Inloggen</h1>
      <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Ab alias cum debitis dolor dolore fuga id molestias qui quo unde?</p>

      <form onSubmit={handleSubmit}>
        <label htmlFor="email-field">
          Emailadres:
          <input
            type="email"
            id="email-field"
            name="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </label>
        // We geven hier bij het invoerveld dus de TYPE, ID, NAME eigenschappen van het invoerveld en
        // met de >> onChange << EVENT LISTENER veranderen we dus de STATE van { email } met setEmail


        <label htmlFor="password-field">
          Wachtwoord:
          <input
            type="password"
            id="password-field"
            name="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </label>

        <button
          type="submit"
          className="form-button"
        >
          Inloggen
        </button>
      </form>

      <p>Heb je nog geen account? <Link to="/signup">Registreer</Link> je dan eerst.</p>
    </>