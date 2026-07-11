import { useState } from 'react'
import type { CartItem, Extra, MealOption } from '../Types'
import {
    canMakeItAMeal, getAvailableExtras, getCartItemTotal,
    getDrinkOptions, getSauceOptions, getSideOptions, MEAL_PRICE_INCREASE,
} from '../Logic/editor'
import { Buttons } from './Buttons'

interface ItemEditorProps {
    cartItem: CartItem
    onSave: (updated: CartItem) => void
    onBack: () => void
}

export const ItemEditor = ({ cartItem, onSave, onBack }: ItemEditorProps) => {
    const [selectedExtras, setSelectedExtras] = useState<Extra[]>(cartItem.extras ?? [])
    const [sauceChoice, setSauceChoice] = useState<string>(cartItem.sauceChoice ?? '')
    const [isMeal, setIsMeal] = useState<boolean>(!!cartItem.meal)
    const [selectedDrink, setSelectedDrink] = useState<MealOption | null>(cartItem.meal?.drink ?? null)
    const [selectedSide, setSelectedSide] = useState<MealOption | null>(cartItem.meal?.side ?? null)

    const availableExtras = getAvailableExtras(cartItem.product)
    const isChicken = cartItem.product.category === 'chicken'
    const mealEligible = canMakeItAMeal(cartItem.product)
    const sauceMissing = isChicken && !sauceChoice
    const sauceOptions = getSauceOptions()
    const drinkOptions = getDrinkOptions()
    const sideOptions = getSideOptions()

    const selectedProteinExtra = selectedExtras.find(e => e.isProtein)
    const toggleExtra = (extra: Extra) => {
        const isSelected = selectedExtras.some(e => e.name === extra.name)
        if (isSelected) {
            setSelectedExtras(prev => prev.filter(e => e.name !== extra.name))
            return
        }

        if (extra.isProtein && selectedProteinExtra) {
            return
        }

        setSelectedExtras(prev => [...prev, extra])
    }

    const isExtraSelected = (extra: Extra) => selectedExtras.some(e => e.name === extra.name)

    const updatedItem: CartItem = {
        ...cartItem,
        extras: selectedExtras.length > 0 ? selectedExtras : undefined,
        sauceChoice: isChicken && sauceChoice ? sauceChoice : undefined,
        meal: isMeal && selectedDrink && selectedSide
            ? { drink: selectedDrink, side: selectedSide }
            : null,
    }

    const itemTotal = getCartItemTotal(updatedItem)
    const canSave = (!isChicken || !!sauceChoice) && (!isMeal || (selectedDrink !== null && selectedSide !== null))

    return (
        <div style={{ padding: '0 4px', display: 'flex', flexDirection: 'column'}}>

            {/* Item info */}
            <div style={{ display: 'flex', gap: 14, alignItems: 'center', padding: '16px 0', borderBottom: '1px solid #2a2a2a' }}>
                <img
                    src={cartItem.product.image}
                    alt={cartItem.product.name}
                    style={{ width: 64, height: 64, borderRadius: 10, objectFit: 'cover', flexShrink: 0 }}
                />
                <div>
                    <h3 style={{ margin: 0, color: '#F7F7F7', fontSize: '1rem', fontFamily: 'Poppins, sans-serif' }}>
                        {cartItem.product.name}
                    </h3>
                    <p style={{ margin: '4px 0 0', color: '#888', fontSize: '0.82rem' }}>
                        Base price: £{cartItem.product.price.toFixed(2)} · Qty: {cartItem.quantity}
                    </p>
                </div>
            </div>

            {/* Sauce selection — chicken only */}
            {isChicken && (
                <div style={{ padding: '16px 0', borderBottom: '1px solid #2a2a2a' }}>
                    <SectionLabel>Choose Your Sauce</SectionLabel>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginTop: 10 }}>
                        {sauceOptions.map(sauce => (
                            <PillButton
                                key={sauce}
                                active={sauceChoice === sauce}
                                onClick={() => setSauceChoice(prev => prev === sauce ? '' : sauce)}
                            >
                                {sauce}
                            </PillButton>
                        ))}
                    </div>

                    {sauceMissing && (
                        <p style={{ margin: '10px 0 0', color: '#ff8a8a', fontSize: '0.9rem' }}>Please select a sauce to continue.</p>
                    )}
                </div>
            )}

            {/* Extras — non-chicken categories */}
            {availableExtras.length > 0 && !isChicken && (
                <div style={{ padding: '16px 0', borderBottom: '1px solid #2a2a2a' }}>
                    <SectionLabel>Add Extras</SectionLabel>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginTop: 10 }}>
                        {availableExtras.map(extra => (
                            <label
                                key={extra.name}
                                style={{
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    alignItems: 'center',
                                    padding: '9px 12px',
                                    borderRadius: 10,
                                    background: isExtraSelected(extra) ? 'rgba(247,147,30,0.08)' : '#1f1f1f',
                                    border: `1.5px solid ${isExtraSelected(extra) ? '#F7931E' : '#2d2d2d'}`,
                                    opacity: (!!extra.isProtein && !isExtraSelected(extra) && !!selectedProteinExtra) ? 0.6 : 1,
                                    cursor: (!!extra.isProtein && !isExtraSelected(extra) && !!selectedProteinExtra) ? 'not-allowed' : 'pointer',
                                    transition: 'all 0.15s',
                                }}
                            >
                                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                                    <input
                                        type="checkbox"
                                        checked={isExtraSelected(extra)}
                                        onChange={() => { if (!extra.isProtein || isExtraSelected(extra) || !selectedProteinExtra) toggleExtra(extra) }}
                                        disabled={!!extra.isProtein && !isExtraSelected(extra) && !!selectedProteinExtra}
                                        style={{ accentColor: '#F7931E', width: 15, height: 15, cursor: (!!extra.isProtein && !isExtraSelected(extra) && !!selectedProteinExtra) ? 'not-allowed' : 'pointer' }}
                                    />
                                    <span style={{ color: '#F0F0F0', fontSize: '0.9rem', fontFamily: 'Poppins, sans-serif' }}>
                                        {extra.name}
                                    </span>
                                </div>
                                <span style={{ color: '#F7931E', fontSize: '0.85rem', fontWeight: 600 }}>
                                    +£{extra.price.toFixed(2)}
                                </span>
                            </label>
                        ))}
                    </div>

                    {sauceMissing && (
                        <p style={{ margin: '10px 0 0', color: '#ff8a8a', fontSize: '0.9rem' }}>Please select a sauce to continue.</p>
                    )}
                </div>
            )}

            {/* Make it a Meal */}
            {mealEligible && (
                <div style={{ padding: '16px 0', borderBottom: '1px solid #2a2a2a' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <div>
                            <SectionLabel>Make it a Meal</SectionLabel>
                            <p style={{ margin: '3px 0 0', color: '#777', fontSize: '0.78rem' }}>
                                Add a side & drink for £{MEAL_PRICE_INCREASE.toFixed(2)}
                            </p>
                        </div>
                        <ToggleSwitch on={isMeal} onToggle={() => {setIsMeal(p => !p)}} />
                    </div>

                    {isMeal && (
                        <div style={{ marginTop: 16, display: 'flex', flexDirection: 'column', gap: 14 }}>
                            <div>
                                <p style={{ margin: '0 0 8px', color: '#aaa', fontSize: '0.82rem' }}>Choose a Side</p>
                                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                                    {sideOptions.map(side => (
                                        <PillButton
                                            key={side.id}
                                            active={selectedSide?.id === side.id}
                                            onClick={() => setSelectedSide(side)}
                                        >
                                            {side.name}&nbsp;
                                            <span style={{ opacity: 0.65, fontSize: '0.78rem' }}>£{side.price.toFixed(2)}</span>
                                        </PillButton>
                                    ))}
                                </div>
                            </div>
                            <div>
                                <p style={{ margin: '0 0 8px', color: '#aaa', fontSize: '0.82rem' }}>Choose a Drink</p>
                                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                                    {drinkOptions.map(drink => (
                                        <PillButton
                                            key={drink.id}
                                            active={selectedDrink?.id === drink.id}
                                            onClick={() => setSelectedDrink(drink)}
                                        >
                                            {drink.name}&nbsp;
                                            <span style={{ opacity: 0.65, fontSize: '0.78rem' }}>£{drink.price.toFixed(2)}</span>
                                        </PillButton>
                                    ))}
                                </div>
                            </div>
                            {isMeal && (!selectedSide || !selectedDrink) && (
                                <p style={{ margin: 0, color: '#F7931E', fontSize: '0.78rem' }}>
                                    Please select a side and drink to continue.
                                </p>
                            )}
                        </div>
                    )}
                </div>
            )}

            {/* Price summary */}
            <div style={{ padding: '14px 0', borderBottom: '1px solid #2a2a2a' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ color: '#aaa', fontSize: '0.9rem' }}>Item Total (×{cartItem.quantity})</span>
                    <span style={{ color: '#F7931E', fontSize: '1.05rem', fontWeight: 700 }}>
                        £{itemTotal.toFixed(2)}
                    </span>
                </div>
                {isMeal && selectedDrink && selectedSide && (
                    <p style={{ margin: '6px 0 0', color: '#4ade80', fontSize: '0.78rem' }}>
                        ✓ Meal deal applied — saving £{(MEAL_PRICE_INCREASE * cartItem.quantity).toFixed(2)}
                    </p>
                )}
            </div>

            {/* Actions */}
            <div style={{ display: 'flex', gap: 10, paddingTop: 18 }}>
                <Buttons.primary onClick={() => { if (canSave) onSave(updatedItem) }} title="Save Changes" disabled={!canSave} />
                <Buttons.secondary onClick={onBack} title="Back" />
            </div>
        </div>
    )
}

