import ProductCard from './ProductCard/ProductCard';
import useProduct from './ProductCard/useProduct';
import { Product } from './types';

const product1: Product = {
  id: 1,
  image: 'https://iili.io/HCURIHu.jpg',
  title: 'Viston Earl Grey Tea',
  category: 'Black Tea',
  rating: { stars: 4, reviews: 4 },
  price: 8.95,
};
const product2: Product = {
  id: 2,
  image: 'https://iili.io/HCURIHu.jpg',
  title: 'Viston Earl Grey Tea',
  category: 'Black Tea',
  rating: { stars: 4, reviews: 4 },
  price: 8.95,
};

function App() {
  const { addToCart } = useProduct();

  return (
    <div style={{ display: 'flex', flexDirection: 'row', gap: '16px', padding: '16px' }}>
      {[product1, product2].map((product) => (
        <ProductCard key={product.id} product={product}>
          <ProductCard.Image />
          <ProductCard.Info>
            <ProductCard.Category />
            <ProductCard.Title />
            <ProductCard.Rating />
            <ProductCard.Price />
          </ProductCard.Info>
          <ProductCard.Button onClick={addToCart}>Add to cart</ProductCard.Button>
        </ProductCard>
      ))}
    </div>
  );
}

export default App;
