const attributeImages = import.meta.glob('@/assets/img/yugioh/attributes/*.png', {
    eager: true,
    import: 'default'
}) as Record<string, string>

/**
 * Returns the image path of the given attribute name.
 *
 * @param attribute - The card attribute
 * @returns The image path, or undefined if not found.
 */
export function getAttributeImage(attribute: string): string | undefined {
    const filename = `icon_${attribute.toLowerCase()}.png`

    const entry = Object.entries(attributeImages).find(([path]) =>
        path.endsWith(`/${filename}`)
    )

    return entry?.[1]
}