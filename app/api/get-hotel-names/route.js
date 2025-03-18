import { ApiHandler } from "@/utils/apiTemplate";

const redisCacheKey = "distinct_hotel_names";

const sqlCommand = 'SELECT DISTINCT hotel_name FROM reviews;';

export const GET = ApiHandler(redisCacheKey, sqlCommand);