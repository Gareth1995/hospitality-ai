import { chromium } from "playwright";

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const hotelName = searchParams.get("hotelName");
  const website = searchParams.get("website");

  console.log("Hotel name:",hotelName);
  console.log("Website",website);
  if (!hotelName || !website) {
    return new Response(JSON.stringify({ error: "Missing hotelName or website parameter" }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }

  try {
    // Launch Playwright browser
    const browser = await chromium.launch({ headless: false });
    const page = await browser.newPage();

    // Navigate to the appropriate website
    if (website === "agoda") {
        await page.goto("https://www.agoda.com/");

        // Agoda scraping logic

    } else if (website === "booking") {
        // await page.goto("https://www.booking.com/");
        await page.goto(`https://www.booking.com/searchresults.html?ss=${hotelName}&ssne=Cape+Town&ssne_untouched=Cape+Town&label=gen173nr-1FCAEoggI46AdIM1gEaPsBiAEBmAExuAEXyAEM2AEB6AEB-AECiAIBqAIDuALMkM68BsACAdICJDU1MjE0MjFhLTZhOTMtNDIwYi1iOWY2LTU4Njg4YTg0M2Q5YtgCBeACAQ&sid=0ab13e536bea694c6b119af66302681e&aid=304142&lang=en-us&sb=1&src_elem=sb&src=searchresults&dest_id=7381465&dest_type=hotel&place_id=hotel%2F7381465&ac_position=0&ac_click_type=b&ac_langcode=en&ac_suggestion_list_length=4&search_selected=true&search_pageview_id=52a460f8a5f3049e&ac_meta=GhA0MmEzNjQzYzRjNTgwNmU2IAAoATICZW46Bmt3YW50dUAASgBQAA%3D%3D&checkin=2025-01-24&checkout=2025-01-25&group_adults=2&no_rooms=1&group_children=0`);

        // locate and click first property card
        await page.waitForTimeout(3000);
        const firstPropertyCard = await page
        .locator('[data-testid="property-card-desktop-single-image"]')
        .first();

        // click on search bar  to remove calendar block
        const inputField = await page.locator(`input[name="ss"]`);
        await inputField.click();

        // Wait for the new tab to be opened after clicking the property card
        const [newTab] = await Promise.all([
            page.context().waitForEvent('page'), // Wait for the new tab to open
            firstPropertyCard.click() // Click the property card
        ]);

        // click see reviews
        await newTab.locator('[data-testid="fr-read-all-reviews"]').waitFor({ state: 'visible' });
        await newTab.waitForTimeout(5000);
        await newTab.locator('[data-testid="fr-read-all-reviews"]').click();

        console.log('read all reviews clicked');
                        
        // Locate the last <li> element within the <ol> under the <div>
        let lastReviewPageNum = await newTab.locator('div.ab95b25344 > ol > li:last-child').textContent();

        // Convert the text content to an integer
        lastReviewPageNum = parseInt(lastReviewPageNum.trim(), 10); // Use base 10 for safety
        
        // iterate lastReviewPageNum times to get all reviews from each page
        // Initialize an array to store the reviews
        const reviewshtml = [];
        for (let i = 1; i < lastReviewPageNum + 1; i++) {
          
          // select ith page of reviews
          console.log(`Navigating to page ${i}`);
          
          await newTab.locator(`button[aria-label=" ${i}"]`).click();
          console.log('Navigation successful');

          await newTab.waitForTimeout(3000);
          const reviews = await newTab.locator('div.c402354066'); // getting all review text

          // Get the count of review statements
          const count = await reviews.count();
          console.log(`Found ${count} review cards.`);

          // Loop through each matching review block and extract its text content
          for (let i = 0; i < count; i++) {
            const divText = await reviews.nth(i).textContent();
            if (divText) {
              reviewshtml.push(divText.trim()); // Trim any extra whitespace
            }
          }
          console.log('Reviews pushed to array');
        }

        // Log the reviews
        console.log('Reviews:', reviewshtml);

        await page.waitForTimeout(5000);

    } else {
      await browser.close();
      return new Response(JSON.stringify({ error: "Unsupported website" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    // return new Response(JSON.stringify({ hotelName, reviews }), {
    //   status: 200,
    //   headers: { "Content-Type": "application/json" },
    // });
  } catch (error) {
    console.error("Scraping error:", error);
    return new Response(
      JSON.stringify({ error: "Scraping failed", details: error.message }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
}
