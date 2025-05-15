export interface Product {
  id: string;
  name: string;
}

const products: Product[] = [
  { id: "1", name: "Widget" },
  { id: "2", name: "Gadget" },
];

export const getAllProducts = (): Product[] => products;
export const getProductById = (id: string): Product | undefined =>
  products.find((p) => p.id === id);
