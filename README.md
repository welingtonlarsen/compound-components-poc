# Compound Components POC

This project is a small React proof of concept that demonstrates the
compound components pattern through a `ProductCard` UI.

Instead of exposing one large component with many props, the card exposes a family
of related components:

```tsx
<ProductCard product={product}>
  <ProductCard.Image />
  <ProductCard.Info>
    <ProductCard.Category />
    <ProductCard.Title />
    <ProductCard.Rating />
    <ProductCard.Price />
  </ProductCard.Info>
  <ProductCard.Button onClick={addToCart}>Add to cart</ProductCard.Button>
</ProductCard>
```

The parent component owns the shared state, and the child components consume that
state without requiring the caller to pass the same props repeatedly.

## What Are Compound Components?

Compound components are components designed to work together under a shared
parent. The pattern is common in UI libraries because it lets consumers compose a
component's internal parts declaratively while the implementation keeps shared
state and behavior in one place.

A familiar example is:

```tsx
<select>
  <option>One</option>
  <option>Two</option>
</select>
```

The `option` elements only make sense inside `select`, but the consumer still has
control over how many options exist and how they are ordered. Compound React
components follow the same idea.

## Why Use This Pattern?

Compound components are useful when a UI has several related parts that need to
share data or behavior.

Benefits:

- Flexible composition: consumers can choose which parts to render and in what
  order.
- Cleaner APIs: shared data is passed once to the parent instead of repeated on
  every child.
- Better encapsulation: internal children know how to read the parent context.
- Discoverable usage: `ProductCard.Image`, `ProductCard.Price`, and
  `ProductCard.Button` communicate that these pieces belong together.

Trade-offs:

- The implementation usually needs React context.
- Children are coupled to the parent and should be rendered inside it.
- TypeScript support can require additional typing when the static subcomponents
  grow more complex.

## How This POC Works

The POC is centered on the `ProductCard` folder:

```txt
src/ProductCard/
  ProductCard.tsx
  ProductContext.ts
  useProduct.ts
  ProductImage.tsx
  ProductInfo.tsx
  ProductCategory.tsx
  ProductTitle.tsx
  ProductRating.tsx
  ProductPrice.tsx
  ProductButton.tsx
  ProductCard.css
```

### 1. The parent receives the product once

`ProductCard` accepts a `product` and `children`.

```tsx
type Props = {
  product: Product;
  children: ReactNode;
};

function ProductCard({ product, children }: Props) {
  return (
    <ProductCardContext.Provider value={{ product }}>
      <div className="product-card">{children}</div>
    </ProductCardContext.Provider>
  );
}
```

The product is provided through `ProductCardContext`, so descendants can access it
without receiving `product` as a prop.

### 2. The subcomponents are attached to the parent

At the bottom of `ProductCard.tsx`, each child component is assigned as a static
property:

```tsx
ProductCard.Image = ProductImage;
ProductCard.Button = ProductButton;
ProductCard.Title = ProductTitle;
ProductCard.Info = ProductInfo;
ProductCard.Category = ProductCategory;
ProductCard.Rating = ProductRating;
ProductCard.Price = ProductPrice;
```

This creates the public API:

```tsx
ProductCard.Image
ProductCard.Info
ProductCard.Category
ProductCard.Title
ProductCard.Rating
ProductCard.Price
ProductCard.Button
```

That API makes it clear that these pieces are intended to be used as part of a
`ProductCard`.

### 3. Child components read shared data from context

For example, `ProductTitle` does not receive a `title` prop. It reads the active
product from context:

```tsx
function ProductTitle() {
  const { product } = useProductCardContext();
  return <div className="product-title">{product.title}</div>;
}
```

The same idea is used by:

- `ProductImage`, which reads `product.image`.
- `ProductCategory`, which reads `product.category`.
- `ProductRating`, which reads `product.rating.stars`.
- `ProductPrice`, which reads `product.price`.
- `ProductButton`, which passes the current `product` to its `onClick` handler.

### 4. The context hook protects correct usage

`useProductCardContext` throws an error when a subcomponent is rendered outside
`ProductCard`:

```tsx
export function useProductCardContext() {
  const context = useContext(ProductCardContext);
  if (!context) {
    throw new Error('ProductCard.* component must be rendered as child of ProductCard component');
  }
  return context;
}
```

This is an important guardrail. It makes invalid usage fail early and explains
how the component should be used.

## Example From This Project

`src/App.tsx` maps over products and renders each card with the same compound
component API:

```tsx
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
```

The caller controls the structure, but each child still knows which product it
belongs to.

## Composition Examples

Because the parts are composable, the consumer can change the card without
changing `ProductCard` itself.

Render only a minimal card:

```tsx
<ProductCard product={product}>
  <ProductCard.Image />
  <ProductCard.Title />
  <ProductCard.Button onClick={addToCart}>Buy</ProductCard.Button>
</ProductCard>
```

Move the price above the rating:

```tsx
<ProductCard product={product}>
  <ProductCard.Image />
  <ProductCard.Info>
    <ProductCard.Title />
    <ProductCard.Price currency="USD" />
    <ProductCard.Rating />
  </ProductCard.Info>
</ProductCard>
```

Omit the button for a read-only card:

```tsx
<ProductCard product={product}>
  <ProductCard.Image />
  <ProductCard.Info>
    <ProductCard.Category />
    <ProductCard.Title />
    <ProductCard.Price />
  </ProductCard.Info>
</ProductCard>
```

## Product Data Contract

The components share this `Product` shape from `src/types.ts`:

```ts
export type Product = {
  id: number;
  image: string;
  title: string;
  category: string;
  rating: { stars: number; reviews: number };
  price: number;
};
```

Passing this object once to `ProductCard` is enough for all subcomponents.

## When This Pattern Fits

Use compound components when:

- A feature has multiple UI parts that belong to the same parent.
- Those parts need shared state or shared behavior.
- Consumers need layout flexibility.
- A single component with many optional props would become hard to read.

Avoid the pattern when:

- The component is simple and does not need internal composition.
- The child components do not share state.
- Consumers should not be able to rearrange or omit parts.

## Running the Project

Install dependencies:

```bash
yarn
```

Start the development server:

```bash
yarn dev
```

Build the project:

```bash
yarn build
```

Lint the project:

```bash
yarn lint
```

## Tech Stack

- React 18
- TypeScript
- Vite
- React Icons

## Key Takeaway

Compound components let this POC expose a readable, flexible API while keeping
the product data and card behavior centralized. The consumer writes JSX that
looks like the final UI structure, and the implementation handles the shared
state behind the scenes.
