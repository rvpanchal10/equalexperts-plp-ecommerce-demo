import { CartItem as CartItemType } from '../../types';
import { formatPrice } from '../../utils/format';
import './CartItem.css';

interface CartItemProps {
  item: CartItemType;
  onUpdateQuantity: (productId: number, quantity: number) => void;
  onRemove: (productId: number) => void;
}

export default function CartItemComponent({ item, onUpdateQuantity, onRemove }: CartItemProps) {
  const lineTotal = item.product.price * item.quantity;

  return (
    <div className="cart-item" data-testid={`cart-item-${item.product.id}`}>
      <img className="cart-item__image" src={item.product.image} alt={item.product.title} loading="lazy" />
      <div className="cart-item__details">
        <h3 className="cart-item__title">{item.product.title}</h3>
        <span className="cart-item__unit-price">{formatPrice(item.product.price)} each</span>
        <div className="cart-item__controls">
          <button
            className="cart-item__qty-btn"
            onClick={() => onUpdateQuantity(item.product.id, item.quantity - 1)}
            aria-label={`Decrease quantity of ${item.product.title}`}
            data-testid={`decrease-qty-${item.product.id}`}
          >−</button>
          <span className="cart-item__quantity" data-testid={`cart-qty-${item.product.id}`} aria-label={`Quantity: ${item.quantity}`}>
            {item.quantity}
          </span>
          <button
            className="cart-item__qty-btn"
            onClick={() => onUpdateQuantity(item.product.id, item.quantity + 1)}
            aria-label={`Increase quantity of ${item.product.title}`}
            data-testid={`increase-qty-${item.product.id}`}
          >+</button>
        </div>
      </div>
      <div className="cart-item__right">
        <span className="cart-item__total" data-testid={`cart-line-total-${item.product.id}`}>{formatPrice(lineTotal)}</span>
        <button
          className="cart-item__remove"
          onClick={() => onRemove(item.product.id)}
          aria-label={`Remove ${item.product.title} from cart`}
          data-testid={`remove-item-${item.product.id}`}
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <polyline points="3 6 5 6 21 6" />
            <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
          </svg>
        </button>
      </div>
    </div>
  );
}