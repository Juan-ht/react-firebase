import React from 'react';
import Firebase from 'firebase';
import config from './config';
import ReactGA from 'react-ga';
import history from './history';

class App extends React.Component {
  constructor(props){
    super(props);
    Firebase.initializeApp(config);
    this.state = {
      developers : []
    }
    
    
  }

  componentDidMount() {
    
    this.getUserData();
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevState !== this.state) {
      this.writeUserData();
    }
  }

  writeUserData = () => {
    Firebase.database().ref('/personas').set(this.state);
  }
  
  getUserData = () => {
    let ref = Firebase.database().ref('/personas');
    ref.on('value', snapshot => {
      const state = snapshot.val();
      this.setState(state);
    });
  }

  removeData = developer => {
    const { developers } = this.state;
    const newState = developers.filter(data => {
      return data.id !== developer.id;
    });
    this.setState({ developers: newState });
  };

  updateData = developer => {
    this.refs.id.value = developer.id;
    this.refs.name.value = developer.name;
    this.refs.username.value = developer.username;
  };

  handleSubmit = event => {
    event.preventDefault();
    let name = this.refs.name.value;
    let username = this.refs.username.value;
    let id = this.refs.id.value;

    if (id && name && username) {
      const { developers } = this.state;
      const devIndex = developers.findIndex(data => {
        return data.id === id;
      });
      developers[devIndex].name = name;
      developers[devIndex].username = username;
      this.setState({ developers });
    } else if (name && username) {
      const id = new Date().getTime().toString();
      const { developers } = this.state;
      developers.push({ id, name, username });
      this.setState({ developers });
    }

  }

  render() {
    Firebase.analytics().setCurrentScreen('home')
    ReactGA.initialize('1:1040494046653:web:b881effc27e08edb')
    ReactGA.set({ page: window.location.pathname })
    ReactGA.pageview(window.location.pathname)
    history.push(window.location.pathname)
    history.listen((location, action) => {
      ReactGA.pageview(location.pathname + location.search);
      console.log('Location: ' + location.pathname)
    });
    const { developers } = this.state;
    return (
      <React.Fragment>
        <div className="container">
          <div className="row">
            <div className="col-xl-12">
            </div>
          </div>
          <div className="row">
            <div className="col-xl-12">
              <h2>Añadir una persona</h2>
              <form onSubmit={this.handleSubmit}>
                <div className="form-row">
                  <input type="hidden" ref="id" />
                  <div className="form-group col-md-6">
                    <label>Name</label>
                    <input
                      type="text"
                      ref="name"
                      className="form-control"
                      placeholder="nombre"
                    />
                  </div>
                  <div className="form-group col-md-6">
                    <label>Usuario</label>
                    <input
                      type="text"
                      ref="username"
                      className="form-control"
                      placeholder="nombre de usuario"
                    />
                  </div>
                </div>
                <button
                  style={{marginBottom: "1rem"}}
                  type="submit" 
                  className="btn btn-success">
                  Añadir
                </button>
              </form>
            </div>
          </div>
          <div className="row">
            <div className="col-xl-12">
              {developers.map(developer => (
                <div
                  key={developer.id}
                  className="card float-left"
                  style={{ width: "18rem", marginRight: "1rem", marginTop: "1rem", marginBottom: "1rem" }}
                >
                  <div className="card-body">
                    <h5 className="card-title">{developer.name}</h5>
                    <p className="card-text">{developer.username}</p>
                    <button
                      onClick={() => this.removeData(developer)}
                      className="btn btn-danger"
                    >
                      Eliminar
                    </button>
                    <button
                      onClick={() => this.updateData(developer)}
                      className="btn btn-default"
                    >
                      Editar
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
          

        </div>
      </React.Fragment>
    );
  }

}





export default App;
