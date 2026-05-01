const recommendationRequestsFixtures = {
  oneRequest: {
    "id": 1,
    "requesterEmail": "meb@ucsb.edu",
    "professorEmail": "pconrad@cs.ucsb.edu",
    "explanation": "initial try",
    "dateRequested": "2026-04-30T00:00:00",
    "dateNeeded": "2026-05-15T00:00:00",
    "done": true
  },
  threeRequests: [
    {
    "id": 1,
    "requesterEmail": "meb@ucsb.edu",
    "professorEmail": "pconrad@cs.ucsb.edu",
    "explanation": "initial try",
    "dateRequested": "2026-04-30T00:00:00",
    "dateNeeded": "2026-05-15T00:00:00",
    "done": true
  },
  {
    "id": 2,
    "requesterEmail": "meb@ucsb.edu",
    "professorEmail": "pconrad@cs.ucsb.edu",
    "explanation": "initial try",
    "dateRequested": "2026-04-30T00:00:00",
    "dateNeeded": "2026-05-15T00:00:00",
    "done": false
  },
  {
    "id": 3,
    "requesterEmail": "meb@ucsb.edu",
    "professorEmail": "pconrad@cs.ucsb.edu",
    "explanation": "initial try",
    "dateRequested": "2026-04-30T00:00:00",
    "dateNeeded": "2026-08-15T00:00:00",
    "done": false
  }
  ],
};

export { recommendationRequestsFixtures };
