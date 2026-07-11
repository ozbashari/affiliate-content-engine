'use client';

import { useState } from 'react';
import { CatalogProduct } from '@/features/products/types';
import { ProductGrid } from '@/components/products/ProductGrid';
import { SUPPORTED_CATEGORIES } from '@/features/categories/categories';

export default function ProductsPage() {
  const [products, setProducts] = useState<CatalogProduct[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedCategoryId, setSelectedCategoryId] = useState('509');
  const [scannedCategoryName, setScannedCategoryName] = useState<string | null>(null);

  const handleScan = async () => {
    setLoading(true);
    setError(null);
    setProducts([]); // Clear the current products list
    
    const categoryName = SUPPORTED_CATEGORIES.find(c => c.id === selectedCategoryId)?.name || 'Unknown';
    setScannedCategoryName(categoryName);
    
    try {
      const response = await fetch(`/api/dev/aliexpress/products?category_ids=${selectedCategoryId}`);
      
      interface ProductsApiResponse {
        success?: boolean;
        error?: string;
        products?: CatalogProduct[];
        meta?: {
          fetchedCount: number;
          unpublishedCount: number;
          filteredPublishedCount: number;
          mappingFailedCount: number;
        };
      }

      const data = (await response.json()) as ProductsApiResponse;

      if (!response.ok || data.success === false) {
        throw new Error(data.error || `HTTP error ${response.status}`);
      }

      const list = data.products;
      if (!list || list.length === 0) {
        throw new Error(`No unpublished products returned from AliExpress for category "${categoryName}". Check your category parameter or credentials.`);
      }

      setProducts(list);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : String(err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-gray-50 py-12 px-6 sm:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">Products</h1>
            <p className="mt-1 text-sm text-gray-500">
              Manage and scan affiliate products from AliExpress.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
            <div className="flex items-center gap-2">
              <label htmlFor="category-select" className="text-sm font-medium text-gray-700 whitespace-nowrap">
                Category:
              </label>
              <select
                id="category-select"
                value={selectedCategoryId}
                onChange={(e) => setSelectedCategoryId(e.target.value)}
                className="block w-full sm:w-64 pl-3 pr-10 py-2.5 text-sm bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all shadow-sm text-gray-900"
              >
                {SUPPORTED_CATEGORIES.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.name}
                  </option>
                ))}
              </select>
            </div>
            <button
              onClick={handleScan}
              disabled={loading}
              className={`inline-flex items-center justify-center bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2.5 px-6 rounded-xl transition-all shadow-sm ${
                loading ? 'opacity-50 cursor-not-allowed' : ''
              }`}
            >
              {loading ? (
                <>
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  Scanning...
                </>
              ) : (
                'Scan Products'
              )}
            </button>
          </div>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-700 rounded-xl text-sm font-medium shadow-sm">
            <span className="font-bold">Error:</span> {error}
          </div>
        )}

        {scannedCategoryName && (
          <div className="mb-4 text-sm text-gray-600">
            Showing results for category: <strong className="text-gray-900">{scannedCategoryName}</strong>
          </div>
        )}

        {loading ? (
          <div className="flex flex-col items-center justify-center p-12 border border-gray-200 rounded-2xl bg-white shadow-sm">
            <svg className="animate-spin h-8 w-8 text-blue-600 mb-3" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
            </svg>
            <p className="text-gray-500 font-medium text-sm">Scanning AliExpress for products in "{scannedCategoryName}"...</p>
          </div>
        ) : (
          <ProductGrid products={products} />
        )}
      </div>
    </main>
  );
}
