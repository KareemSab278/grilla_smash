import { API } from './API';
import type { MenuResponse, MenuProduct, MenuOption, MealOption, Product } from '../Types';


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

export const products: Product[] = []


export const mealSideOptions: MealOption[] = []

export const drinkOptions: MealOption[] = []



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


export const getMenu = async (): Promise<MenuResponse> => {
    try {
        const response = await API.get('menu');
        console.log('Menu response:', response);

        const liveProducts: MenuProduct[] = response.products ?? []


        const liveMealSideOptions = normalizeMealOptions(response.mealSideOptions ?? [])
        mealSideOptions.splice(0, mealSideOptions.length, ...liveMealSideOptions)
        console.log('Live meal side options:', liveMealSideOptions)

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
