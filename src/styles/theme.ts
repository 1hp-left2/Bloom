export const palette = {
  forest: '#5F7D4E',
  sage: '#A7BE9B',
  cream: '#F7F4EA',
  beige: '#E9E3D5',
  blush: '#E9B7B7',
  sky: '#A7D8DE',
  dark: '#2F3A2F',
  moss: '#7D9867',
  amber: '#D7A84D',
  pond: '#7EB6BE',
  lavender: '#BCA9D6',
  white: '#FFFDF7'
} as const;

export const spacing = (units: number) => units * 8;

export const radii = {
  card: 24,
  pill: 999,
  soft: 16
} as const;

export const shadows = {
  soft: {
    shadowColor: palette.dark,
    shadowOpacity: 0.08,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: 8 },
    elevation: 3
  }
};