/* ── Small reusable sub-components ── */

const SectionLabel = ({ children }: { children: React.ReactNode }) => (
    <p style={{
        margin: 0,
        color: '#F7931E',
        textTransform: 'uppercase',
        letterSpacing: '0.07em',
        fontWeight: 700,
        fontFamily: "'Bebas Neue', sans-serif",
        fontSize: '1rem',
    } as React.CSSProperties}>
        {children}
    </p>
)

const PillButton = ({ active, onClick, children }: {
    active: boolean
    onClick: () => void
    children: React.ReactNode
}) => (
    <button
        type="button"
        onClick={onClick}
        style={{
            padding: '6px 14px',
            borderRadius: 20,
            border: `1.5px solid ${active ? '#F7931E' : '#3a3a3a'}`,
            background: active ? 'rgba(247,147,30,0.12)' : 'transparent',
            color: active ? '#F7931E' : '#aaa',
            cursor: 'pointer',
            fontSize: '0.85rem',
            fontFamily: 'Poppins, sans-serif',
            transition: 'all 0.15s',
        }}
    >
        {children}
    </button>
)

const ToggleSwitch = ({ on, onToggle }: { on: boolean; onToggle: () => void }) => (
    <button
        type="button"
        onClick={onToggle}
        aria-pressed={on}
        style={{
            width: 46,
            height: 26,
            borderRadius: 13,
            background: on ? '#F7931E' : '#333',
            border: 'none',
            cursor: 'pointer',
            position: 'relative',
            transition: 'background 0.2s',
            flexShrink: 0,
        }}
    >
        <span style={{
            position: 'absolute',
            top: 4,
            left: on ? 23 : 4,
            width: 18,
            height: 18,
            borderRadius: '50%',
            background: '#fff',
            transition: 'left 0.2s',
            display: 'block',
        }} />
    </button>
)
