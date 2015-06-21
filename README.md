Best match search algorithm
====================

This project demonstrates the use of `Machine learning` to find optimal choice for candidates.

**The algorithm maintains following key structures:**
* `Attribute Map` : This dictionary stores every attributes' every possible value's weight. It is used to
learn about user's like dislike and weight of attribute is adjusted according to user input.

**Algorithm's high level steps:**
* At the start `Attribute Map` is initialized to its default value.
* The best company based on current `Attribute Map` is found and shown to the user.
* Algorithm also predicts user's decision.
* If user's decision and algorithm's prediction  matches it goes to step 2.
* Otherwise, algorithm tries to learn from user's decision
* It starts by analyzing negative attribute and positive attribute values.
* It adjusts `Attribute Map` such that **If asked again, It will predict same decision as user predicted**
* It goes to step 2.
