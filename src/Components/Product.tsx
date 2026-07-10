import { useState } from 'react'
import type { CSSProperties } from 'react'

import type { Product } from '../Types'

interface ProductCardProps {
  product: Product
  onAdd: () => void
}

export const ProductCard = ({ product, onAdd }: ProductCardProps) => {
  const [hovered, setHovered] = useState(false)

  const cardStyle: CSSProperties = {
    ...styles.card,
    transform: hovered ? 'translateY(-10px)' : 'translateY(0)',
    borderColor: hovered ? 'var(--orange)' : '#333',
    boxShadow: hovered ? '0 10px 30px rgba(247, 147, 30, 0.2)' : 'none',
  }

  const imageStyle: CSSProperties = {
    ...styles.image,
    transform: hovered ? 'scale(1.05)' : 'scale(1)',
  }

  const buttonStyle: CSSProperties = {
    ...styles.addBtn,
    background: hovered ? 'var(--orange)' : 'transparent',
    color: hovered ? 'var(--black)' : 'var(--orange)',
  }

  return (
    <article
      style={cardStyle}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <img src={product.image} alt={product.name} loading="lazy" style={imageStyle} />
      <h3 style={styles.title}>{product.name}</h3>
      <p style={styles.description}>{product.description}</p>
      <span style={styles.price}>£{product.price.toFixed(2)}</span>
      <button type="button" style={buttonStyle} onClick={onAdd}>
        Add to Cart
      </button>
    </article>
  )
}


const styles: { [key: string]: CSSProperties } = {
  card: {
    background: 'var(--dark-grey)',
    borderRadius: '16px',
    overflow: 'hidden',
    border: '1px solid #333',
    transition: 'all 0.3s ease',
    display: 'flex',
    flexDirection: 'column',
  },
  image: {
    width: '100%',
    height: '200px',
    objectFit: 'cover',
    transition: 'all 0.3s ease',
  },
  title: {
    padding: '20px 20px 10px',
    fontSize: '1.5rem',
    color: 'var(--white)',
  },
  description: {
    padding: '0 20px',
    color: '#aaa',
    fontSize: '0.9rem',
    flexGrow: 1,
  },
  price: {
    display: 'block',
    padding: '15px 20px',
    fontFamily: "'Bebas Neue', sans-serif",
    fontSize: '1.5rem',
    color: 'var(--orange)',
  },
  addBtn: {
    margin: '0 20px 20px',
    background: 'transparent',
    border: '2px solid var(--orange)',
    color: 'var(--orange)',
    padding: '10px',
    borderRadius: '50px',
    fontFamily: 'Poppins, sans-serif',
    fontWeight: 600,
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    textTransform: 'uppercase',
    letterSpacing: '1px',
    fontSize: '0.95rem',
  },
}