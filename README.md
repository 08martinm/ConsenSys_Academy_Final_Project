Distributed Bounty dApp
=======================

Explanation:
------------
The bounty dApp allows a bounty-poster to post a bounty description and price, respondents to answer the bounty, the original poster to answer the bounty, and allows for arbitration of disputes.

The arbitration process happens by randomly selecting and arbitrator from a pre-approved list, using an api call made by Oraclize, and enabling them to settle the dispute.

Set-up:
-------
1. Run "yarn start-ganache"
2. In a separate terminal window, run "yarn ethereum-bridge". You must wait for this to load completely; can take a minute or two.
3. Sign into metamask using truffle's development mnemonic: "candy maple cake sugar pudding cream honey rich smooth crumble sweet treat"
4. In a third terminal window, run "truffle compile && truffle migrate"
5. Run "yarn start"
6. Go to "localhost:5000" to interact with dApp

User Stories:
-------------
As a **job poster**:
- I can create a new bounty. I will set a bounty description and include the amount to be paid for a successful submission.
- I am able to view a list of bounties that I have already posted.
- By clicking on a bounty, I can review submissions that have been proposed.
- I can accept or reject the submitted work.
- Accepting proposed work will pay the submitter the deposited amount.
 
As a **bounty hunter**:
- I can submit work to a bounty for review.
- I can challenge a reviewer's decision if I think they have chosen the wrong answer, which sends the bounty to a randomly selected arbitrator from an arbitrator's list.

As an **arbitrator**:
- I can settle disputes between posters and submitters.
