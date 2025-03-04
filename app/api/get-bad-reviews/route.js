import { ApiHandler } from "@/utils/apiTemplate";

const redisCacheKey = "bad_reviews";

const sqlCommand = `SELECT positive_review, source_name, negative_review, review_rating, reviewer_name, sentiment
                    FROM reviews
                    WHERE hotel_id = $1
                    AND seen = FALSE
                    AND sentiment IN ('anger', 'fear', 'disgust', 'sadness')`;

export const GET = ApiHandler(redisCacheKey, sqlCommand);