﻿// src/app/products/[id]/page.tsx
import { mockProducts } from '../mock-products';
import { notFound } from 'next/navigation';

// 1. Añadimos 'async' y tipamos params como una Promesa (Promise)
export default async function ProductDetailPage({ params }: { params: Promise<{ id: string }> }) {
  
  // 2. "Desempaquetamos" los parámetros usando await
  const resolvedParams = await params;
  
  // 3. Ahora sí podemos usar el id de forma segura
  const productId = parseInt(resolvedParams.id);
  
  // 4. Buscamos el producto
  const product = mockProducts.find(p => p.id === productId);

  if (!product) {
    notFound();
  }

  return (
    <div className="container mx-auto p-8 flex flex-col md:flex-row gap-8">
      {/* Sección de Imagen */}
      <div className="md:w-1/2">
        <img 
          src={product.imageUrl} 
          alt={product.title} 
          className="w-full rounded-lg shadow-md object-cover" 
        />
      </div>
      
      {/* Sección de Información */}
      <div className="md:w-1/2 flex flex-col justify-center">
        {/* Marca y Título */}
        <p className="text-sm text-gray-500 uppercase tracking-widest font-semibold mb-1">
          {product.brand}
        </p>
        <h1 className="text-4xl font-bold mb-4">{product.title}</h1>
        
        {/* Lógica de Precios y Descuentos */}
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
        
        {/* Detalles Adicionales */}
        <div className="mb-8 space-y-2 border-t pt-4">
          <p className="text-sm text-gray-600">
            <span className="font-semibold">Color:</span> {product.color}
          </p>
          <p className="text-sm text-gray-600">
            <span className="font-semibold">Stock disponible:</span> {product.quantity}
          </p>
        </div>
        
        {/* Botón de Carrito */}
        <button className="bg-green-600 text-white px-8 py-3 rounded-md hover:bg-green-700 transition font-semibold w-full md:w-1/2 shadow-sm">
          Añadir al Carrito
        </button>
      </div>
    </div>
  );
}