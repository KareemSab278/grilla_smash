import { useEffect, useState } from 'react'

interface ButtonProps {
    onClick: () => void
    title: string
    children?: React.ReactNode
    color?: string
    disabled?: boolean
    optionalStyles?: React.CSSProperties
    className?: string
}

export const Buttons = {
    primary: ({ onClick, title, children, disabled }: ButtonProps) => (
        <RenderButton onClick={onClick} title={title} disabled={disabled}>{children}</RenderButton>
    ),
    secondary: ({ onClick, title, children, disabled }: ButtonProps) => (
        <RenderButton onClick={onClick} title={title} color={'#222222'} disabled={disabled} optionalStyles={{ color: '#F7931E', border: '2px solid #F7931E'}}>{children}</RenderButton>
    ),
    category: ({ onClick, title, children, disabled, optionalStyles }: ButtonProps) => (
        <RenderButton onClick={onClick} title={title} color={'#222222'} disabled={disabled} optionalStyles={optionalStyles}>{children}</RenderButton>
    ),
}

const RenderButton = ({ onClick, title, children, color, disabled, optionalStyles, className }: ButtonProps) => {
    const [clicked, setClicked] = useState(false)
    const [hovered, setHovered] = useState(false)

    const BtnColor = color || '#F7931E'

    useEffect(() => {
        if (clicked) {
            setTimeout(() => { setClicked(false) }, 150)
        }
    }, [clicked])

    return (
        <button
            disabled={disabled}
            style={{
                ...styles.primary_button,
                background: BtnColor,
                transform: clicked ? 'scale(0.9)' : hovered ? 'scale(1.1)' : 'scale(1)',
                opacity: disabled ? 0.6 : 1,
                cursor: disabled ? 'not-allowed' : 'pointer',
                ...optionalStyles,
            }}
            className={className}
            onClick={() => { if (!disabled) { setClicked(true); onClick() } }}
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
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
        transition: 'all 0.3s ease',
        textTransform: 'uppercase' as const,
        display: 'inline-block',
        height: 'auto',
        cursor: 'pointer',
    }}
