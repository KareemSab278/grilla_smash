import type { Product, CartItem, Extra } from "../Types"
import { extrasByCategory, chickenSauceOptions, products, mealOptions } from "../products"

export const MEAL_DISCOUNT = 0.50

export const getAvailableExtras = (product: Product): Extra[] =>
    (extrasByCategory as Record<string, Extra[]>)[product.category] ?? []

export const canMakeItAMeal = (product: Product): boolean =>
    ['burgers', 'chicken', 'wraps'].includes(product.category)

export const getDrinkOptions = (): Product[] =>
    products.filter(p => p.category === 'drinks')

export const getSideOptions = ()=> mealOptions;

export const getSauceOptions = (): string[] => chickenSauceOptions

export const getCartItemTotal = (item: CartItem): number => {
    const extrasTotal = item.extras?.reduce((sum, e) => sum + e.price, 0) ?? 0
    const mealTotal = item.meal
        ? item.meal.drink.price + item.meal.side.price - MEAL_DISCOUNT
        : 0
    return (item.product.price + extrasTotal + mealTotal) * item.quantity
}
