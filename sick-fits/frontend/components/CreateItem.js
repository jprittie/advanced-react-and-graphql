import React, { Component } from 'react';
import { Mutation } from 'react-apollo';
import gql from 'graphql-tag';
import Router from 'next/router';
import Form from './styles/Form';
import formatMoney from '../lib/formatMoney';
import Error from './ErrorMessage';

const CREATE_ITEM_MUTATION = gql`
    mutation CREATE_ITEM_MUTATION(
        $title: String!
        $description: String!
        $price: Int!
        $image: String
        $largeImage: String
    ) {
        createItem(
            title: $title
            description: $description
            price: $price
            image: $image
            largeImage: $largeImage
        ) {
            id
        }
    }
`;


class CreateItem extends Component {
    state = {
        title: 'Cool Shoes',
        description: 'I love those shoes',
        image: 'dog.jpg',
        largeImage: 'large-dog.jpg',
        price: 1000,
    };

    handleChange = e => {
        const { name, type, value } = e.target;
        const val = type === 'number' ? parseFloat(value) : value;
        this.setState({ [name]: val });
    }

    uploadFile = async e => {
        console.log("Uploading file...");
        const files = e.target.files;
        const data = new FormData();
        data.append('file', files[0]);
        data.append('upload_preset', 'sickfits');

        const res = await fetch('https://api.cloudinary.com/v1_1/dqge0bs2k/image/upload', {
                method: 'POST',
                body: data
        });
        // I think that the form needs to be disabled during this call,
        // not during the mutation (or maybe as well as during the mutation)
        // because otherwise the mutation can be called before pic is processed
        const file = await res.json();
        console.log('file', file);
        this.setState({
            image: file.secure_url,
            largeImage: file.eager[0].secure_url
        });
    }

    render() {
        return (
            <Mutation mutation={CREATE_ITEM_MUTATION} variables={this.state}>
                {(createItem, { loading, error }) => (
                    console.log('loading', loading) ||
                    <Form onSubmit={async e => {
                        // Stop the form from submitting
                        e.preventDefault();
                        // Call the mutation
                        const res = await createItem();
                        // Change them to the single-item page
                        Router.push({
                            pathname: '/item',
                            query: { id: res.data.createItem.id }
                        })
                    }}>
                        <Error error={error} />
                        <fieldset disabled={loading} aria-busy={loading}>
                            <label htmlFor="file">
                                Image
                                <input
                                    type="file"
                                    id="file"
                                    name="file"
                                    placeholder="Upload an image"
                                    // required
                                    onChange={this.uploadFile}
                                />
                            </label>

                            <label htmlFor="title">
                                Title
                                <input
                                    type="text"
                                    id="title"
                                    name="title"
                                    placeholder="Title"
                                    required
                                    value={this.state.title}
                                    onChange={this.handleChange}
                                />
                            </label>

                            <label htmlFor="price">
                                Price
                                <input
                                type="number"
                                id="price"
                                name="price"
                                placeholder="Price"
                                required
                                value={this.state.price}
                                onChange={this.handleChange}
                                />
                            </label>

                            <label htmlFor="description">
                                Description
                                <textarea
                                id="description"
                                name="description"
                                placeholder="Enter A Description"
                                required
                                value={this.state.description}
                                onChange={this.handleChange}
                                />
                            </label>
                            <button type="submit" disabled={loading}>Submit</button>
                        </fieldset>
                    </Form>
                )}
            </Mutation>
        );
    }
}

export default CreateItem;
export { CREATE_ITEM_MUTATION };
