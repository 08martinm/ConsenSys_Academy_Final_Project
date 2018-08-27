Distributed Bounty dApp
=======================

Explanation:
------------
The bounty dApp allows a bounty-poster to post a bounty description and price, respondents to answer the bounty, the original poster to answer the bounty, and allows for arbitration of disputes.

The arbitration process happens by randomly selecting and arbitrator from a pre-approved list, using an api call made by Oraclize, and enabling them to settle the dispute.

Set-up:
-------
1. Run `yarn start-ganache`
2. In a separate terminal window, run `yarn ethereum-bridge`. You must wait for this to load completely; can take a minute or two.
3. Sign into metamask using truffle's development mnemonic: `candy maple cake sugar pudding cream honey rich smooth crumble sweet treat`
4. In a third terminal window, run `yarn truffle compile && yarn truffle migrate`
5. Run "yarn start"
6. Go to `localhost:5000` to interact with dApp

Interacting with dApp using front-end:
--------------------------------------
1. Go to `localhost:5000`
2. Make sure that you are signed into metamask using truffle's development mnemonic: `candy maple cake sugar pudding cream honey rich smooth crumble sweet treat`
3. Make sure that metamask is pointed to `localhost:8545`
4. Add 5 accounts in metamask by simply clicking "create account" from metamask (these will match the development accounts)
5. By creating the accounts, the front-end has a listener to add them to your accounts list. If it didn't work, simply toggle between the first 5 accounts in metamask and the front-end will add them to the account selector.
6. Once you have 5 accounts, select the first account from the account selector.
7. Fill out the information for the section "Create a bounty" and click post
8. After a few seconds, the information you posted should appear under "List of Bounties"
9. You may click on the accordions to expand the different sections.
10. Change to account #2, expand "Claim Bounty" section, fill out a response, click "Submit", and approve tx from metamask
11. Change account back to account #1, expand "Claimants", expand first claimant, click "Reject this answer", and approve tx from metamask
12. Change account back to account #2, expand "Claimants", expand first claimant, click "Dispute this result", and approve tx from metamask
13. Change account back to account #3 (then account #4 if no option available), expand "Claimants", expand first claimant, click "Approve" or "Reject", and approve tx from metamask

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
