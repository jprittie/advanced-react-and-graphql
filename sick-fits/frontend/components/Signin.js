import React, { Component } from 'react';
import { Mutation } from 'react-apollo';
import gql from 'graphql-tag';
import Form from './styles/Form';
import Error from './ErrorMessage';
import { CURRENT_USER_QUERY } from './User';

const SIGNIN_MUTATION = gql`
    mutation SIGNIN_MUTATION($email: String!, $password: String!) {
        signin(email: $email, password: $password) {
            id
            email
            name
        }
    }

`;

export class Signin extends Component {
    state = {
        name: '',
        email: '',
        password: ''
    };
    saveToState = (e) => {
        this.setState({ [e.target.name]: e.target.value })
    }

    render() {
        return (
                // when mutation is successfully finished, it will go into Apollo store
                // and refetch query, so username section of nav should update itself
            <Mutation
                mutation={SIGNIN_MUTATION}
                variables={this.state}
                refetchQueries={[{ query: CURRENT_USER_QUERY }]}
            >
                {(Signin, { error, loading }) => (
                    <Form
                        method="post"
                        onSubmit={async e => {
                            e.preventDefault();
                            // const res = await Signin();
                            // console.log(res);
                            await Signin();
                            this.setState({ name: '', email: '', password: ''});
                        }}
                    >
                        <fieldset disabled={loading} aria-busy={loading}>
                            <h2>Sign into your account</h2>
                            <Error error={error} />
                            <label htmlFor="email">
                                Email
                                <input
                                    type="email"
                                    name="email"
                                    placeholder="email"
                                    value={this.state.email}
                                    onChange={this.saveToState}
                                    />
                            </label>
                            <label htmlFor="password">
                                Password
                                <input
                                    type="password"
                                    name="password"
                                    placeholder="password"
                                    value={this.state.password}
                                    onChange={this.saveToState}
                                    />
                            </label>
                            <button type="submit">Sign in</button>
                        </fieldset>
                    </Form>
                )}
            </Mutation>
        )
    }
}

export default Signin;
