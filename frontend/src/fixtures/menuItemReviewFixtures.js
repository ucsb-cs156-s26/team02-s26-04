/*
  private long itemId;
  private String reviewerEmail;
  private int stars;
  private LocalDateTime dateReviewed;
  private String comments;
*/

const menuItemReviewFixtures = {
  oneReview: {
    itemId: 1,
    reviewerEmail: "tladha@ucsb.edu",
    stars: 5,
    dateReviewed: "2026-04-30T12:00:00",
    comments: "Super yummy!",
  },
  threeReviews: [
    {
      itemId: 1,
      reviewerEmail: "tladha@ucsb.edu",
      stars: 5,
      dateReviewed: "2026-04-30T12:00:00",
      comments: "Super yummy!",
    },
    {
      itemId: 2,
      reviewerEmail: "tladha@ucsb.edu",
      stars: 4,
      dateReviewed: "2026-04-31T01:00:00",
      comments: "Pretty good...",
    },
    {
      itemId: 3,
      reviewerEmail: "tladha@ucsb.edu",
      stars: 2,
      dateReviewed: "2026-04-29T07:00:00",
      comments: "Not great",
    },
  ],
};

export { menuItemReviewFixtures };
