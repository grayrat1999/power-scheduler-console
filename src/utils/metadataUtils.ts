type MateDTO = {
  code: string
  label: string
  options: MateDTO[]
}

export const buildMetadataOptions = (matedatas: MateDTO[]) => {
  return matedatas.reduce((obj: any, it: any) => {
    obj[it.code] = buildOptions(it)
    return obj
  }, {})
}

export const buildOptions = (mate: MateDTO) => {
  return mate.options.map((it) => {
    return {
      label: it.label,
      value: it.code
    }
  })
}
