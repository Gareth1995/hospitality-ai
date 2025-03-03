import { ApiHandler } from "@/utils/apiTemplate";

const redisCacheKey = "rating_by_group";

const sqlCommand = `SELECT
                        REPLACE(group_type, '-', '') AS name, 
                        ROUND(AVG(review_rating), 2) AS average_rating
                        FROM reviews
                        WHERE hotel_id = $1
                        AND review_rating IS NOT NULL
                        GROUP BY name
                        ORDER BY name`;

export const GET = ApiHandler(redisCacheKey, sqlCommand);
