import { CatalogProduct } from '@/features/products/types';
import { ProductCard } from './ProductCard';

interface ProductGridProps {
  products: CatalogProduct[];
}

export function ProductGrid({ products }: ProductGridProps) {
  if (products.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-12 border-2 border-dashed border-gray-200 rounded-2xl bg-gray-50 text-gray-500">
        <p className="text-lg font-medium mb-1">No products found</p>
        <p className="text-sm">{'Click "Scan Products" to retrieve items from AliExpress.'}</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
}
