import { Product } from '@/models/product.model'; // Ajusta la ruta si tu modelo está en otra carpeta

export const mockProducts: Product[] = [
  {
    id: 1,
    title: "Teclado Mecánico RGB",
    description: "Teclado mecánico con switches azules y retroiluminación.",
    price: 85.50,
    discountedPrice: 70.00,
    discountPersent: 18,
    quantity: 15,
    brand: "TechGear",
    color: "Negro",
    sizes: [], // Es un array obligatorio según el modelo, aunque esté vacío
    imageUrl: "/images/teclado.jpg" 
  },
  {
    id: 2,
    title: "Mouse Gamer Inalámbrico",
    description: "Mouse ergonómico de 10000 DPI con batería de larga duración.",
    price: 45.00,
    discountedPrice: 45.00,
    discountPersent: 0,
    quantity: 30,
    brand: "GamerPro",
    color: "Blanco",
    sizes: [],
    imageUrl: "/images/mouse.jpg"
  }
];