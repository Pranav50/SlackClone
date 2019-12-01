import React, { Component } from 'react'
import { Grid, Form, Segment, Button, Header, Message, Icon} from 'semantic-ui-react';
import firebase from '../components/firebase'
import {Link} from 'react-router-dom'
import md5 from 'md5'

class Register extends Component {
    constructor(props){
        super(props);
        this.state = {
          type: 'input',
          score: 'null'
        }
        this.showHide = this.showHide.bind(this);
        this.passwordStrength = this.passwordStrength.bind(this);
      }

    state = {
        username: "",
        email: "",
        password: "",
        passwordConfirmation: "",
        errors: [],
        loading: false,
        usersRef: firebase.database().ref('users')
    };

    showHide(e){
        e.preventDefault();
        e.stopPropagation();
        this.setState({
          type: this.state.type === 'input' ? 'password' : 'input'
        })  
      }
      
      passwordStrength(e){
        if(e.target.value === ''){
          this.setState({
            score: 'null'
          })
        }
        else{
          var pw = e.target.value;
          this.setState({
            score: pw.score
          });      
        }
    
      }

    isFormValid = () => {
        let errors = [];
        let error;

        if(this.isFormEmpty(this.state)) {
            error = {message: 'Fill in all Fields'};
            this.setState({ errors: errors.concat(error) });
            return false;
            
        }  else if(!this.isPasswordValid(this.state)) {
            error = {message: 'Password should be at least 6 characters'};
            this.setState({ errors: errors.concat(error) });
            return false;

        } else if(!this.isPasswordMatch(this.state)) {
            error = {message: 'Password does not match'};
            this.setState({ errors: errors.concat(error) });
            return false;
        }  else {
            return true;
        }    
    } 

    isFormEmpty = ({ username, email, password, passwordConfirmation }) => {
        return !username.length || !email.length || !password.length ||
               !passwordConfirmation.length;
    }

    isPasswordValid = ({ password, passwordConfirmation}) => {
        if(password.length < 6 || passwordConfirmation.length < 6) {
            return false;
        } else {
            return true;
        }
    }

    isPasswordMatch = ({ password, passwordConfirmation}) => {
        if (password !== passwordConfirmation) {
            return false;
        } else {
            return true;
        }
    }

    displayErrors = errors => errors.map((error, i) => <p key={i}>{error.message}</p>);


    handleChange = event => {
        this.setState({ [event.target.name]: event.target.value });
    }

    saveUser = createdUser => {
        return this.state.usersRef.child(createdUser.user.uid).set({
            name:   createdUser.user.displayName,
            avatar: createdUser.user.photoURL,
        })
    }

    handleSubmit = event => {
        event.preventDefault();
        if(this.isFormValid()) {
            this.setState({ errors: [], loading: true})
            firebase
            .auth()
            .createUserAndRetrieveDataWithEmailAndPassword(this.state.email,this.state.password)
            .then(createdUser => {
                console.log(createdUser)
                createdUser.user.updateProfile({
                    displayName: this.state.username,
                    photoURL: `http://gravatar.com/avatar/${md5(createdUser.user.email)}?d=identicon`
                })
                .then(() => {
                    this.saveUser(createdUser).then(() => {
                        console.log('User Saved')
                    })
                })
                .catch(err => {
                    console.log(err);
                    this.setState({ errors: this.state.errors.concat(err), loading: false})
                })
                
            })
            .catch(err => {
                console.log(err)
                this.setState({ errors: this.state.errors.concat(err) ,loading: false});
            })

        }
    } 

    handleInputError = (errors, inputName) => {
       return errors.some(error => error.message.toLowerCase().includes(inputName)) ? 'error' : ''
    }

    render() {
        const { username, email, password, passwordConfirmation, errors, loading} = this.state;

        const messageStyle = {
            boxShadow: "0 13px 10px -6px #888888"
        }
        return (
            <div>
            {errors.length > 0 && (
            <div className="alert-message">
                            <Message error className="message-error">
                                <h3>Error</h3>
                                {this.displayErrors(errors)}
                            </Message>    
            </div>
            )}
                <Grid textAlign="center" verticalAlign="middle" className="app">
                    <Grid.Column style={{ maxWidth: 450}}>
                        <Header as="h1" icon color="teal" textAlign="center">
                            <Icon name="slack hash" color="teal"/>
                            Register for Slack Chat Clone
                        </Header>
                        <Form onSubmit={this.handleSubmit} size="large" className="box effect5">
                            <Segment>
                                <Form.Input fluid name="username" icon="user" iconPosition="left"
                                placeholder="Username" onChange={this.handleChange} type="text"
                                value={username}/>

                                <Form.Input fluid name="email" icon="mail" iconPosition="left"
                                placeholder="Email  Address" onChange={this.handleChange} 
                                value={email} type="email"
                                className={this.handleInputError(errors, 'email')}/>
                            
                                <Form.Input fluid name="password" icon="lock" iconPosition="left"
                                placeholder="Password" onChange={this.handleChange} type="password"
                                value={password}
                                className={this.handleInputError(errors, 'password')}

                                type={this.state.type} className="password__input" 
                                onChange={this.passwordStrength}/>
                                <span 
                                    className="password__show" 
                                    onClick={this.showHide}>
                                    {this.state.type === 'input' ? 'Hide' : 'Show'}
                                </span>
                                <span className="password__strength" data-score={this.state.score} />
                                
                                <Form.Input fluid name="passwordConfirmation" icon="repeat" iconPosition="left"
                                placeholder="Password Confirmation" onChange={this.handleChange} type="password"
                                value={passwordConfirmation}
                                className={this.handleInputError(errors, 'password')}/>
                            
                                <Button disabled={loading} className={loading ? 'loading' : ''} color="blue" fluid size="large">Submit</Button>
                                
                                </Segment>
                        </Form>
                        
                        <Message style={messageStyle}>Already a User? <Link to="/login">Login</Link></Message>
                        </Grid.Column>
                </Grid>
            </div>
        )
    }
}

export default Register
