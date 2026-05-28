import Link from 'next/link';
import { mockProducts } from './mock-products';

export default function ProductsPage() {
  return (
    <div className="container mx-auto p-8">
      <h1 className="text-3xl font-bold mb-8">Nuestro Catálogo</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {mockProducts.map((product) => (
          <div key={product.id} className="border rounded-lg p-4 shadow-sm flex flex-col">
            <img 
              src={product.imageUrl} 
              alt={product.title} 
              className="w-full h-48 object-cover mb-4 rounded" 
            />
            <h2 className="text-xl font-semibold mb-2">{product.title}</h2>
            
            {/* Lógica para mostrar precios con o sin descuento */}
            <div className="flex items-center gap-2 mb-4">
              <p className="text-lg font-bold text-gray-900">
                ${product.discountedPrice.toFixed(2)}
              </p>
              {product.discountPersent > 0 && (
                <p className="text-sm text-red-500 line-through">
                  ${product.price.toFixed(2)}
                </p>
              )}
            </div>
            
            {/* Este div empuja el botón hacia abajo para que las tarjetas queden alineadas */}
            <div className="mt-auto">
              <Link href={`/products/${product.id}`} className="text-blue-600 hover:underline">
                Ver detalles
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}