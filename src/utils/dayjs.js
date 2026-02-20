import * as dayjs from 'dayjs'
import * as relativeTime from 'dayjs/plugin/relativeTime'
import * as localeVI from 'dayjs/locale/vi'
import * as updateLocale from 'dayjs/plugin/updateLocale'
import * as utc from 'dayjs/plugin/utc'
import * as timezone from 'dayjs/plugin/timezone'

dayjs.locale(localeVI)
dayjs.extend(updateLocale)
dayjs.extend(relativeTime)
dayjs.extend(utc)
dayjs.extend(timezone)

dayjs.updateLocale('vi', {
  weekdays: [
    "Chủ nhật", "Thứ 2", "Thứ 3", "Thứ 4", "Thứ 5", "Thứ 6", "Thứ 7"
  ]
})

export default dayjs