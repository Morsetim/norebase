import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { MoveLeft, MoveRight } from 'lucide-react';

const CryptoTable = () => {
  const [page, setPage] = useState(1);
  const itemsPerPage = 10;

  const { data, isLoading, error } = useQuery({
    queryKey: ['cryptoData'],
    queryFn: async () => {
      const response = await fetch('https://api.coinlore.net/api/tickers/');
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      return response.json();
    }
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-xl font-semibold">Loading...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-red-500">Error: {error.message}</div>
      </div>
    );
  }

  const totalPages = Math.ceil((data?.data?.length || 0) / itemsPerPage);
  const startIndex = (page - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentData = data?.data?.slice(startIndex, endIndex) || [];

  const handlePreviousPage = () => {
    setPage((prev) => Math.max(prev - 1, 1));
  };

  const handleNextPage = () => {
    setPage((prev) => Math.min(prev + 1, totalPages));
    
  };

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">Cryptocurrency Prices</h1>
      <div className="overflow-x-auto mb-4">
        <table className="w-full border-collapse">
          <thead>
            <tr className=" text-white">
              <th className="px-4 py-2 text-left text-slate-900">Coin</th>
              <th className="px-4 py-2 text-left text-slate-900">Code</th>
              <th className="px-4 py-2 text-right text-slate-900">Price</th>
              <th className="px-4 py-2 text-right text-slate-900">Total Supply</th>
            </tr>
          </thead>
          <tbody>
            {currentData.map((coin, index) => (
              <tr 
                key={coin.id}
                className={index % 2 === 0 ? 'bg-gray-200' : 'bg-white'}
              >
                <td className="px-4 py-2">{coin.name}</td>
                <td className="px-4 py-2">{coin.symbol}</td>
                <td className="px-4 py-2 text-right">
                  ${parseFloat(coin.price_usd).toFixed(2)}
                </td>
                <td className="px-4 py-2 text-right flex justify-end gap-x-2">
                    <span> {(parseFloat(coin.tsupply) / 1000000).toFixed(2)}</span>
                    <span className=''>{coin.symbol} </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="flex justify-between">
        <div className="flex items-center justify-between space-x-2 w-full">
          <button
            onClick={handlePreviousPage}
            disabled={page === 1}
            className={`${
              page === 1
                ? 'cursor-not-allowed text-gray-400'
                : ' '
            }`}
          >
            <div className='flex gap-x-2 justify-between items-center'>
            <MoveLeft className="h-5 w-5" />
            <p className={`font-bold `}>Previous</p>
            </div>
          </button>
          <button
            onClick={handleNextPage}
            disabled={page === totalPages}
            className={`${
              page === totalPages
                ? ' text-gray-400 cursor-not-allowed'
                : 'text-gray-700 '
            }`}
          >
            <div className='flex gap-x-2 justify-between items-center'>
                <p className='font-bold'>Next</p>
                <MoveRight className="h-5 w-5" />
            </div>
          </button>
        </div>
      </div>
    </div>
  );
};

export default CryptoTable;