import React from 'react';
import { client } from '~/client';
import { graphql, readFragment } from '~/client/graphql';
import { FooterFragment } from '~/components/footer/fragment';
import BrandPage from './_components/BrandPage';

const BrandPageServer = async () => {
  const BrandsQuery = graphql(`
    query BrandsQuery($first: Int, $entityIds: [Int!]) {
      site {
        brands(first: $first, entityIds: $entityIds) {
          edges {
            node {
              entityId
              name
              path
              defaultImage {
                urlOriginal
              }
            }
          }
        }
      }
    }
  `);

  const { data: response } = await client.fetch({
    document: BrandsQuery,
    fetchOptions: { cache: 'no-store' },
  });

  const data = readFragment(FooterFragment, response).site;
  const brands = data.brands || [];
  return <BrandPage data={brands} />;
};

export default BrandPageServer;
