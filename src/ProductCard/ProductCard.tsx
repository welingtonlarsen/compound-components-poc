import { ReactNode } from 'react';
import './ProductCard.css';
import ProductImage from './ProductImage';
import ProductButton from './ProductButton';
import ProductCategory from './ProductCategory';
import ProductInfo from './ProductInfo';
import ProductPrice from './ProductPrice';
import ProductRating from './ProductRating';
import ProductTitle from './ProductTitle';
import { Product } from '../types';
import ProductCardContext from './ProductContext';

type Props = {
  product: Product;
  children: ReactNode;
};

function ProductCard({ product, children }: Props) {
  return (
    <ProductCardContext.Provider value={{ product }}>
      <div className="product-card">
        {children}
      </div>
    </ProductCardContext.Provider>
  );
}

ProductCard.Image = ProductImage;
ProductCard.Button = ProductButton;
ProductCard.Title = ProductTitle;
ProductCard.Info = ProductInfo;
ProductCard.Category = ProductCategory;
ProductCard.Rating = ProductRating;
ProductCard.Price = ProductPrice;

export default ProductCard;
