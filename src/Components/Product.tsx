type Product = {
  id: number
  name: string
  category: string
  price: number
  description: string
  image: string
  popular: boolean
}

type ProductCardProps = {
  product: Product
  onAdd: () => void
}

export const ProductCard = ({ product, onAdd }: ProductCardProps) => {
  return (
    <article className="food-card">
      <img src={product.image} alt={product.name} loading="lazy" />
      <h3>{product.name}</h3>
      <p>{product.description}</p>
      <span className="price">£{product.price.toFixed(2)}</span>
      <button type="button" className="add-btn" onClick={onAdd}>
        Add to Cart
      </button>
    </article>
  )
}
