const HelpRequestFixtures = {
    oneHelpRequest: {
      id: 1,
      requesterEmail: "erik_rodriguez@ucsb.edu",
      teamId: "team4",
      tableOrBreakoutRoom: "table",
      requestTime: "2026-04-29T12:00:00",
      explanation: "Help request for team 4 table",
      solved: false,
    },
    threeHelpRequests: [
      {
        id: 1,
        requesterEmail: "erik_rodriguez@ucsb.edu",
        teamId: "team4",
        tableOrBreakoutRoom: "table",
        requestTime: "2026-04-29T12:00:00",
        explanation: "Help request for team 4 table",
        solved: false,
      },
      {
        id: 5,
        requesterEmail: "pconrad@ucsb.edu",
        teamId: "team9",
        tableOrBreakoutRoom: "breakout",
        requestTime: "2026-04-29T19:30:00",
        explanation: "Help request for team 9 breakout",
        solved: false,
      },
      {
        id: 6,
        requesterEmail: "jane_doe@gmail.com",
        teamId: "team10",
        tableOrBreakoutRoom: "breakout",
        requestTime: "2026-04-29T18:00:00",
        explanation: "Help request for team 10 breakout",
        solved: true,
      },
    ],
  };
  
  export { HelpRequestFixtures };
  