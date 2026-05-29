// src/app/products/[id]/page.tsx
import { productService } from '@/services/product.service';
import { notFound } from 'next/navigation';

export default async function ProductDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params;
  const productId = parseInt(resolvedParams.id);
  
  let product;

  try {
    // Usamos el servicio de tu compañero para buscar por ID
    product = await productService.getProductById(productId);
  } catch (error) {
    // Si el backend responde con un error (ej. 404 Not Found), disparamos notFound()
    notFound();
  }

  return (
    <div className="container mx-auto p-8 flex flex-col md:flex-row gap-8">
      <div className="md:w-1/2">
        <img 
          src={product.imageUrl} 
          alt={product.title} 
          className="w-full rounded-lg shadow-md object-cover" 
        />
      </div>
      
      <div className="md:w-1/2 flex flex-col justify-center">
        <p className="text-sm text-gray-500 uppercase tracking-widest font-semibold mb-1">
          {product.brand}
        </p>
        <h1 className="text-4xl font-bold mb-4">{product.title}</h1>
        
        <div className="flex items-center gap-3 mb-6">
          <p className="text-3xl text-blue-600 font-bold">
            ${product.discountedPrice.toFixed(2)}
          </p>
          {product.discountPersent > 0 && (
            <>
              <p className="text-xl text-gray-400 line-through">
                ${product.price.toFixed(2)}
              </p>
              <span className="bg-red-100 text-red-600 px-2 py-1 rounded text-sm font-bold">
                -{product.discountPersent}%
              </span>
            </>
          )}
        </div>
        
        <p className="text-gray-700 mb-6 leading-relaxed">
          {product.description}
        </p>
        
        <div className="mb-8 space-y-2 border-t pt-4">
          <p className="text-sm text-gray-600">
            <span className="font-semibold">Color:</span> {product.color}
          </p>
          <p className="text-sm text-gray-600">
            <span className="font-semibold">Stock disponible:</span> {product.quantity}
          </p>
        </div>
        
        <button className="bg-green-600 text-white px-8 py-3 rounded-md hover:bg-green-700 transition font-semibold w-full md:w-1/2 shadow-sm">
          Añadir al Carrito
        </button>
      </div>
    </div>
  );
}