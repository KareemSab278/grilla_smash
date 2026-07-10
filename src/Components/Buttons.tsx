import { useEffect, useState } from 'react'

interface ButtonProps {
    onClick: () => void
    title: string
    children?: React.ReactNode
    color?: string
    disabled?: boolean
}

export const Buttons = {
    primary: ({ onClick, title, children, disabled }: ButtonProps) => (
        <RenderButton onClick={onClick} title={title} disabled={disabled}>{children}</RenderButton>
    ),
    secondary: ({ onClick, title, children, disabled }: ButtonProps) => (
        <RenderButton onClick={onClick} title={title} color={'#222222'} disabled={disabled}>{children}</RenderButton>
    ),
}

const RenderButton = ({ onClick, title, children, color, disabled }: ButtonProps) => {
    const [clicked, setClicked] = useState(false)

    const BtnColor = color || '#F7931E'

    useEffect(() => {
        if (clicked) {
            setTimeout(() => { setClicked(false) }, 500)
        }
    }, [clicked])

    return (
        <button
            disabled={disabled}
            style={{
                ...styles.primary_button,
                background: clicked ? BtnColor : '#F7931E',
                transform: clicked ? 'scale(1.1)' : 'scale(1)',
                opacity: disabled ? 0.6 : 1,
                cursor: disabled ? 'not-allowed' : 'pointer',
            }}
            onClick={() => { if (!disabled) { setClicked(true); onClick() } }}
        >
            {title}{children}
        </button>
    )
}

const styles = {
    primary_button: {
        color: '#111111',
        border: 'none',
        padding: '15px 40px',
        fontFamily: "'Bebas Neue', sans-serif",
        fontSize: '1.3rem',
        letterSpacing: '2px',
        borderRadius: '50px',
        cursor: 'pointer',
        transition: 'all 0.3s ease',
        textTransform: 'uppercase' as const,
        boxShadow: '0 4px 15px rgba(247, 147, 30, 0.4)',
        display: 'inline-block',
    },
}
