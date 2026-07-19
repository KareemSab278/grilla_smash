import type { Product, CartItem, Extra } from "../Types"
import { extrasByCategory, chickenSauceOptions, drinkOptions, mealSideOptions } from "../Helpers/menu"

export const MEAL_PRICE_INCREASE = 2.50

export const getAvailableExtras = (product: Product): Extra[] =>
    (extrasByCategory as Record<string, Extra[]>)[product.category] ?? []

export const canMakeItAMeal = (product: Product): boolean =>
    ['burgers', 'chicken', 'wraps'].includes(product.category)

export const getDrinkOptions = () => drinkOptions

export const getSideOptions = ()=> mealSideOptions;

export const getSauceOptions = (): string[] => chickenSauceOptions

export const getCartItemTotal = (item: CartItem): number => {
    const extrasTotal = item.extras?.reduce((sum, e) => sum + e.price, 0) ?? 0
    const mealTotal = item.meal
        ? item.meal.drink.price + item.meal.side.price + MEAL_PRICE_INCREASE
        : 0
    return (item.product.price + extrasTotal + mealTotal) * item.quantity
}

export const requiresChickenSauce = (item: CartItem): boolean => item.product.category === 'chicken' && !item.sauceChoice
