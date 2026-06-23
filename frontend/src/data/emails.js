// Raw inbound emails (no priority stored). The seed builder runs the AI
// classifier on each so priority/summary/suggested_action are computed, exactly
// like the original backend did.

export const RAW_EMAILS = [
  {
    id: "e1",
    tenantId: "t1",
    subject: "Strong gas smell in my apartment",
    body:
      "Hello, there is a strong smell of gas in my kitchen since this morning. I have opened the windows but the smell is getting worse. I am worried this is an emergency. Please send someone immediately.",
    received_at: "2026-06-22T07:42:00",
  },
  {
    id: "e2",
    tenantId: "t2",
    subject: "Dishwasher leaking water onto the floor",
    body:
      "Hi, my dishwasher started leaking water all over the kitchen floor last night. The appliance is not working properly and I am worried about water damage. Can you schedule a repair as soon as possible?",
    received_at: "2026-06-22T08:15:00",
  },
  {
    id: "e3",
    tenantId: "t3",
    subject: "Question about visitor parking",
    body:
      "Hello, I have a quick question. How do I request a visitor parking permit for the weekend? My family is coming to visit. Thank you.",
    received_at: "2026-06-22T09:05:00",
  },
  {
    id: "e4",
    tenantId: "t4",
    subject: "My rent payment will be late this month",
    body:
      "Good morning, I wanted to let you know my rent payment will be a few days overdue this month due to a delay in my paycheck. I will settle the outstanding balance by the 5th. Sorry for the inconvenience.",
    received_at: "2026-06-21T17:30:00",
  },
  {
    id: "e5",
    tenantId: "t5",
    subject: "Thank you for fixing the elevator",
    body:
      "Hi, just wanted to say thank you for fixing the elevator so quickly this week. I really appreciate the fast response. Have a great day!",
    received_at: "2026-06-21T14:12:00",
    // genuinely low value — seeded as a manual P4 to demonstrate the tier
    seedPriority: "p4",
  },
  {
    id: "e6",
    tenantId: "t6",
    subject: "No heat in my apartment",
    body:
      "There is no heat in my apartment and it is extremely cold tonight. The thermostat is on but nothing happens. I have a small child at home, this feels like an emergency. Please help urgently.",
    received_at: "2026-06-22T06:20:00",
  },
  {
    id: "e7",
    tenantId: "t7",
    subject: "When does my lease expire?",
    body:
      "Hello, I am planning ahead and wondering when my lease expires. Could you let me know the contract expiration date so I can decide about renewing? Thank you very much.",
    received_at: "2026-06-20T11:48:00",
  },
  {
    id: "e8",
    tenantId: "t8",
    subject: "Confirming I received the renewal notice",
    body:
      "Hi, this is just to confirm that I received the lease renewal notice you sent. Everything looks fine, no questions for now. Thanks for the heads up.",
    received_at: "2026-06-20T16:02:00",
    seedPriority: "p4",
  },
  {
    id: "e9",
    tenantId: "t3",
    subject: "Burning smell coming from a wall outlet",
    body:
      "I just noticed a burning smell and a spark coming from the electrical outlet in my living room. I have stopped using it. This seems like a serious safety hazard, please send an electrician right away.",
    received_at: "2026-06-22T08:55:00",
  },
  {
    id: "e10",
    tenantId: "t2",
    subject: "Request a copy of my contract and rent amount",
    body:
      "Hello, could you please send me a copy of my rental contract? I would also like to confirm how much my monthly rent is. Thanks in advance.",
    received_at: "2026-06-19T10:25:00",
  },
  // ---- Property owner / asset-management requests ----
  {
    id: "e11",
    tenantId: null,
    contact_name: "Daniel Whitfield",
    contact_role: "Property Owner",
    building: "Parkview Apartments",
    subject: "CAPEX approval needed for roof replacement",
    body:
      "Hi, following the latest survey I would like to move ahead with the roof replacement at Parkview. Could you prepare the CAPEX figures and a short capital expenditure summary so I can approve the budget? Thanks.",
    received_at: "2026-06-21T09:40:00",
  },
  {
    id: "e12",
    tenantId: null,
    contact_name: "Laura Beckmann",
    contact_role: "Asset Manager",
    building: "Riverside Lofts",
    subject: "Q3 budget planning review for the portfolio",
    body:
      "Good afternoon, we need to start the Q3 budget planning for the portfolio. Please pull together the service charge budget and forecast so we can schedule a review with ownership next week.",
    received_at: "2026-06-20T15:10:00",
  },
  {
    id: "e13",
    tenantId: null,
    contact_name: "Daniel Whitfield",
    contact_role: "Property Owner",
    building: "Parkview Apartments",
    subject: "BREEAM certification documentation request",
    body:
      "Hello, our investors are asking about the building's sustainability rating. Could you send over the BREEAM certification documentation and any energy performance reports we have on file?",
    received_at: "2026-06-19T13:55:00",
  },
  {
    id: "e14",
    tenantId: null,
    contact_name: "Thomas Reid",
    contact_role: "Property Owner",
    building: "Maple Court",
    subject: "Lease restructuring request for commercial unit",
    body:
      "Hi, I would like to discuss a lease restructuring for the commercial unit on the ground floor, including a possible rent review. Can you prepare the current lease terms so asset management can advise?",
    received_at: "2026-06-18T11:20:00",
  },
];
