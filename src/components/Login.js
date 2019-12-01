import React, { Component } from 'react'
import { Grid, Form, Segment, Button, Header, Message, Icon} from 'semantic-ui-react';
import firebase from '../components/firebase'
import {Link} from 'react-router-dom'

class Login extends Component {
    state = {
        email: "",
        password: "",
        errors: [],
        loading: false,
    };

    displayErrors = errors => errors.map((error, i) => <p key={i}>{error.message}</p>);


    handleChange = event => {
        this.setState({ [event.target.name]: event.target.value });
    }

    isFormValid = ({ email, password }) => email && password;

    handleSubmit = event => {
        event.preventDefault();
        if(this.isFormValid(this.state)) {
            this.setState({ errors: [], loading: true});
            firebase.auth().signInWithEmailAndPassword(this.state.email, this.state.password)
            .then(signedInUser => {
                console.log(signedInUser);
            })
            .catch(err => {
                console.log(err);
                this.setState({
                    errors: this.state.errors.concat(err),
                    loading: false
                });
            });
        }
    } 

    handleInputError = (errors, inputName) => {
       return errors.some(error => error.message.toLowerCase().includes(inputName)) ? 'error' : ''
    }

    render() {
        const { email, password, errors, loading} = this.state;

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
                        <Header as="h1" icon color="violet" textAlign="center">
                            <Icon name="slack hash" color="violet"/>
                            Login for Slack Chat Clone
                        </Header>
                        <Form onSubmit={this.handleSubmit} size="large" className="box effect2">
                            <Segment>
                                <Form.Input fluid name="email" icon="mail" iconPosition="left"
                                placeholder="Email  Address" onChange={this.handleChange} 
                                value={email} type="email"
                                className={this.handleInputError(errors, 'email')}/>
                            
                                <Form.Input fluid name="password" icon="lock" iconPosition="left"
                                placeholder="Password" onChange={this.handleChange} type="password"
                                value={password}
                                className={this.handleInputError(errors, 'password')}/>
                            
                                <Button disabled={loading} className={loading ? 'loading' : ''} color="blue" fluid size="large">Submit</Button>
                                
                                </Segment>
                        </Form>
                        
                        <Message style={messageStyle}>Don't have an account? <Link to="/register">Register</Link></Message>
                        </Grid.Column>
                </Grid>
            </div>
        )
    }
}

export default Login
