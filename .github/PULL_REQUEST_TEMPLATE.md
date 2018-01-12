Hello, and thanks for contributing to <%= name %>!

## TL;DR

There are three main goals in this document, depending on the nature of your PR:

- [description](#description):  tell us about your PR.
- [checklist](#checklist): review the checklist that is most closely related to your PR.
- [qa](#qa): update the qa checklist for your reviewers.


## Title
Add a clear title using an action verb.
If it closes an issue, refer to it in your PR title by stating `closes #117` at the end.

## Description
To help others to quickly understand the nature of your pull request, please create a description that incorporates the following elements:

- [] What is accomplished by the PR.
- [] If you think some decisions may raise questions or require discussion, please state them and explain your choices.


## Checklist
Please use this checklist to verify that you took all the necessary steps.

- [ ] If closing an issue, all acceptance criteria are met.
- [ ] All existing unit tests are still passing.
- [ ] Add new passing unit tests to cover the code introduced by your PR and maintain test coverage.
- [ ] Update the readme if needed.
- [ ] Update or add any necessary API documentation.


## QA
When your PR is created, it is important to select a reviewer with knowledge of the code that has been changed.
It is also useful to guide reviewers, to this extent, please complete this QA list with areas that could be affected by your changes.

Dear reviewer, please perform the following QA steps before approving my lovely PR:
- [ ]  The app loads nominally.
- [ ]  Select service area using the county selector.
- [ ]  Upload a service area csv (FIX DATASET).
- [ ]  Upload a provider csv (FIX DATASET).
- [ ]  Verify that `NEW FEATRURE` works as expected, i.e. `DETAILS`.
