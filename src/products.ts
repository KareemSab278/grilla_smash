import type { Product, MealOption } from './Types'

export const products: Product[] = [
    { id: 1, name: 'Original Double Smash', category: 'burgers', price: 5.49, description: 'Two smashed patties, cheese, lettuce, gherkins and signature smash sauce.', image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=500&h=400&fit=crop' },
    { id: 2, name: 'Oklahoma Burger', category: 'burgers', price: 5.99, description: 'Smash patties grilled with onions, cheese, lettuce and smash sauce.', image: 'https://images.unsplash.com/photo-1550547660-d9450f859349?w=500&h=400&fit=crop', popular: true },
    { id: 3, name: 'Nacho Smash', category: 'burgers', price: 5.99, description: 'Smashed beef patty topped with nachos, cheese sauce and jalapeños.', image: 'https://images.unsplash.com/photo-1594212699903-ec8a3eca50f5?w=500&h=400&fit=crop', popular: true },
    { id: 4, name: 'Single Smash', category: 'burgers', price: 4.49, description: 'One smashed patty with cheese, lettuce, gherkins and smash sauce.', image: 'https://images.unsplash.com/photo-1586190848861-99aa4a171e90?w=500&h=400&fit=crop' },
    { id: 5, name: 'Quarter Chicken', category: 'chicken', price: 5.29, description: 'Flame grilled peri-peri chicken. Choose your heat level.', image: 'https://images.unsplash.com/photo-1606755962773-d324e0a13086?w=500&h=400&fit=crop' },
    { id: 6, name: 'Half Chicken', category: 'chicken', price: 7.99, description: 'Half chicken grilled to perfection. Lemon & Herb to Wild.', image: 'https://images.unsplash.com/photo-1598103442097-8b74394b95c6?w=500&h=400&fit=crop' },
    { id: 7, name: 'Full Chicken', category: 'chicken', price: 12.99, description: 'Whole peri-peri chicken. Feeds 2-3 people.', image: 'https://images.unsplash.com/photo-1532550907401-a500c9a57435?w=500&h=400&fit=crop' },
    { id: 8, name: 'Chicken Wings', category: 'chicken', price: 4.99, description: '6 crispy wings tossed in your choice of peri sauce.', image: 'https://images.unsplash.com/photo-1567620832903-9fc6debc209f?w=500&h=400&fit=crop' },
    { id: 9, name: 'Chicken Strips', category: 'chicken', price: 4.49, description: '3 tender grilled chicken strips. Perfect for dipping.', image: 'https://images.unsplash.com/photo-1626082927389-6cd097cdc6ec?w=500&h=400&fit=crop' },
    { id: 10, name: 'Chicken Burger', category: 'burgers', price: 4.99, description: 'Grilled chicken breast with lettuce, mayo and peri drizzle.', image: 'https://images.unsplash.com/photo-1603569283847-aa295f0d016a?w=500&h=400&fit=crop', popular: true },
    { id: 11, name: 'Chicken & Rice', category: 'chicken', price: 6.49, description: 'Grilled peri chicken served over spiced rice with coleslaw.', image: 'https://images.unsplash.com/photo-1604908176997-125f25cc6f3d?w=500&h=400&fit=crop' },
    { id: 12, name: 'Chicken Wrap', category: 'wraps', price: 4.99, description: 'Grilled chicken, lettuce, cheese and peri mayo wrapped tight.', image: 'https://images.unsplash.com/photo-1626700051175-6818013e1d4f?w=500&h=400&fit=crop' },
    { id: 13, name: 'Smash Wrap', category: 'wraps', price: 5.49, description: 'Smashed patty, cheese, gherkins and smash sauce in a tortilla.', image: 'https://images.unsplash.com/photo-1626700051175-6818013e1d4f?w=500&h=400&fit=crop' },
    { id: 14, name: 'Chicken Loaded Fries', category: 'loaded-fries', price: 5.49, description: 'Fries topped with grilled chicken, cheese sauce and jalapeños.', image: 'https://images.unsplash.com/photo-1520072959219-c595dc870360?w=500&h=400&fit=crop' },
    { id: 15, name: 'Beef Loaded Fries', category: 'loaded-fries', price: 5.99, description: 'Fries loaded with smashed beef, cheese sauce and smash sauce.', image: 'https://images.unsplash.com/photo-1573080496987-a199f8cd3c65?w=500&h=400&fit=crop' },
    { id: 16, name: 'Fries', category: 'sides', price: 2.49, description: 'Crispy golden fries, lightly salted.', image: 'https://images.unsplash.com/photo-1573080496987-a199f8cd3c65?w=500&h=400&fit=crop' },
    { id: 17, name: 'Peri Fries', category: 'sides', price: 2.99, description: 'Fries tossed in peri-peri seasoning. Spicy and addictive.', image: 'https://images.unsplash.com/photo-1630384060421-cb20d0e0649d?w=500&h=400&fit=crop' },
    { id: 18, name: 'Nachos', category: 'sides', price: 3.49, description: 'Tortilla chips with cheese sauce and salsa.', image: 'https://images.unsplash.com/photo-1513456852971-30c0b8199d4d?w=500&h=400&fit=crop' },
    { id: 19, name: 'Onion Rings', category: 'sides', price: 2.99, description: 'Crispy battered onion rings.', image: 'https://images.unsplash.com/photo-1639024471283-03518883512d?w=500&h=400&fit=crop' },
    { id: 20, name: 'Mozzarella Sticks', category: 'sides', price: 3.49, description: '6 golden mozzarella sticks with dip.', image: 'https://images.unsplash.com/photo-1539252554453-1f1a5af5b5ae?w=500&h=400&fit=crop' },
    { id: 21, name: 'Chilli Cheese Bites', category: 'sides', price: 3.49, description: 'Bite-sized chilli cheese nuggets. Crispy and gooey.', image: 'https://images.unsplash.com/photo-1626082927389-6cd097cdc6ec?w=500&h=400&fit=crop' },
    { id: 22, name: 'Coke', category: 'drinks', price: 1.49, description: '330ml can.', image: 'https://images.unsplash.com/photo-1622483767028-3f66f32aef97?w=500&h=400&fit=crop' },
    { id: 23, name: 'Coke Zero', category: 'drinks', price: 1.49, description: '330ml can. No sugar.', image: 'https://images.unsplash.com/photo-1622483767028-3f66f32aef97?w=500&h=400&fit=crop' },
]

// make it a meal increases by 2.50

export const mealSideOptions: MealOption[] = [
    { id: 1, name: 'Fries', price: 0.00 },
    { id: 2, name: 'Peri Fries', price: 0.50 },
    { id: 3, name: 'Onion Rings', price: 0.50 },
    { id: 4, name: 'Mozzarella Sticks', price: 1.00 },
    { id: 5, name: 'Chilli Cheese Bites', price: 1.00 },
]

export const drinkOptions: MealOption[] = [
    { id: 1, name: 'Coke', price: 0.00 },
    { id: 2, name: 'Coke Zero', price: 0.00 },
    { id: 3, name: 'Sprite', price: 0.00 },
    { id: 4, name: 'Fanta', price: 0.00 },
    { id: 5, name: 'Milk Shake', price: 3.50 },
]

const burgerAndWrapOptions = [
    { name: 'Cheese', price: 0.50 },
    { name: 'Turkey Bacon', price: 0.75 },
    { name: 'Onions', price: 0.25 },
    { name: 'Lettuce', price: 0.25 },
    { name: 'Pickles', price: 0.25 },
    { name: 'Jalapeños', price: 0.25 },
    { name: "Go Grill'a (+1 Chicken Patty)", price: 2.00, isProtein: true },
    { name: 'Go Chimp (+2.5 oz Beef)', price: 2.00, isProtein: true },
    { name: 'Go Ape (+5 oz Beef)', price: 4.00, isProtein: true },
    { name: 'Extra Smash Sauce', price: 0.50 },
    { name: 'Extra Honey Mustard Sauce', price: 0.50 }
]

const loadedFriesOptions = [
    { name: 'Extra Cheese', price: 0.50 },
    { name: 'Extra Jalapeños', price: 0.25 },
    { name: "Go Grill'a (+1 Chicken Patty)", price: 2.00, isProtein: true },
    { name: 'Go Chimp (+2.5 oz Beef)', price: 2.00, isProtein: true },
    { name: 'Go Ape (+5 oz Beef)', price: 4.00, isProtein: true },
]


// export const combos = [
//     { name: 'Loaded Box Deal', price: 9.99, description: 'Any Burger with Loaded Fries and a Drink.' },
//     { name: 'Chicken Box Deal', price: 9.99, description: 'Chicken Burger or Chicken Wrap with Fries and 2 Strips or 3 Wings and a Drink.' },
// ]

export const extrasByCategory = {
    burgers: burgerAndWrapOptions,
    wraps: burgerAndWrapOptions,
    chicken: [{ name: 'Sauce', price: 0 }],
    'loaded-fries': loadedFriesOptions,
}

export const chickenSauceOptions = ['Lemon & Herb', 'Mild', 'Wild', 'Honey Sriracha'];
