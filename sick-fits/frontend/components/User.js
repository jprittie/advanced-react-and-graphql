import { Query } from 'react-apollo';
import gql from 'graphql-tag';
import PropTypes from 'prop-types';

const CURRENT_USER_QUERY = gql`
  query {
    me {
      id
      email
      name
      permissions
      cart {
        id
        quantity
        item {
          id
          price
          image
          title
          description
        }
      }
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
        {/* {payload => props.children(payload)} */}
        {payload => console.log(payload) || props.children(payload)}
    </Query>
);

User.propTypes = {
    children: PropTypes.func.isRequired
}

export default User;
export { CURRENT_USER_QUERY };
