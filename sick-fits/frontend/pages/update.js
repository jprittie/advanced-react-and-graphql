import UpdateItem from '../components/UpdateItem';

// query is available because in App.js, we wrote pageProps.query = ctx.query;
// could also have exported component wrapped in withRouter
const Sell = props => (
    <div>
        <UpdateItem id={props.query.id} />
    </div>
)

export default Sell;
