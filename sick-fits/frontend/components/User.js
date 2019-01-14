import { Query } from 'react-apollo';
import gql from 'graphql-tag';
import propTypes from 'prop-types';

const CURRENT_USER_QUERY = gql`
    query {
        me {
            id
            email
            name
            permissions
        }
    }
`;

// we are writing User in render props so it can be used like this:
// <User>{payload => }</User>
// we won't have to rewrite the query or pass it every single time
// we'll also spread props from User into Query, in case we want to pass Query anything extra

const User = props => (
    <Query {...props} query={CURRENT_USER_QUERY}>
        {/* {({data}) => <p>data.user.name</p>} */}
        {payload => props.children(payload)}
    </Query>
);

User.propTypes = {
    children: propTypes.func.isRequired
}

export default User;
export { CURRENT_USER_QUERY };