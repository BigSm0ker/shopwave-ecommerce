// src/app/products/page.tsx
import Link from 'next/link';
// Importamos el servicio real que hizo tu compañero
import { productService } from '@/services/product.service'; 

export default async function ProductsPage() {
  // Llamamos al backend real
  const products = await productService.getProducts();

  return (
    <div className="container mx-auto p-8">
      <h1 className="text-3xl font-bold mb-8">Nuestro Catálogo</h1>
      
      {products.length === 0 ? (
        <p className="text-gray-500">No hay productos disponibles en este momento.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {products.map((product) => (
            <div key={product.id} className="border rounded-lg p-4 shadow-sm flex flex-col">
              <img 
                src={product.imageUrl} 
                alt={product.title} 
                className="w-full h-48 object-cover mb-4 rounded" 
              />
              <h2 className="text-xl font-semibold mb-2">{product.title}</h2>
              
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
              
              <div className="mt-auto">
                <Link href={`/products/${product.id}`} className="text-blue-600 hover:underline">
                  Ver detalles
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}