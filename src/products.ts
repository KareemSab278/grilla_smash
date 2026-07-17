import type { Product, MealOption, MenuResponse, MenuProduct, MenuOption } from './Types'
import { call } from './Helpers/call'

const normalizeMealOptions = (items: { id?: number; name: string; price: number }[] = []): MealOption[] =>
    items.map((item, index) => ({
        id: item.id ?? index + 1,
        name: item.name,
        price: item.price,
    }))

const normalizeExtras = (items: any[] = []): MenuOption[] =>
    items.map((item) => ({
        name: item.name,
        price: item.price,
        category: item.category,
        is_protein: item.is_protein ?? item.isProtein,
        isProtein: item.isProtein ?? item.is_protein,
    }))

export const products: Product[] = []

export const mealSideOptions: MealOption[] = []

export const drinkOptions: MealOption[] = []

export const extrasByCategory: {
    burgers: MenuOption[]
    wraps: MenuOption[]
    chicken: MenuOption[]
    'loaded-fries': MenuOption[]
} = {
    burgers: [],
    wraps: [],
    chicken: [],
    'loaded-fries': [],
}

export const mealOptions: {
    name: string
    price: number
}[] = []

export const chickenSauceOptions: string[] = ['Lemon & Herb', 'Mild', 'Wild', 'Honey Sriracha']

export const getMenu = async (): Promise<MenuResponse> => {
    try {
        const response = await call('menu');
        console.log('Menu response:', response);

        const liveProducts: MenuProduct[] = response.products ?? []
        products.splice(0, products.length, ...liveProducts)

        const liveMealSideOptions = normalizeMealOptions(response.mealSideOptions ?? [])
        mealSideOptions.splice(0, mealSideOptions.length, ...liveMealSideOptions)

        const liveDrinkOptions = normalizeMealOptions(response.drinkOptions ?? [])
        drinkOptions.splice(0, drinkOptions.length, ...liveDrinkOptions)

        const liveExtras = response.extrasByCategory as Record<string, any[]> ?? {
            burgers: [],
            wraps: [],
            chicken: [],
            'loaded-fries': [],
        }
        Object.keys(extrasByCategory).forEach((key) => delete extrasByCategory[key as keyof typeof extrasByCategory])
        const normalizedExtras = Object.entries(liveExtras as Record<string, any[]>).reduce((acc, [category, items]) => {
            acc[category] = normalizeExtras(items)
            return acc
        }, {} as Record<string, MenuOption[]>)
        Object.assign(extrasByCategory, normalizedExtras)

        const liveMealOptions = response.mealOptions ?? []
        mealOptions.splice(0, mealOptions.length, ...liveMealOptions)

        return {
            products: liveProducts,
            mealSideOptions: liveMealSideOptions,
            drinkOptions: liveDrinkOptions,
            extrasByCategory: extrasByCategory,
            mealOptions: liveMealOptions,
        }
    } catch (error) {
        console.error('Error fetching menu:', error);
        throw error;
    }
}
