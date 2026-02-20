import { User } from "@/types/types";

/**
 * Generate a personalized and contextual prompt for someone viewing a product page.
 * @param {Partial<User>} user - The session data of the viewer.
 * @param {string} productName - The name of the product being viewed.
 * @param {string} freelancerName - The freelancer's name (seller of the product).
 * @param {number} freelancerRating - The freelancer's average rating.
 * @param {number} productPrice - The price of the product.
 * @param {string} productCategory - The category of the product.
 * @returns {string} The generated prompt.
 */
export const generateProductViewerPrompt = (
  user: Partial<User>,
  productName: string,
  freelancerName: string,
  freelancerRating: number,
  productPrice: number,
  productCategory: string
): string => {
  const fullName = user.firstName
    ? `${user.firstName} ${user.lastName || ""}`.trim()
    : "Guest Viewer";

  return `
    Help the viewer (${fullName}) make an informed decision about the product "${productName}" in the "${productCategory}" category.

    1. **Product Overview:**
       - "${productName}" is listed under the "${productCategory}" category by freelancer "${freelancerName}".
       - The freelancer has an average rating of ${freelancerRating} stars.

    2. **Product Value:**
       - The price of this product is $${productPrice.toFixed(2)}.
       - Recommend why this product might be suitable (e.g., trends, value for money, or relevance to their interests).

    3. **Freelancer Insights:**
       - Freelancer "${freelancerName}" is highly rated with an average score of ${freelancerRating}.
       - Highlight any reputation details, such as the number of successful sales or positive reviews.

    4. **General Recommendations:**
       - Focus on general tips about evaluating the product and seller.
       - Consider the viewer's potential needs based on the product category.

    5. **Actionable Recommendations:**
       - Provide insights about the product's use cases or benefits.
       - Suggest if the viewer should explore related products in the same category.

    Ensure the response is friendly, informative, and focuses on helping the viewer make the best decision.
  `;
};

