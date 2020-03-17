// Must to replace undefined by null value because sqlite does not support it.
export const removeUndefinedAttributeValues = object => {
  Object.entries(object).forEach(objectEntry => {
    if (objectEntry[1] === undefined) {
      object[objectEntry[0]] = null
    }
  })

  return object
}
