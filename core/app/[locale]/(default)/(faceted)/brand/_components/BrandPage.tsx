'use client';

import React, { useState, useEffect } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import { Navigation } from 'swiper/modules';
import Link from 'next/link';

interface Brand {
  id: number;
  name: string;
  image_url: string;
  is_featured: boolean;
  path: string;
}


interface BrandPageProps {
  data: {
    edges:
      | {
          node: {
            entityId: number;
            name: string;
            path: string;
            defaultImage: {
              urlOriginal: string;
            };
          };
        }[]
      | null;
  };
}


const BrandPage: React.FC<BrandPageProps> = ({ data }) => {
  const [allBrands, setAllBrands] = useState<Brand[]>([]);
  const [filteredBrands, setFilteredBrands] = useState<Brand[]>([]);
  const [currentLetter, setCurrentLetter] = useState<string>('');

  useEffect(() => {
    const transformedBrands =
      data.edges?.map((edge) => ({
        id: edge?.node?.entityId,
        name: edge?.node?.name,
        image_url:edge?.node?.defaultImage?.urlOriginal,
        is_featured: false,
        path: edge?.node?.path,
      })) || [];

    const sortedBrands = transformedBrands.sort((a, b) => a.name.localeCompare(b.name));

    setAllBrands(sortedBrands);
    setFilteredBrands(sortedBrands);
  }, [data]);

  const handleAZFilter = (letter: string) => {
    setCurrentLetter(letter);
    const filtered = allBrands.filter((brand) =>
      brand.name.toLowerCase().startsWith(letter.toLowerCase()),
    );
    setFilteredBrands(filtered);
  };

  const handleAllFilter = () => {
    setFilteredBrands(allBrands);
    setCurrentLetter('');
  };

  const groupBrandsByAlphabet = (brands: Brand[]) => {
    return brands.reduce(
      (acc, brand) => {
        const firstLetter = brand.name.charAt(0).toUpperCase();
        if (!acc[firstLetter]) {
          acc[firstLetter] = [];
        }
        acc[firstLetter].push(brand);
        return acc;
      },
      {} as Record<string, Brand[]>,
    );
  };

  return (
    <div className="mx-auto max-w-7xl px-6 py-8 border-t">
      <h1 className="mb-6 text-center text-3xl font-bold text-gray-800">Brands</h1>

      <div className="mb-12 flex items-center rounded-lg bg-gray-100 p-6 shadow-md">
        <div className="flex-none">
          <img
            src="https://www.klizer.com/wp-content/uploads/2023/12/klizer-black-icon-only-1.png"
            alt="Brands"
            className="h-40 w-40 rounded-lg object-cover"
          />
        </div>
        <div className="ml-6">
          <p className="mb-4 text-lg text-gray-600">
            Over the last 30 years, we’ve developed and refined the electrical products and services
            we offer to meet the ever-changing needs of our customers.
          </p>
          <p className="text-lg text-gray-600">
            Our team of experienced professionals and specialists has the knowledge and experience
            to help you source the products you need from the brands you know and trust.
          </p>
        </div>
      </div>

      {/* Featured Brands Section */}
      <div className="mb-12">
        <h2 className="mb-4 text-2xl font-semibold text-gray-700">Our Featured Brands</h2>
        <Swiper
          spaceBetween={20}
          slidesPerView="auto"
          navigation={true}
          modules={[Navigation]}
          breakpoints={{
            640: { slidesPerView: 2 },
            768: { slidesPerView: 3 },
            1024: { slidesPerView: 6 },
          }}
          className="py-2"
        >
          {allBrands?.map((brand) => (
            <SwiperSlide key={brand.id} className="w-36 sm:w-40 md:w-48 lg:w-56 xl:w-64">
              <div className="flex h-48 flex-col justify-between rounded-lg bg-white p-4 text-center shadow-md">
                <img
                  src={brand.image_url}
                  alt={brand.name}
                  className="mx-auto h-24 w-24 rounded-lg object-contain"
                />
                <h3 className="mt-2 text-sm font-medium text-gray-700">{brand.name}</h3>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>

      <h2 className="mb-4 text-2xl font-semibold text-gray-700">Shop All Brands</h2>

      <div className="mb-6 flex flex-wrap justify-center gap-2">
        <button
          onClick={handleAllFilter}
          className={`rounded-full bg-blue-500 px-3 py-1.5 text-xs font-semibold text-white hover:bg-blue-600 ${
            !currentLetter ? 'ring-2 ring-blue-300 ring-offset-2' : ''
          }`}
        >
          All
        </button>
        {'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('').map((letter) => (
          <button
            key={letter}
            onClick={() => handleAZFilter(letter)}
            className={`rounded-full bg-gray-200 px-3 py-1.5 text-xs font-semibold text-gray-700 hover:bg-blue-500 hover:text-white ${
              currentLetter === letter
                ? 'bg-blue-500 text-white ring-2 ring-blue-300 ring-offset-2'
                : ''
            }`}
          >
            {letter}
          </button>
        ))}
      </div>

      <div className="mt-6">
        {Object.entries(groupBrandsByAlphabet(filteredBrands)).length ? (
          Object.entries(groupBrandsByAlphabet(filteredBrands)).map(([letter, brands]) => (
            <div key={letter} className="mb-8">
              <div>
                <h3 className="mb-4 justify-center text-xl font-bold text-gray-800">{letter}</h3>
              </div>
              <div className="flex flex-wrap justify-center gap-6">
                {brands.length > 0 ? (
                  brands.map((brand) => (
                    <Link
                      href={brand.path}
                      key={brand.id}
                      className="group relative w-40 flex-none rounded-lg bg-white shadow-lg transition hover:shadow-xl"
                    >
                      <div className="relative overflow-hidden rounded-t-lg">
                        <img
                          src={brand.image_url}
                          alt={brand.name}
                          className="h-32 w-full object-contain transition-transform duration-300 group-hover:scale-105"
                        />
                      </div>
                      <div className="p-4 text-center">
                        <h3 className="text-sm font-medium text-gray-800 group-hover:text-blue-500">
                          {brand.name}
                        </h3>
                      </div>
                    </Link>
                  ))
                ) : (
                  <div className="flex h-48 w-full items-center justify-center">
                    <h3 className="text-lg font-medium text-gray-700">No Brands Available</h3>
                  </div>
                )}
              </div>
            </div>
          ))
        ) : (
          <div className="flex h-48 w-full items-center justify-center">
            <h3 className="text-lg font-medium text-gray-700">No Brands Available</h3>
          </div>
        )}
      </div>
    </div>
  );
};

export default BrandPage;