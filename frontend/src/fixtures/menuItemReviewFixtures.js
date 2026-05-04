/*
  private long itemId;
  private String reviewerEmail;
  private int stars;
  private LocalDateTime dateReviewed;
  private String comments;
*/

const menuItemReviewFixtures = {
  oneReview: {
    id: 1,
    itemId: 1,
    reviewerEmail: "tladha@ucsb.edu",
    stars: 5,
    dateReviewed: "2026-04-30T12:00:00",
    comments: "Super yummy!",
  },
  threeReviews: [
    {
      id: 1,
      itemId: 1,
      reviewerEmail: "tladha@ucsb.edu",
      stars: 5,
      dateReviewed: "2026-04-30T12:00:00",
      comments: "Super yummy!",
    },
    {
      id: 2,
      itemId: 2,
      reviewerEmail: "tladha@ucsb.edu",
      stars: 4,
      dateReviewed: "2026-04-31T01:00:00",
      comments: "Pretty good...",
    },
    {
      id: 3,
      itemId: 3,
      reviewerEmail: "tladha@ucsb.edu",
      stars: 2,
      dateReviewed: "2026-04-29T07:00:00",
      comments: "Not great",
    },
  ],
};

export { menuItemReviewFixtures };
