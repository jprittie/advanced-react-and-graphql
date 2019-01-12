import React from 'react';
import gql from 'graphql-tag';
import { Query } from 'react-apollo';
import Head from 'next/head';
import Link from 'next/link';
import PaginationStyles from './styles/PaginationStyles';
import { perPage } from '../config';

const PAGINATION_QUERY = gql`
    query PAGINATION_QUERY {
        itemsConnection {
            aggregate {
                count
            }
        }
    }
`;

const Pagination = props => (
    <Query query={PAGINATION_QUERY}>
        {({ data, loading, error }) => {
            if (loading) return <p>Loading...</p>
            const count = data.itemsConnection.aggregate.count;
            const pages = Math.ceil(count / perPage);
            return (
                <PaginationStyles>
                    <Head>
                        <title>Sick Fits! — Page {props.page} of {pages}</title>
                    </Head>
                    <p>
                        Page {props.page} of {pages}
                    </p>
                </PaginationStyles>
            )
        }}
    </Query>
);

export default Pagination;