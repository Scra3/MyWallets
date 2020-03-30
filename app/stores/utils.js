// Must to replace undefined by null value because sqlite does not support it.
export const removeUndefinedAttributeValues = object => {
  Object.entries(object).forEach(objectEntry => {
    if (objectEntry[1] === undefined || objectEntry[1] === '') {
      object[objectEntry[0]] = null
    }
  })

  return object
}

export const replaceNullValueToBlank = aString => {
  return aString ? aString : ''
}

export const convertBooleanToNumericBoolean = aBoolean => {
  return aBoolean ? 1 : 0
}
