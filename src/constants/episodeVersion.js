const TYPE_SUBTITLE = {id: 1, name: 'Phụ đề'}
const TYPE_VOICEOVER = {id: 2, name: 'Lồng tiếng'}
const TYPE_PRESENT_NORTH = {id: 3, name: 'Thuyết minh giọng Bắc'}
const TYPE_PRESENT_SOUTH = {id: 4, name: 'Thuyết minh giọng Nam'}

const getTypeText = (id) => {
  const type = listType().find(item => item.id === Number(id))
  if (type) return type.name
  return "N/A"
}

const listType = () => {
  return [
    TYPE_SUBTITLE,
    TYPE_VOICEOVER,
    TYPE_PRESENT_NORTH,
    TYPE_PRESENT_SOUTH,
  ]
}

export {
  getTypeText,
  listType,
  TYPE_SUBTITLE,
  TYPE_VOICEOVER,
  TYPE_PRESENT_NORTH,
  TYPE_PRESENT_SOUTH,
}