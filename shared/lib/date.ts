import dayjs from "dayjs"
import utc from "dayjs/plugin/utc"
import type { ConfigType } from "dayjs"

dayjs.extend(utc)

export const formatDate = (value: ConfigType, format: string) => dayjs.utc(value).format(format)
