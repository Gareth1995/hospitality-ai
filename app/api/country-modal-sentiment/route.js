import { pool } from '@/lib/db'; // Your DB connection pool

// API handler to fetch modal sentiment per country
export async function GET() {
  try {
    console.log("Fetching modal sentiment per country...");
    const client = await pool.connect();

    // Query to get the modal sentiment for each country
    const result = await client.query(`
      SELECT country, mode() WITHIN GROUP (ORDER BY sentiment) AS modal_sentiment
      FROM reviews
      GROUP BY country;
    `);

    client.release(); // Release the client back to the pool

    return new Response(JSON.stringify(result.rows), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Database error:", error);
    return new Response(JSON.stringify({ error: "Internal server error" }), {
      status: 500,
    });
  }
}
